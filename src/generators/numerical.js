import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'
import { generateAssessmentDayNumerical } from './numericalAssessmentDay'

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
        ? ['bar-profit', 'pie-growth', 'factory-output', 'averages', 'assessmentday']
        : difficulty === 'medium'
        ? ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work', 'assessmentday']
        : ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work', 'table-comparison', 'assessmentday'];
      const type = pick(types);
      if (type === 'bar-profit') return numericalBarProfit(difficulty);
      if (type === 'loan-fine') return numericalLoanFine(difficulty);
      if (type === 'factory-output') return numericalFactoryOutput(difficulty);
      if (type === 'discount-table') return numericalDiscountTable(difficulty);
      if (type === 'averages') return numericalAverages(difficulty);
      if (type === 'time-work') return numericalTimeWork(difficulty);
      if (type === 'table-comparison') return numericalTableComparison(difficulty);
      if (type === 'assessmentday') return generateAssessmentDayNumerical(difficulty);
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

