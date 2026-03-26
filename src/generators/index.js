import { getTimerSeconds, pick, questionSignature, questionTemplateSignature, randInt, shuffle } from '../engine-core'

export function generateSession(topic, difficulty, count, mode, lastQuestionTemplateSignature = null) {
      const list = [];
      const pool = topic === 'mixed'
        ? ['numerical', 'verbal', 'logical', 'concentration', 'planning', 'quantitative', 'mechanical']
        : [topic];
      let previousTemplateSignature = lastQuestionTemplateSignature;
      const usedSignatures = new Set();

      for (let i = 0; i < count; i++) {
        const t = topic === 'mixed' ? pool[i % pool.length] : pool[0];
        let q = generateQuestion(t, difficulty, mode);
        let signature = questionSignature(q);
        let templateSignature = questionTemplateSignature(q);
        for (let attempt = 0; attempt < 24 && (usedSignatures.has(signature) || templateSignature === previousTemplateSignature); attempt++) {
          q = generateQuestion(t, difficulty, mode);
          signature = questionSignature(q);
          templateSignature = questionTemplateSignature(q);
        }
        previousTemplateSignature = templateSignature;
        usedSignatures.add(signature);
        list.push({ ...q, id: `${q.topic}-${Date.now()}-${i}` });
      }
      return list;
    }

    export function generateQuestion(topic, difficulty, mode) {
      switch (topic) {
        case 'numerical': return generateNumerical(difficulty, mode);
        case 'verbal': return generateVerbal(difficulty, mode);
        case 'logical': return generateLogical(difficulty, mode);
        case 'concentration': return generateConcentration(difficulty, mode);
        case 'planning': return generatePlanning(difficulty, mode);
        case 'quantitative': return generateQuantitative(difficulty, mode);
        case 'mechanical': return generateMechanical(difficulty, mode);
        case 'mixed': return generateQuantitative(difficulty, mode);
        default: return generateNumerical(difficulty, mode);
      }
    }

    export function pieSvg(cx, cy, r, percentages, colors) {
      let startAngle = -Math.PI / 2;
      return percentages.map((pct, i) => {
        const angle = (pct / 100) * Math.PI * 2;
        const endAngle = startAngle + angle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        startAngle = endAngle;
        return `<path d="${path}" fill="${colors[i % colors.length]}"></path>`;
      }).join('');
    }

    export function generateNumerical(difficulty) {
      const types = difficulty === 'easy'
        ? ['bar-profit', 'pie-growth', 'factory-output', 'averages']
        : difficulty === 'medium'
        ? ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work']
        : ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work', 'table-comparison'];
      const type = pick(types);
      if (type === 'bar-profit') return numericalBarProfit(difficulty);
      if (type === 'loan-fine') return numericalLoanFine(difficulty);
      if (type === 'factory-output') return numericalFactoryOutput(difficulty);
      if (type === 'discount-table') return numericalDiscountTable(difficulty);
      if (type === 'averages') return numericalAverages(difficulty);
      if (type === 'time-work') return numericalTimeWork(difficulty);
      if (type === 'table-comparison') return numericalTableComparison(difficulty);
      return numericalPieGrowth(difficulty);
    }

    export function numericalBarProfit(difficulty) {
      const wage = pick([18, 20, 22, 25]);
      const scale = pick([200, 300, 400, 500]);
      const names = ['Mike', 'Paul', 'Hugh'];
      const hours = difficulty === 'easy'
        ? [randInt(140, 170), randInt(150, 180), randInt(160, 190)]
        : [randInt(150, 190), randInt(160, 200), randInt(170, 210)];
      const janUnits = [randInt(10, 24), randInt(8, 18), randInt(18, 32)];
      const profits = janUnits.map(x => x * scale);
      const wages = hours.map(h => h * wage);
      const enough = names.filter((_, i) => profits[i] >= wages[i]);
      const answerText = enough.length === 0 ? 'None of them' : enough.length === 3 ? 'They all did' : enough.join(' and ');
      const options = shuffle([
        answerText,
        'They all did',
        `${names[0]} and ${names[2]}`,
        `${names[0]} and ${names[1]}`
      ].filter((v, i, a) => a.indexOf(v) === i));
      const correctIndex = options.indexOf(answerText);

      const barsHtml = names.map((n, i) => `
        <div class="bar-row">
          <div>${n}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, janUnits[i] * 3)}%"></div></div>
          <div>${janUnits[i]}</div>
        </div>`).join('');

      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>January profit from used car sales</strong></div>
          <div class="small center">1 bar unit = $${scale}</div>
          ${barsHtml}
          <div class="mt12 small">Average working hours per month: ${names[0]} ${hours[0]}, ${names[1]} ${hours[1]}, ${names[2]} ${hours[2]}</div>
          <div class="small">Wages for all: $${wage} per hour</div>
        </div>
      `;

      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-bar-profit',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: 'In January, who had enough sales to earn their own wages?',
        visualHtml,
        options: options.map(t => ({ text: t, plain: t })),
        correctIndex,
        explanation: `Сначала читаем вопрос: compare January sales profit with wages. Нужны только January bars, hours and wage rate. Profit = bar value × scale. Wage = hours × rate. Затем сравниваем каждого отдельно.`,
        pattern: `Question first → only needed data → one formula per column: profit = units × scale, wage = hours × rate.`
      };
    }

    export function numericalPieGrowth(difficulty) {
      const total = pick([80, 85, 90, 100]);
      const regions = ['Asia', 'N. America', 'S. America', 'Europe', 'Other'];
      let perc;
      if (difficulty === 'easy') {
        perc = [25, 10, 40, 20, 5];
      } else if (difficulty === 'medium') {
        perc = [26, 6, 49, 17, 2];
      } else {
        perc = [28, 7, 43, 16, 6];
      }
      const region = pick(['Asia', 'Europe', 'S. America']);
      const regionPct = perc[regions.indexOf(region)];
      const growth = difficulty === 'easy' ? pick([20, 25]) : pick([25, 30, 35]);
      const base = total * regionPct / 100;
      const result = base * (1 + growth / 100);
      const rounded = Math.round(result * 10) / 10;
      const distractors = shuffle([
        rounded,
        Math.round(base * 10) / 10,
        Math.round((base + growth) * 10) / 10,
        Math.round((base * growth / 100) * 10) / 10
      ].filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4);
      const correctIndex = distractors.indexOf(rounded);
      const colors = ['#2563eb','#dc2626','#65a30d','#7c3aed','#0891b2'];
      const legend = regions.map((r, i) => `<div class="legend-item"><span class="swatch" style="background:${colors[i]}"></span>${r}: ${perc[i]}%</div>`).join('');
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>C-BEER sales in 2020</strong></div>
          <div class="center small">Total sold: ${total} million bottles</div>
          <svg viewBox="0 0 220 220" width="220" height="220" style="display:block;margin:12px auto;">
            ${pieSvg(110, 110, 80, perc, colors)}
          </svg>
          <div class="pie-legend">${legend}</div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-pie-growth',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `Compared to 2020, the company increased C-BEER sales in ${region} by ${growth}% in 2021. Approximately how many million bottles were sold there in 2021?`,
        visualHtml,
        options: distractors.map(v => ({ text: `${v} million`, plain: `${v} million` })),
        correctIndex,
        explanation: `Сначала нужен только один сектор: ${region} = ${regionPct}% от ${total} million. Потом increase на ${growth}% считается от этой базы, не от total. Значит: ${total} × ${regionPct}% = ${base.toFixed(1)}; затем × 1.${String(growth).padStart(2,'0')} = ${rounded.toFixed(1)}.`,
        pattern: `For percentage growth: first find the part, then multiply by (1 + growth%). Do not add the percent number directly.`
      };
    }

    export function numericalLoanFine(difficulty) {
      const values = difficulty === 'easy' ? [60, 70, 80, 90, 100] : [60, 70, 85, 90, 95];
      const mult = pick([800, 1000, 1200]);
      const ratioA = pick([12, 20, 24]);
      const fine = pick([3, 5, 6]);
      const totalUnits = values.reduce((a, b) => a + b, 0);
      const totalLoans = totalUnits * mult;
      const late = totalLoans / ratioA;
      const income = late * fine;
      const optionsBase = [income, late * (fine + 1), totalLoans / (ratioA - 2) * fine, totalLoans / ratioA];
      const options = shuffle(optionsBase.map(v => Math.round(v)).filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4);
      const correctIndex = options.indexOf(Math.round(income));
      const labels = ['< 10 years', '10-19 years', '20-39 years', '40-60 years', '> 60 years'];
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Number of loans at Greenfield library in 2015</strong></div>
          <div class="small center">1 bar unit = ${mult.toLocaleString()} loans</div>
          ${labels.map((l, i) => `
            <div class="bar-row">
              <div>${l}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${values[i]}%"></div></div>
              <div>${values[i]}</div>
            </div>`).join('')}
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-loan-fine',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `1 in ${ratioA} loans exceeded the loan period and resulted in a fine of $${fine}. How much money did the library make on fines?`,
        visualHtml,
        options: options.map(v => ({ text: `$${v.toLocaleString()}`, plain: `$${v.toLocaleString()}` })),
        correctIndex,
        explanation: `Сначала суммируем все bar values, потом умножаем на loans per unit. Это даёт total loans. Далее берём 1 из ${ratioA}, то есть делим на ${ratioA}. И только потом умножаем на fine $${fine}.`,
        pattern: `Multi-step filter: total first → fraction second → money last.`
      };
    }

    export function numericalFactoryOutput(difficulty) {
      const lines = ['Line A', 'Line B', 'Line C', 'Line D'];
      const units = lines.map(() => randInt(120, 260));
      const defectRates = difficulty === 'easy'
        ? lines.map(() => pick([2, 3, 4, 5]))
        : lines.map(() => pick([3, 4, 5, 6, 7]));
      const idx = randInt(0, lines.length - 1);
      const goodUnits = Math.round(units[idx] * (1 - defectRates[idx] / 100));
      const options = shuffle([
        goodUnits,
        units[idx],
        Math.round(units[idx] * defectRates[idx] / 100),
        Math.round(units[idx] * (1 - (defectRates[idx] + 2) / 100))
      ].filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4);
      const correctIndex = options.indexOf(goodUnits);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Weekly production report</strong></div>
          <div class="review-list">
            ${lines.map((line, i) => `<div class="review-item">${line}: ${units[i]} units, defect rate ${defectRates[i]}%</div>`).join('')}
          </div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-factory-output',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `How many non-defective units did ${lines[idx]} produce?`,
        visualHtml,
        options: options.map(v => ({ text: `${v} units`, plain: `${v} units` })),
        correctIndex,
        explanation: `Take total output for ${lines[idx]} and remove the defective percentage. Good units = ${units[idx]} × (100% - ${defectRates[idx]}%) = ${goodUnits}.`,
        pattern: `For defect questions, compute the usable remainder, not the defective part.`
      };
    }

    export function numericalDiscountTable(difficulty) {
      const products = ['Helmet', 'Toolkit', 'Work lamp', 'Safety boots'];
      const prices = products.map(() => pick([24, 28, 32, 36, 42, 48, 55]));
      const discount = difficulty === 'easy' ? pick([10, 15, 20]) : pick([12, 15, 18, 20, 25]);
      const qty = difficulty === 'hard' ? pick([3, 4, 5]) : pick([2, 3, 4]);
      const idx = randInt(0, products.length - 1);
      const total = +(prices[idx] * qty * (1 - discount / 100)).toFixed(2);
      const options = shuffle([
        total,
        +(prices[idx] * qty).toFixed(2),
        +(prices[idx] * qty * (discount / 100)).toFixed(2),
        +(prices[idx] * (1 - discount / 100)).toFixed(2)
      ].filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4);
      const correctIndex = options.indexOf(total);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Store price list</strong></div>
          <div class="review-list">
            ${products.map((name, i) => `<div class="review-item">${name}: $${prices[i].toFixed(2)} each</div>`).join('')}
          </div>
          <div class="statement">Bulk discount: ${discount}% off when buying ${qty} items of the same product.</div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-discount-table',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `What is the discounted total price for ${qty} units of ${products[idx]}?`,
        visualHtml,
        options: options.map(v => ({ text: `$${Number(v).toFixed(2)}`, plain: `$${Number(v).toFixed(2)}` })),
        correctIndex,
        explanation: `First find the pre-discount total: ${qty} × $${prices[idx].toFixed(2)}. Then apply the ${discount}% reduction to that total, giving $${total.toFixed(2)}.`,
        pattern: `Multiply quantity first, apply discount second. Do not subtract the percent as a raw number.`
      };
    }

    export function numericalAverages(difficulty) {
      const names = ['Ana', 'Boris', 'Clara', 'Dmitri'];
      const scores = names.map(() => randInt(58, 92));
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const idx = randInt(0, names.length - 1);
      const needed = avg * scores.length - (scores.reduce((a, b) => a + b, 0) - scores[idx]);
      const askForNeeded = difficulty === 'hard';
      const options = askForNeeded
        ? shuffle([needed, needed + 2, needed - 3, avg].filter((v, i, a) => a.indexOf(v) === i))
        : shuffle([avg, avg + 2, Math.max(1, avg - 3), scores[idx]].filter((v, i, a) => a.indexOf(v) === i));
      const correct = askForNeeded ? needed : avg;
      const correctIndex = options.indexOf(correct);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Assessment scores</strong></div>
          <div class="review-list">
            ${names.map((name, i) => `<div class="review-item">${name}: ${scores[i]} points</div>`).join('')}
          </div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: askForNeeded ? 'numerical-averages-missing' : 'numerical-averages-mean',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: askForNeeded
          ? `What score must ${names[idx]} have for the group average to be ${avg}?`
          : 'What is the average score of the group?',
        visualHtml,
        options: options.map(v => ({ text: `${v}`, plain: `${v}` })),
        correctIndex,
        explanation: askForNeeded
          ? `Required total = ${avg} × ${scores.length}. Subtract the other three known scores to find ${names[idx]}'s score: ${needed}.`
          : `Add all scores and divide by ${scores.length}. That gives an average of ${avg}.`,
        pattern: 'For averages, think in totals first: total sum, then divide, or reverse the process.'
      };
    }

    export function numericalTimeWork(difficulty) {
      const a = pick([4, 5, 6, 8, 10]);
      const b = pick([6, 8, 9, 12, 15].filter(x => x !== a));
      const together = +(1 / (1 / a + 1 / b)).toFixed(1);
      const total = askWholeNumber(together) ? together : Math.round(together * 10) / 10;
      const options = shuffle([
        total,
        a,
        b,
        +(a + b).toFixed(1)
      ].filter((v, i, arr) => arr.indexOf(v) === i));
      const correctIndex = options.indexOf(total);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Time and work</strong></div>
          <div class="review-list">
            <div class="review-item">Worker A can finish the task alone in ${a} hours.</div>
            <div class="review-item">Worker B can finish the task alone in ${b} hours.</div>
          </div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: 'numerical-time-work',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: 'How long would they take working together?',
        visualHtml,
        options: options.map(v => ({ text: `${v} hours`, plain: `${v} hours` })),
        correctIndex,
        explanation: `Add work rates: 1/${a} + 1/${b} jobs per hour. Invert the combined rate to get the total time: ${total} hours.`,
        pattern: 'In work-rate questions, add rates, not times.'
      };
    }

    export function numericalTableComparison(difficulty) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr'];
      const east = months.map(() => randInt(40, 95));
      const west = months.map(() => randInt(40, 95));
      const askMonth = randInt(0, months.length - 1);
      const diff = Math.abs(east[askMonth] - west[askMonth]);
      const winner = east[askMonth] > west[askMonth] ? 'East' : 'West';
      const askType = difficulty === 'hard' ? 'diff' : 'winner';
      const options = askType === 'diff'
        ? shuffle([diff, diff + 5, Math.max(1, diff - 4), east[askMonth] + west[askMonth]].filter((v, i, a) => a.indexOf(v) === i))
        : shuffle(['East', 'West', 'They were equal', 'Cannot say']);
      const correctIndex = options.indexOf(askType === 'diff' ? diff : winner);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Regional sales table</strong></div>
          <div class="review-list">
            ${months.map((m, i) => `<div class="review-item">${m}: East ${east[i]} | West ${west[i]}</div>`).join('')}
          </div>
        </div>
      `;
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        variantKey: askType === 'diff' ? 'numerical-table-diff' : 'numerical-table-winner',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: askType === 'diff'
          ? `What was the difference between East and West in ${months[askMonth]}?`
          : `Which region had higher sales in ${months[askMonth]}?`,
        visualHtml,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex,
        explanation: askType === 'diff'
          ? `Compare the two figures for ${months[askMonth]} and subtract the smaller from the larger.`
          : `Look only at ${months[askMonth]} and compare East ${east[askMonth]} with West ${west[askMonth]}.`,
        pattern: 'For table questions, isolate the target row first before calculating.'
      };
    }

    export function askWholeNumber(value) {
      return Math.abs(value - Math.round(value)) < 0.001;
    }

    export function generateDiagrammatic(difficulty) {
      const patterns = difficulty === 'easy'
        ? ['alternation', 'rotation', 'position']
        : difficulty === 'medium'
        ? ['alternation', 'rotation', 'count', 'position', 'shading']
        : ['rotation', 'count', 'position', 'shading'];
      const type = pick(patterns);
      if (type === 'rotation') return diagRotation(difficulty);
      if (type === 'count') return diagCount(difficulty);
      if (type === 'position') return diagPosition(difficulty);
      if (type === 'shading') return diagShading(difficulty);
      return diagAlternation(difficulty);
    }

    export function diagAlternation(difficulty) {
      const set = pick([
        ['▲','●','▲','●','▲'],
        ['■','□','■','□','■'],
        ['◆','◇','◆','◇','◆']
      ]);
      const answer = set[1];
      const options = shuffle([answer, set[0], '○', '△'].filter((v, i, a) => a.indexOf(v) === i)).slice(0,4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Find the next figure</strong></div>
          <div class="diagram-grid">
            ${set.map(s => `<div class="diagram-cell">${s}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-alternation',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Здесь обычное чередование A-B-A-B-A, значит дальше снова B.`,
        pattern: `Check simplest rule first: alternation before anything more complex.`
      };
    }

    export function diagRotation(difficulty) {
      const shapes = ['▲','▶','▼','◀'];
      const start = randInt(0, 3);
      const seq = [0,1,2,3,0].map(x => shapes[(start + x) % 4]);
      const answer = seq[4];
      const options = shuffle([...new Set(shapes)]).slice(0,4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Rotation pattern</strong></div>
          <div class="diagram-grid">
            ${seq.slice(0,4).map(s => `<div class="diagram-cell">${s}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-rotation',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Фигура поворачивается на 90° каждый шаг. Отследи направление вращения и сделай ещё один поворот.`,
        pattern: `For figure sequences: test rotation, count, position, shading — in that order.`
      };
    }

    export function diagCount(difficulty) {
      const start = difficulty === 'medium' ? 1 : 2;
      const seq = [start, start + 1, start + 2, start + 3];
      const answer = start + 4;
      const options = shuffle([answer, answer - 1, answer + 1, answer + 2]);
      const correctIndex = options.indexOf(answer);
      const renderDots = n => `<div style="display:grid;grid-template-columns:repeat(3,14px);gap:6px;justify-content:center;">${Array.from({length:n}, () => '<span style="width:14px;height:14px;border-radius:999px;background:#111827;display:block"></span>').join('')}</div>`;
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Count pattern</strong></div>
          <div class="diagram-grid">
            ${seq.map(n => `<div class="diagram-cell">${renderDots(n)}</div>`).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-count',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'How many dots should the next box contain?',
        visualHtml,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex,
        explanation: `Количество элементов растёт на 1 на каждом шаге.`,
        pattern: `Count changes are common distractors. Ignore shape style and track only number of elements.`
      };
    }

    export function diagPosition(difficulty) {
      const positions = ['top', 'right', 'bottom', 'left'];
      const circles = ['●', '○'];
      const start = randInt(0, 3);
      const filled = difficulty === 'hard';
      const seq = [0, 1, 2, 3].map(step => positions[(start + step) % 4]);
      const answer = positions[(start + 4) % 4];
      const renderBox = pos => {
        const top = pos === 'top' ? '16%' : pos === 'bottom' ? '68%' : '42%';
        const left = pos === 'left' ? '16%' : pos === 'right' ? '68%' : '42%';
        return `<div class="diagram-cell"><span style="position:absolute;top:${top};left:${left};font-size:28px;">${filled ? circles[0] : circles[1]}</span></div>`;
      };
      const options = shuffle(positions).slice(0, 4);
      const correctIndex = options.indexOf(answer);
      const optionHtml = pos => {
        const top = pos === 'top' ? '16%' : pos === 'bottom' ? '68%' : '42%';
        const left = pos === 'left' ? '16%' : pos === 'right' ? '68%' : '42%';
        return `<div style="position:relative;height:42px;"><span style="position:absolute;top:${top};left:${left};font-size:24px;">${filled ? circles[0] : circles[1]}</span></div>`;
      };
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Position pattern</strong></div>
          <div class="diagram-grid">
            ${seq.map(renderBox).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-position',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which box comes next?',
        visualHtml,
        options: options.map(v => ({ html: optionHtml(v), text: v, plain: v })),
        correctIndex,
        explanation: 'The symbol moves one side clockwise each step: top to right to bottom to left, then repeats.',
        pattern: 'Track movement rules separately from shape style: position, then rotation, then count.'
      };
    }

    export function diagShading(difficulty) {
      const shades = ['#111827', '#94a3b8', '#ffffff'];
      const borders = ['#111827', '#111827', '#334155'];
      const start = randInt(0, 2);
      const seq = [0, 1, 2, 0].map(step => (start + step) % 3);
      const answer = (start + 4) % 3;
      const renderCell = idx => `<div class="diagram-cell"><span style="width:40px;height:40px;border-radius:999px;display:block;background:${shades[idx]};border:2px solid ${borders[idx]};"></span></div>`;
      const options = shuffle([0, 1, 2]).map(idx => ({ idx, html: `<div style="display:grid;place-items:center;height:42px;">` +
        `<span style="width:28px;height:28px;border-radius:999px;display:block;background:${shades[idx]};border:2px solid ${borders[idx]};"></span></div>` }));
      const correctIndex = options.findIndex(opt => opt.idx === answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Shading sequence</strong></div>
          <div class="diagram-grid">
            ${seq.slice(0, 4).map(renderCell).join('')}
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'diagrammatic',
        topicLabel: 'Diagrammatic reasoning',
        variantKey: 'diagrammatic-shading',
        timer: getTimerSeconds('diagrammatic', difficulty),
        prompt: 'Which figure comes next?',
        visualHtml,
        options: options.map(opt => ({ html: opt.html, text: String(opt.idx), plain: `Option ${opt.idx + 1}` })),
        correctIndex,
        explanation: 'The circle fill cycles through dark, grey, white, then repeats.',
        pattern: 'Check fill and shading cycles separately from movement or shape.'
      };
    }

    export function generateLogical(difficulty) {
      const types = difficulty === 'easy'
        ? ['symmetry']
        : difficulty === 'medium'
        ? ['symmetry', 'matrix']
        : ['symmetry', 'matrix'];
      const type = pick(types);
      const q = type === 'symmetry' ? logicalSymmetry(difficulty) : logicalMatrix(difficulty);
      return {
        ...q,
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-${q.variantKey || q.prompt}`,
        timer: getTimerSeconds('logical', difficulty),
        explanation: q.explanation,
        pattern: 'Look for the transformation rule between figures: rotation, position, count, alternation, or shading.'
      };
    }

    export function logicalSymmetry(difficulty) {
      const axes = ['vertical', 'horizontal'];
      const axis = pick(axes);
      const leftShapes = ['◢', '◣', '◤', '◥', '◧', '◨'];
      const pairMap = axis === 'vertical'
        ? { '◢': '◣', '◣': '◢', '◤': '◥', '◥': '◤', '◧': '◨', '◨': '◧' }
        : { '◢': '◤', '◤': '◢', '◣': '◥', '◥': '◣', '◧': '◧', '◨': '◨' };
      const seed = pick(leftShapes);
      const answer = pairMap[seed];
      const options = shuffle([answer, ...Object.values(pairMap).filter(v => v !== answer)]).slice(0, 4);
      const correctIndex = options.indexOf(answer);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Symmetry</strong></div>
          <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);max-width:340px;margin-left:auto;margin-right:auto;">
            <div class="diagram-cell">${seed}</div>
            <div class="diagram-cell" style="font-size:18px;color:#64748b;">${axis === 'vertical' ? '|' : '—'}</div>
            <div class="diagram-cell missing">?</div>
          </div>
          <div class="small center mt8">Choose the figure that is the mirror image across the ${axis} axis.</div>
        </div>
      `;
      return {
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-symmetry-${axis}`,
        timer: getTimerSeconds('logical', difficulty),
        prompt: 'Which option completes the symmetry rule?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: `Reflect the figure across the ${axis} axis, so the filled corner switches to the mirrored side.`,
        pattern: 'In symmetry questions, keep the shape the same and flip only its orientation across the stated axis.'
      };
    }

    export function logicalMatrix(difficulty) {
      const rows = [
        ['▲', '▲▲', '▲▲▲'],
        ['●', '●●', '●●●']
      ];
      const answerBase = pick(['■', '◆']);
      const thirdRow = [answerBase, answerBase + answerBase, answerBase + answerBase + answerBase];
      const options = shuffle([
        thirdRow[2],
        thirdRow[1],
        answerBase,
        answerBase + answerBase + answerBase + answerBase
      ]);
      const correctIndex = options.indexOf(thirdRow[2]);
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Matrix completion</strong></div>
          <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);">
            ${rows[0].map(cell => `<div class="diagram-cell">${cell}</div>`).join('')}
            ${rows[1].map(cell => `<div class="diagram-cell">${cell}</div>`).join('')}
            <div class="diagram-cell">${thirdRow[0]}</div>
            <div class="diagram-cell">${thirdRow[1]}</div>
            <div class="diagram-cell missing">?</div>
          </div>
        </div>
      `;
      return {
        topic: 'logical',
        topicLabel: 'Abstract logical reasoning',
        variantKey: `logical-matrix-${answerBase}`,
        timer: getTimerSeconds('logical', difficulty),
        prompt: 'Which option completes the 3×3 matrix?',
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: 'Each row keeps the same shape, while each column increases the number of symbols from 1 to 3.',
        pattern: 'For matrix questions, check what changes by row and what changes by column separately.'
      };
    }

    export function generateConcentration(difficulty) {
      const q = generateErrorCheck(difficulty);
      return {
        ...q,
        topic: 'concentration',
        topicLabel: 'Concentration',
        timer: getTimerSeconds('concentration', difficulty),
        prompt: 'Identify the mismatching line as quickly and accurately as possible.'
      };
    }

    export function generatePlanning(difficulty) {
      const tasks = ['Assembly', 'Inspection', 'Packing', 'Dispatch'];
      const durations = tasks.map(() => randInt(20, 55));
      const slotStart = pick([480, 510, 540]);
      const breakStart = pick([600, 615, 630]);
      const idx = randInt(0, tasks.length - 1);
      const finish = slotStart + durations.slice(0, idx + 1).reduce((a, b) => a + b, 0);
      const finishDisplay = `${String(Math.floor(finish / 60)).padStart(2, '0')}:${String(finish % 60).padStart(2, '0')}`;
      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Shift plan</strong></div>
          <div class="review-list">
            <div class="review-item">Start time: ${String(Math.floor(slotStart / 60)).padStart(2, '0')}:${String(slotStart % 60).padStart(2, '0')}</div>
            ${tasks.map((task, i) => `<div class="review-item">${task}: ${durations[i]} minutes</div>`).join('')}
            <div class="review-item">Break starts at ${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}</div>
          </div>
        </div>
      `;
      const options = shuffle([
        finishDisplay,
        `${String(Math.floor((finish + 15) / 60)).padStart(2, '0')}:${String((finish + 15) % 60).padStart(2, '0')}`,
        `${String(Math.floor((finish - 10) / 60)).padStart(2, '0')}:${String((finish - 10) % 60).padStart(2, '0')}`,
        `${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}`
      ].filter((v, i, a) => a.indexOf(v) === i));
      return {
        topic: 'planning',
        topicLabel: 'Planning',
        timer: getTimerSeconds('planning', difficulty),
        prompt: `At what time should ${tasks[idx]} finish if tasks are done in the listed order?`,
        visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(finishDisplay),
        explanation: `Add the durations from the shift start up to ${tasks[idx]}. That gives a finish time of ${finishDisplay}.`,
        pattern: 'For planning questions, build the timeline in sequence and ignore unrelated times unless the prompt asks for them.'
      };
    }

    export function generateQuantitative(difficulty) {
      const types = difficulty === 'easy'
        ? ['comparison', 'ratio']
        : difficulty === 'medium'
        ? ['comparison', 'ratio', 'algebra', 'table-total']
        : ['comparison', 'ratio', 'algebra', 'table-total', 'percent-change'];
      const type = pick(types);
      if (type === 'comparison') return quantitativeComparison(difficulty);
      if (type === 'ratio') return quantitativeRatio(difficulty);
      if (type === 'algebra') return quantitativeAlgebra(difficulty);
      if (type === 'table-total') return quantitativeTableTotal(difficulty);
      return quantitativePercentChange(difficulty);
    }

    export function quantitativeComparison(difficulty) {
      const a = randInt(12, 40);
      const b = randInt(3, 12);
      const left = a * b;
      const right = difficulty === 'hard' ? (a + b) * (b + 1) : a * (b + 1);
      const relation = left > right ? 'Quantity A is greater' : left < right ? 'Quantity B is greater' : 'The two quantities are equal';
      const options = ['Quantity A is greater', 'Quantity B is greater', 'The two quantities are equal', 'Cannot be determined'];
      return {
        topic: 'quantitative',
        topicLabel: 'AP Quantitative',
        variantKey: 'quantitative-comparison',
        timer: getTimerSeconds('quantitative', difficulty),
        prompt: 'Compare the two quantities.',
        visualHtml: `<div class="chart"><div class="review-list"><div class="review-item">Quantity A: ${a} × ${b}</div><div class="review-item">Quantity B: ${difficulty === 'hard' ? `(${a} + ${b}) × (${b} + 1)` : `${a} × (${b} + 1)`}</div></div></div>`,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(relation),
        explanation: 'Evaluate both quantities directly, then compare the results.',
        pattern: 'In quantitative comparison, simplify both sides before deciding.'
      };
    }

    export function quantitativeRatio(difficulty) {
      const blue = randInt(12, 30);
      const red = randInt(8, 24);
      const add = pick([2, 3, 4, 5]);
      const result = `${blue}:${red + add}`;
      const options = shuffle([result, `${blue + add}:${red}`, `${blue}:${red}`, `${blue + add}:${red + add}`]);
      return {
        topic: 'quantitative',
        topicLabel: 'AP Quantitative',
        variantKey: 'quantitative-ratio',
        timer: getTimerSeconds('quantitative', difficulty),
        prompt: `A box has blue:red counters in the ratio ${blue}:${red}. If ${add} red counters are added, what is the new ratio blue:red?`,
        visualHtml: `<div class="chart"><div class="statement">Initial ratio blue:red = ${blue}:${red}</div></div>`,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(result),
        explanation: `Only the red part changes. Blue stays ${blue}; red becomes ${red + add}.`,
        pattern: 'In ratio updates, change only the quantity mentioned in the prompt.'
      };
    }

    export function quantitativeAlgebra(difficulty) {
      const x = randInt(4, 14);
      const add = randInt(3, 10);
      const mult = pick([2, 3, 4]);
      const total = mult * x + add;
      const options = shuffle([x, x + 1, Math.max(1, x - 2), x + 3].filter((v, i, a) => a.indexOf(v) === i));
      return {
        topic: 'quantitative',
        topicLabel: 'AP Quantitative',
        variantKey: 'quantitative-algebra',
        timer: getTimerSeconds('quantitative', difficulty),
        prompt: 'Solve for x.',
        visualHtml: `<div class="chart"><div class="center"><strong>Equation</strong></div><div class="question-text" style="font-size:32px;">${mult}x + ${add} = ${total}</div></div>`,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex: options.indexOf(x),
        explanation: `Subtract ${add} from both sides, then divide by ${mult}.`,
        pattern: 'Reverse operations in order: subtract or add first, then divide.'
      };
    }

    export function quantitativeTableTotal(difficulty) {
      const rows = ['A', 'B', 'C'];
      const q1 = rows.map(() => randInt(18, 45));
      const q2 = rows.map(() => randInt(18, 45));
      const idx = randInt(0, rows.length - 1);
      const total = q1[idx] + q2[idx];
      const options = shuffle([total, q1[idx], q2[idx], total + 6].filter((v, i, a) => a.indexOf(v) === i));
      return {
        topic: 'quantitative',
        topicLabel: 'AP Quantitative',
        variantKey: 'quantitative-table-total',
        timer: getTimerSeconds('quantitative', difficulty),
        prompt: `What is the two-period total for row ${rows[idx]}?`,
        visualHtml: `<div class="chart"><div class="review-list">${rows.map((r, i) => `<div class="review-item">Row ${r}: Period 1 = ${q1[i]}, Period 2 = ${q2[i]}</div>`).join('')}</div></div>`,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex: options.indexOf(total),
        explanation: `For row ${rows[idx]}, add Period 1 and Period 2.`,
        pattern: 'For table totals, isolate the correct row before adding.'
      };
    }

    export function quantitativePercentChange(difficulty) {
      const start = randInt(40, 120);
      const pct = pick([10, 15, 20, 25]);
      const end = Math.round(start * (1 + pct / 100));
      const options = shuffle([end, start + pct, start, Math.round(start * (pct / 100))].filter((v, i, a) => a.indexOf(v) === i));
      return {
        topic: 'quantitative',
        topicLabel: 'AP Quantitative',
        variantKey: 'quantitative-percent-change',
        timer: getTimerSeconds('quantitative', difficulty),
        prompt: `A value of ${start} increases by ${pct}%. What is the new value?`,
        visualHtml: `<div class="chart"><div class="statement">Start value: ${start}<br>Increase: ${pct}%</div></div>`,
        options: options.map(v => ({ text: String(v), plain: String(v) })),
        correctIndex: options.indexOf(end),
        explanation: `Find ${pct}% of ${start}, then add it to the starting value.`,
        pattern: 'Percent increase = original × (1 + percent).'
      };
    }

    export function generateVerbal(difficulty) {
      const sets = [
        {
          text: 'All trainees must complete safety training. Some trainees also complete advanced technical training.',
          statement: 'Some trainees who completed safety training also completed advanced technical training.',
          answer: 'True',
          explanation: 'Все trainees complete safety training. Some also do advanced technical training. Значит есть trainees, которые сделали и то и другое.'
        },
        {
          text: 'No employee may enter the lab without a badge. Some visitors were given temporary badges.',
          statement: 'Some visitors may enter the lab.',
          answer: 'Cannot say',
          explanation: 'Badge is necessary, but не сказано, что anyone with a badge actually entered or may enter right now.'
        },
        {
          text: 'Only products tested in Room A were shipped on Monday. Product X was shipped on Monday.',
          statement: 'Product X was tested in Room A.',
          answer: 'True',
          explanation: 'Only A were shipped Monday means if X was shipped Monday, then X must have been tested in Room A.'
        },
        {
          text: 'Every apprentice in Team Blue passed the safety briefing. Nadia is in Team Blue.',
          statement: 'Nadia passed the safety briefing.',
          answer: 'True',
          explanation: 'If every apprentice in Team Blue passed, then Nadia passed because she is in Team Blue.'
        },
        {
          text: 'Some orders placed before noon were dispatched on Tuesday. Order 417 was placed before noon.',
          statement: 'Order 417 was dispatched on Tuesday.',
          answer: 'Cannot say',
          explanation: 'Only some orders placed before noon were dispatched Tuesday. We do not know whether order 417 was one of them.'
        },
        {
          text: 'No machine can be started unless the guard is closed. Machine R started successfully.',
          statement: 'The guard on Machine R was closed.',
          answer: 'True',
          explanation: 'The guard being closed is required for startup, so a successful start means the guard was closed.'
        }
      ];
      const item = pick(sets);
      const options = ['True', 'False', 'Cannot say'];
      const correctIndex = options.indexOf(item.answer);
      return {
        topic: 'verbal',
        topicLabel: 'Verbal reasoning',
        variantKey: `verbal-${item.statement}`,
        timer: getTimerSeconds('verbal', difficulty),
        prompt: 'Is the statement True, False, or Cannot say?',
        visualHtml: `<div class="chart"><div><strong>Text</strong></div><div class="mt8">${item.text}</div><div class="statement"><strong>Statement:</strong> ${item.statement}</div></div>`,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex,
        explanation: item.explanation,
        pattern: `Do not use real-world assumptions. Use only the text. Distinguish False from Cannot say.`
      };
    }

    export function generateMechanical(difficulty) {
      const items = [
        {
          prompt: 'If Gear A turns clockwise, which way will Gear C turn?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Gear direction</strong></div>
              <svg viewBox="0 0 360 130" width="100%" height="130" style="display:block;margin-top:10px;">
                <circle cx="70" cy="65" r="28" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4"></circle>
                <circle cx="165" cy="65" r="28" fill="#e2e8f0" stroke="#475569" stroke-width="4"></circle>
                <circle cx="260" cy="65" r="28" fill="#dbeafe" stroke="#1d4ed8" stroke-width="4"></circle>
                <text x="70" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">A</text>
                <text x="165" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">B</text>
                <text x="260" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">C</text>
                <path d="M 45 25 C 20 45 20 85 45 105" fill="none" stroke="#16a34a" stroke-width="4"></path>
                <polygon points="41,20 58,25 47,37" fill="#16a34a"></polygon>
                <text x="70" y="120" text-anchor="middle" font-size="14" fill="#0f172a">Clockwise</text>
              </svg>
              <div class="small center mt8">Touching gears rotate in opposite directions. Follow the rotation across the chain.</div>
            </div>
          `,
          options: ['Clockwise', 'Counterclockwise', 'It stops', 'Cannot say'],
          answer: 'Clockwise',
          explanation: 'A turns clockwise, so B turns counterclockwise. C touches B, so it turns opposite to B: clockwise.'
        },
        {
          prompt: 'Which ramp needs less force to move the same box to the same height?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Ramp comparison</strong></div>
              <svg viewBox="0 0 360 150" width="100%" height="150" style="display:block;margin-top:10px;">
                <line x1="40" y1="120" x2="140" y2="55" stroke="#1d4ed8" stroke-width="6"></line>
                <line x1="40" y1="120" x2="140" y2="120" stroke="#475569" stroke-width="4"></line>
                <rect x="115" y="42" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="90" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp A</text>
                <line x1="200" y1="120" x2="320" y2="75" stroke="#16a34a" stroke-width="6"></line>
                <line x1="200" y1="120" x2="320" y2="120" stroke="#475569" stroke-width="4"></line>
                <rect x="295" y="62" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="260" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp B</text>
              </svg>
              <div class="small center mt8">Same load, same target height. Compare steepness.</div>
            </div>
          `,
          options: ['Ramp A', 'Ramp B', 'Both need the same force', 'Cannot say'],
          answer: 'Ramp B',
          explanation: 'A longer, gentler ramp reduces the force needed, even if the distance is larger.'
        },
        {
          prompt: 'A lever has the load close to the pivot and the effort far from the pivot. What is the effect?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Lever setup</strong></div>
              <svg viewBox="0 0 360 140" width="100%" height="140" style="display:block;margin-top:10px;">
                <line x1="40" y1="90" x2="320" y2="90" stroke="#0f172a" stroke-width="6"></line>
                <polygon points="150,90 180,120 120,120" fill="#64748b"></polygon>
                <rect x="118" y="58" width="18" height="18" fill="#ef4444"></rect>
                <text x="127" y="50" text-anchor="middle" font-size="14">Load</text>
                <line x1="255" y1="45" x2="255" y2="85" stroke="#16a34a" stroke-width="5"></line>
                <polygon points="255,35 247,49 263,49" fill="#16a34a"></polygon>
                <text x="255" y="28" text-anchor="middle" font-size="14">Effort</text>
              </svg>
              <div class="small center mt8">Load arm is short. Effort is applied farther from the pivot.</div>
            </div>
          `,
          options: ['Less effort is needed', 'More effort is needed', 'No change', 'The lever cannot move'],
          answer: 'Less effort is needed',
          explanation: 'A longer effort arm gives more mechanical advantage, so the same load can be moved with less force.'
        },
        {
          prompt: 'Two pulleys lift the same load. System B uses more supporting rope segments than System A. Which needs less effort?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Pulley comparison</strong></div>
              <svg viewBox="0 0 360 150" width="100%" height="150" style="display:block;margin-top:10px;">
                <circle cx="95" cy="45" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <line x1="95" y1="0" x2="95" y2="27" stroke="#475569" stroke-width="3"></line>
                <line x1="95" y1="63" x2="95" y2="100" stroke="#1d4ed8" stroke-width="4"></line>
                <rect x="80" y="100" width="30" height="26" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="95" y="142" text-anchor="middle" font-size="16" font-weight="700">System A</text>
                <circle cx="255" cy="35" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <circle cx="255" cy="85" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
                <line x1="255" y1="0" x2="255" y2="19" stroke="#475569" stroke-width="3"></line>
                <path d="M255 51 L255 69 M239 85 L239 35 M271 35 L271 110" fill="none" stroke="#16a34a" stroke-width="4"></path>
                <rect x="240" y="110" width="30" height="26" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
                <text x="255" y="142" text-anchor="middle" font-size="16" font-weight="700">System B</text>
              </svg>
              <div class="small center mt8">More supporting rope segments mean greater mechanical advantage.</div>
            </div>
          `,
          options: ['System A', 'System B', 'Both need the same effort', 'Cannot say'],
          answer: 'System B',
          explanation: 'More supporting rope segments create more mechanical advantage, so less force is needed.'
        },
        {
          prompt: 'A metal rod is heated. What usually happens to its length?',
          visualHtml: `
            <div class="chart">
              <div class="center"><strong>Thermal expansion</strong></div>
              <svg viewBox="0 0 360 120" width="100%" height="120" style="display:block;margin-top:10px;">
                <rect x="40" y="35" width="110" height="18" rx="8" fill="#94a3b8"></rect>
                <text x="95" y="28" text-anchor="middle" font-size="14">Before heating</text>
                <rect x="200" y="35" width="140" height="18" rx="8" fill="#f97316"></rect>
                <text x="270" y="28" text-anchor="middle" font-size="14">After heating</text>
                <path d="M165 44 L190 44" stroke="#ef4444" stroke-width="4"></path>
                <polygon points="190,44 180,38 180,50" fill="#ef4444"></polygon>
              </svg>
              <div class="statement">Assume normal thermal behavior of metals.</div>
            </div>
          `,
          options: ['It increases', 'It decreases', 'It stays exactly the same', 'It depends only on color'],
          answer: 'It increases',
          explanation: 'Most metals expand when heated, so the rod becomes slightly longer.'
        }
      ];
      const item = pick(items);
      const options = difficulty === 'hard'
        ? shuffle(item.options)
        : item.options;
      return {
        topic: 'mechanical',
        topicLabel: 'Mechanical reasoning',
        variantKey: `mechanical-${item.prompt}`,
        timer: getTimerSeconds('mechanical', difficulty),
        prompt: item.prompt,
        visualHtml: item.visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(item.answer),
        explanation: item.explanation,
        pattern: 'Check the basic rule first: opposite gear direction, longer ramp means less force, longer effort arm means more leverage.'
      };
    }

    export function generateErrorCheck(difficulty) {
      const sets = [
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. ZX-4187 | ZX-4187</div>
                <div class="review-item">B. LM-2045 | LM-2405</div>
                <div class="review-item">C. QR-7712 | QR-7712</div>
                <div class="review-item">D. BN-6630 | BN-6630</div>
              </div>
            </div>
          `,
          answer: 'B'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. 58,204 | 58,204</div>
                <div class="review-item">B. 71,990 | 71,909</div>
                <div class="review-item">C. 43,118 | 43,118</div>
                <div class="review-item">D. 66,520 | 66,520</div>
              </div>
            </div>
          `,
          answer: 'B'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. TRN-55A | TRN-55A</div>
                <div class="review-item">B. KLP-82Q | KLP-82Q</div>
                <div class="review-item">C. HMX-31B | HMX-31D</div>
                <div class="review-item">D. PRT-09L | PRT-09L</div>
              </div>
            </div>
          `,
          answer: 'C'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. 14/07/2026 | 14/07/2026</div>
                <div class="review-item">B. 09/11/2026 | 09/11/2026</div>
                <div class="review-item">C. 22/03/2026 | 22/03/2028</div>
                <div class="review-item">D. 30/08/2026 | 30/08/2026</div>
              </div>
            </div>
          `,
          answer: 'C'
        },
        {
          prompt: 'Which line contains an error?',
          visualHtml: `
            <div class="chart">
              <div class="review-list">
                <div class="review-item">A. PL-8841-X | PL-8841-X</div>
                <div class="review-item">B. AD-1207-M | AD-1207-M</div>
                <div class="review-item">C. QT-5519-R | QT-5519-R</div>
                <div class="review-item">D. NB-4470-K | NB-4470-X</div>
              </div>
            </div>
          `,
          answer: 'D'
        }
      ];
      const item = pick(sets);
      const baseOptions = ['A', 'B', 'C', 'D'];
      const options = difficulty === 'easy' ? baseOptions : shuffle(baseOptions);
      return {
        topic: 'errorcheck',
        topicLabel: 'Error checking',
        variantKey: `errorcheck-${item.answer}-${item.visualHtml.length}`,
        timer: getTimerSeconds('errorcheck', difficulty),
        prompt: item.prompt,
        visualHtml: item.visualHtml,
        options: options.map(v => ({ text: v, plain: v })),
        correctIndex: options.indexOf(item.answer),
        explanation: `Compare each character left to right. The mismatch appears on line ${item.answer}.`,
        pattern: 'Scan in a fixed order: prefix, digits, suffix. Do not rely on overall shape.'
      };
    }

