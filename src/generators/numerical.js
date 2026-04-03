import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'
import { generateAssessmentDayNumerical } from './numericalAssessmentDay'

const TRUE_FALSE_CANNOT_SAY = ['True', 'False', 'Cannot say']

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
        ? ['bar-profit', 'pie-growth', 'factory-output', 'averages', 'discount-table', 'statement-judgement', 'assessmentday', 'assessmentday']
        : difficulty === 'medium'
        ? ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work', 'table-comparison', 'statement-judgement', 'statement-judgement', 'assessmentday', 'assessmentday', 'assessmentday']
        : ['bar-profit', 'pie-growth', 'loan-fine', 'factory-output', 'discount-table', 'averages', 'time-work', 'table-comparison', 'statement-judgement', 'statement-judgement', 'assessmentday', 'assessmentday', 'assessmentday'];
      const type = pick(types);
      if (type === 'bar-profit') return numericalBarProfit(difficulty);
      if (type === 'loan-fine') return numericalLoanFine(difficulty);
      if (type === 'factory-output') return numericalFactoryOutput(difficulty);
      if (type === 'discount-table') return numericalDiscountTable(difficulty);
      if (type === 'averages') return numericalAverages(difficulty);
      if (type === 'time-work') return numericalTimeWork(difficulty);
      if (type === 'table-comparison') return numericalTableComparison(difficulty);
      if (type === 'statement-judgement') return numericalStatementJudgement(difficulty);
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
        familyKey: 'numerical-bar-profit',
        variantKey: 'numerical-bar-profit',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: 'In January, who had enough sales to earn their own wages?',
        visualHtml,
        options: options.map(t => ({ text: t, plain: t })),
        correctIndex,
        explanation: 'Compare January sales profit with wages. Use only the January bars, the monthly hours, and the wage rate. Profit = units x scale. Wage = hours x rate. Then compare each person separately.',
        pattern: 'Question first -> only needed data -> one formula per person: profit = units x scale, wage = hours x rate.'
      };
    }

    export function numericalPieGrowth(difficulty) {
      const total = pick([80, 84, 90, 96, 100, 120]);
      const regions = ['Asia', 'N. America', 'S. America', 'Europe', 'Other'];
      const percentageTemplates = [
        [25, 20, 18, 22, 15],
        [30, 25, 20, 15, 10],
        [28, 21, 19, 17, 15],
        [32, 24, 18, 16, 10],
        [26, 23, 20, 17, 14]
      ];
      const perc = shuffle([...pick(percentageTemplates)]);
      const regionIndex = randInt(0, regions.length - 1);
      const region = regions[regionIndex];
      const regionPct = perc[regionIndex];
      const growth = difficulty === 'easy' ? pick([12, 15, 20, 25]) : pick([15, 18, 20, 25, 30, 35, 40]);
      const base = round1(total * regionPct / 100);
      const result = round1(base * (1 + growth / 100));
      const increase = round1(result - base);
      const askType = difficulty === 'easy'
        ? pick(['future-sales', 'base-sales'])
        : pick(['future-sales', 'base-sales', 'increase-amount', 'largest-increase']);
      const colors = ['#2563eb', '#dc2626', '#65a30d', '#7c3aed', '#0891b2'];
      const legend = regions.map((name, i) => `<div class="legend-item"><span class="swatch" style="background:${colors[i]}"></span>${name}: ${perc[i]}%</div>`).join('');

      let prompt = '';
      let optionValues = [];
      let optionTexts = [];
      let correctValue = null;
      let correctText = '';
      let explanationHtml = '';
      let variantKey = '';
      let extraHtml = '';

      if (askType === 'future-sales') {
        prompt = `Compared to 2020, the company increased C-BEER sales in ${region} by ${growth}% in 2021. Approximately how many million bottles were sold there in 2021?`;
        correctValue = result;
        optionValues = uniqueRoundedValues([
          result,
          base,
          increase,
          round1(base * (1 + Math.max(5, growth - 5) / 100)),
          round1(result + pick([1.2, 1.8, 2.4, 3.1]))
        ], 1);
        optionTexts = optionValues.map(v => `${v.toFixed(1)} million`);
        correctText = `${correctValue.toFixed(1)} million`;
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">2020 ${region} sales = ${total} x ${regionPct}% = ${base.toFixed(1)} million</div>
            <div class="formula-line">2021 ${region} sales = ${base.toFixed(1)} x (1 + ${growth}/100)</div>
            <div class="formula-line">2021 ${region} sales = ${base.toFixed(1)} x ${(1 + growth / 100).toFixed(2)} = ${result.toFixed(1)} million</div>
          </div>
        `;
        variantKey = 'numerical-pie-growth-future';
      } else if (askType === 'base-sales') {
        prompt = `In 2020, approximately how many million bottles of C-BEER were sold in ${region}?`;
        correctValue = base;
        optionValues = uniqueRoundedValues([
          base,
          result,
          increase,
          round1(total * pick([15, 18, 20, 22, 25]) / 100),
          round1(base + pick([2.0, 3.0, 4.0]))
        ], 1);
        optionTexts = optionValues.map(v => `${v.toFixed(1)} million`);
        correctText = `${correctValue.toFixed(1)} million`;
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">${region} share in 2020 = ${regionPct}%</div>
            <div class="formula-line">Sales in ${region} = ${total} x ${regionPct}%</div>
            <div class="formula-line">Sales in ${region} = ${total} x ${(regionPct / 100).toFixed(2)} = ${base.toFixed(1)} million</div>
          </div>
        `;
        variantKey = 'numerical-pie-growth-base';
      } else if (askType === 'increase-amount') {
        prompt = `Compared to 2020, the company increased C-BEER sales in ${region} by ${growth}% in 2021. By approximately how many million bottles did sales in ${region} increase?`;
        correctValue = increase;
        optionValues = uniqueRoundedValues([
          increase,
          result,
          base,
          round1(base * Math.max(10, growth - 5) / 100),
          round1(increase + pick([0.8, 1.1, 1.6]))
        ], 1);
        optionTexts = optionValues.map(v => `${v.toFixed(1)} million`);
        correctText = `${correctValue.toFixed(1)} million`;
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">2020 ${region} sales = ${total} x ${regionPct}% = ${base.toFixed(1)} million</div>
            <div class="formula-line">Increase = ${base.toFixed(1)} x ${growth}/100 = ${increase.toFixed(1)} million</div>
          </div>
        `;
        variantKey = 'numerical-pie-growth-increase';
      } else {
        const growthRates = regions.map(() => pick([10, 12, 15, 18, 20, 25, 30, 35]));
        const futureByRegion = regions.map((_, i) => round1(total * perc[i] / 100 * (1 + growthRates[i] / 100)));
        const increaseByRegion = futureByRegion.map((future, i) => round1(future - total * perc[i] / 100));
        const winnerIndex = increaseByRegion.indexOf(Math.max(...increaseByRegion));
        correctText = regions[winnerIndex];
        prompt = 'Each region grows by the rate shown below from 2020 to 2021. Which region has the largest increase in the number of bottles sold?';
        optionTexts = [...regions];
        explanationHtml = `
          <div class="formula-block">
            ${regions.map((name, i) => `<div class="formula-line">${name}: ${total} x ${perc[i]}% = ${(total * perc[i] / 100).toFixed(1)} million; increase = ${(total * perc[i] / 100).toFixed(1)} x ${growthRates[i]}/100 = ${increaseByRegion[i].toFixed(1)} million</div>`).join('')}
            <div class="formula-line">Largest increase = ${regions[winnerIndex]}</div>
          </div>
        `;
        variantKey = 'numerical-pie-growth-largest-increase';
        extraHtml = `<div class="statement">2021 growth rates: ${regions.map((name, i) => `${name} +${growthRates[i]}%`).join(' | ')}</div>`;
      }

      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>C-BEER sales in 2020</strong></div>
          <div class="center small">Total sold: ${total} million bottles</div>
          <svg viewBox="0 0 220 220" width="220" height="220" style="display:block;margin:12px auto;">
            ${pieSvg(110, 110, 80, perc, colors)}
          </svg>
          <div class="pie-legend">${legend}</div>
          ${extraHtml}
        </div>
      `;

      const options = shuffle(optionTexts).slice(0, 5);
      const correctIndex = options.indexOf(correctText);

      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        familyKey: 'numerical-pie-growth',
        variantKey,
        timer: getTimerSeconds('numerical', difficulty),
        prompt,
        visualHtml,
        options: options.map(text => ({ text, plain: text })),
        correctIndex,
        explanation: 'Use the regional share first, then decide whether the question wants the 2020 base, the increase, or the 2021 total.',
        explanationHtml,
        pattern: 'First isolate the region from the pie chart. After that, apply the percentage change only to that region.'
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
        familyKey: 'numerical-loan-fine',
        variantKey: 'numerical-loan-fine',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `1 in ${ratioA} loans exceeded the loan period and resulted in a fine of $${fine}. How much money did the library make on fines?`,
        visualHtml,
        options: options.map(v => ({ text: `$${v.toLocaleString()}`, plain: `$${v.toLocaleString()}` })),
        correctIndex,
        explanation: `Add all bar values first, then multiply by the loans per unit. That gives total loans. Next take 1 in ${ratioA}, so divide by ${ratioA}. Only then multiply by the fine of $${fine}.`,
        pattern: 'Multi-step filter: total first -> fraction second -> money last.'
      };
    }

    export function numericalFactoryOutput(difficulty) {
      const allLines = ['Line A', 'Line B', 'Line C', 'Line D', 'Line E'];
      const lineCount = difficulty === 'easy' ? 4 : pick([4, 5]);
      const lines = allLines.slice(0, lineCount);
      const units = lines.map(() => randInt(120, difficulty === 'hard' ? 340 : 280));
      const defectPool = difficulty === 'easy'
        ? [2, 3, 4, 5, 6, 7]
        : [2, 3, 4, 5, 6, 7, 8, 9];
      const defectRates = shuffle([...defectPool]).slice(0, lineCount);
      const targetIndex = randInt(0, lines.length - 1);
      const defectCounts = lines.map((_, i) => Math.round(units[i] * defectRates[i] / 100));
      const goodUnits = lines.map((_, i) => units[i] - defectCounts[i]);
      const askType = difficulty === 'easy'
        ? pick(['good-units', 'defective-units'])
        : pick(['good-units', 'defective-units', 'highest-good', 'highest-defects']);

      let prompt = '';
      let optionTexts = [];
      let correctText = '';
      let explanationHtml = '';
      let variantKey = '';

      if (askType === 'good-units') {
        prompt = `How many non-defective units did ${lines[targetIndex]} produce?`;
        const correctValue = goodUnits[targetIndex];
        optionTexts = uniqueRoundedValues([
          correctValue,
          units[targetIndex],
          defectCounts[targetIndex],
          goodUnits[targetIndex] + pick([4, 6, 8]),
          Math.max(1, goodUnits[targetIndex] - pick([3, 5, 7]))
        ], 0).map(v => `${v} units`);
        correctText = `${correctValue} units`;
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">Defective units for ${lines[targetIndex]} = ${units[targetIndex]} x ${defectRates[targetIndex]}% = ${defectCounts[targetIndex]}</div>
            <div class="formula-line">Non-defective units = ${units[targetIndex]} - ${defectCounts[targetIndex]} = ${correctValue}</div>
          </div>
        `;
        variantKey = 'numerical-factory-good';
      } else if (askType === 'defective-units') {
        prompt = `How many defective units did ${lines[targetIndex]} produce?`;
        const correctValue = defectCounts[targetIndex];
        optionTexts = uniqueRoundedValues([
          correctValue,
          goodUnits[targetIndex],
          units[targetIndex],
          defectCounts[targetIndex] + pick([2, 4, 5]),
          Math.max(1, defectCounts[targetIndex] - pick([1, 2, 3]))
        ], 0).map(v => `${v} units`);
        correctText = `${correctValue} units`;
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">Defective units = ${units[targetIndex]} x ${defectRates[targetIndex]}%</div>
            <div class="formula-line">Defective units = ${units[targetIndex]} x ${(defectRates[targetIndex] / 100).toFixed(2)} = ${correctValue}</div>
          </div>
        `;
        variantKey = 'numerical-factory-defective';
      } else if (askType === 'highest-good') {
        const winnerIndex = goodUnits.indexOf(Math.max(...goodUnits));
        prompt = 'Which line produced the greatest number of non-defective units?';
        optionTexts = [...lines];
        correctText = lines[winnerIndex];
        explanationHtml = `
          <div class="formula-block">
            ${lines.map((line, i) => `<div class="formula-line">${line}: ${units[i]} - ${defectCounts[i]} = ${goodUnits[i]} non-defective units</div>`).join('')}
            <div class="formula-line">Highest non-defective output = ${lines[winnerIndex]}</div>
          </div>
        `;
        variantKey = 'numerical-factory-highest-good';
      } else {
        const winnerIndex = defectCounts.indexOf(Math.max(...defectCounts));
        prompt = 'Which line lost the greatest number of units to defects?';
        optionTexts = [...lines];
        correctText = lines[winnerIndex];
        explanationHtml = `
          <div class="formula-block">
            ${lines.map((line, i) => `<div class="formula-line">${line}: ${units[i]} x ${defectRates[i]}% = ${defectCounts[i]} defective units</div>`).join('')}
            <div class="formula-line">Greatest defect count = ${lines[winnerIndex]}</div>
          </div>
        `;
        variantKey = 'numerical-factory-highest-defects';
      }

      const visualHtml = `
        <div class="chart">
          <div class="center"><strong>Weekly production report</strong></div>
          <div class="review-list">
            ${lines.map((line, i) => `<div class="review-item">${line}: ${units[i]} units, defect rate ${defectRates[i]}%</div>`).join('')}
          </div>
        </div>
      `;
      const options = shuffle(optionTexts).slice(0, 5);
      const correctIndex = options.indexOf(correctText);
      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        familyKey: 'numerical-factory-output',
        variantKey,
        timer: getTimerSeconds('numerical', difficulty),
        prompt,
        visualHtml,
        options: options.map(text => ({ text, plain: text })),
        correctIndex,
        explanation: 'For production defects, first decide whether the question wants the defective part, the usable remainder, or a comparison across all lines.',
        explanationHtml,
        pattern: 'Convert the defect percentage into a unit count before comparing or subtracting.'
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
        familyKey: 'numerical-discount-table',
        variantKey: 'numerical-discount-table',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: `What is the discounted total price for ${qty} units of ${products[idx]}?`,
        visualHtml,
        options: options.map(v => ({ text: `$${Number(v).toFixed(2)}`, plain: `$${Number(v).toFixed(2)}` })),
        correctIndex,
        explanation: `First find the pre-discount total: ${qty} x $${prices[idx].toFixed(2)}. Then apply the ${discount}% reduction to that total, giving $${total.toFixed(2)}.`,
        pattern: `Multiply quantity first, apply discount second. Do not subtract the percent as a raw number.`
      };
    }

    export function numericalAverages(difficulty) {
      const names = ['Ana', 'Boris', 'Clara', 'Dmitri'];
      const scores = names.map(() => randInt(58, 92));
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const idx = randInt(0, names.length - 1);
      const needed = avg * scores.length - (scores.reduce((a, b) => a + b, 0) - scores[idx]);
      const askForNeeded = difficulty !== 'easy' && pick([true, false]);
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
        familyKey: 'numerical-averages',
        variantKey: askForNeeded ? 'numerical-averages-missing' : 'numerical-averages-mean',
        timer: getTimerSeconds('numerical', difficulty),
        prompt: askForNeeded
          ? `What score must ${names[idx]} have for the group average to be ${avg}?`
          : 'What is the average score of the group?',
        visualHtml,
        options: options.map(v => ({ text: `${v}`, plain: `${v}` })),
        correctIndex,
        explanation: askForNeeded
          ? `Required total = ${avg} x ${scores.length}. Subtract the other three known scores to find ${names[idx]}'s score: ${needed}.`
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
        familyKey: 'numerical-time-work',
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
        familyKey: 'numerical-table-comparison',
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
    export function numericalStatementJudgement(difficulty) {
      const families = difficulty === 'easy'
        ? ['working-hours', 'mail-order']
        : ['working-hours', 'mail-order', 'profit-loss'];
      const family = pick(families);
      if (family === 'working-hours') return numericalWorkingHoursJudgement(difficulty);
      if (family === 'mail-order') return numericalMailOrderJudgement(difficulty);
      return numericalProfitLossJudgement(difficulty);
    }

    export function numericalWorkingHoursJudgement(difficulty) {
      const employees = ['Dasgupta', 'Newman', 'Sanders', 'Stratford', 'Lee', 'Watson'];
      const agreed = [85, 175, 175, 85, 175, 175];
      const actual = agreed.map((hours, index) => Math.max(70, hours + [-12, -8, -3, 0, 5, 7, 10, 12][(index + randInt(0, 7)) % 8]));
      const promptType = pick(difficulty === 'easy'
        ? ['employee-compare', 'month-claim']
        : ['employee-compare', 'count-below', 'month-claim']);
      let prompt = '';
      let correctText = '';
      let explanationHtml = '';
      let variantKey = '';

      if (promptType === 'employee-compare') {
        const index = randInt(0, employees.length - 1);
        const relation = pick(['more', 'fewer', 'exactly']);
        const isTrue = relation === 'more'
          ? actual[index] > agreed[index]
          : relation === 'fewer'
          ? actual[index] < agreed[index]
          : actual[index] === agreed[index];
        prompt = relation === 'more'
          ? `${employees[index]} worked more actual hours than agreed in March.`
          : relation === 'fewer'
          ? `${employees[index]} worked fewer actual hours than agreed in March.`
          : `${employees[index]} worked exactly the agreed number of hours in March.`;
        correctText = isTrue ? 'True' : 'False';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">${employees[index]}: agreed ${agreed[index]} hours, actual ${actual[index]} hours.</div>
            <div class="formula-line">Compare actual with agreed to test the statement.</div>
          </div>
        `;
        variantKey = `numerical-judgement-working-hours-${relation}`;
      } else if (promptType === 'count-below') {
        const countBelow = actual.filter((value, index) => value < agreed[index]).length;
        const statedCount = pick([countBelow, Math.max(0, countBelow - 1), Math.min(employees.length, countBelow + 1)]);
        prompt = `Exactly ${statedCount} employees worked fewer actual hours than agreed in March.`;
        correctText = statedCount === countBelow ? 'True' : 'False';
        explanationHtml = `
          <div class="formula-block">
            ${employees.map((name, index) => `<div class="formula-line">${name}: ${actual[index]} ${actual[index] < agreed[index] ? '<' : actual[index] > agreed[index] ? '>' : '='} ${agreed[index]}</div>`).join('')}
            <div class="formula-line">Employees below agreed hours = ${countBelow}</div>
          </div>
        `;
        variantKey = 'numerical-judgement-working-hours-count';
      } else {
        const index = randInt(0, employees.length - 1);
        const febHours = actual[index] + pick([-14, -9, -5, 4, 7, 11]);
        prompt = `${employees[index]} worked a total of ${febHours} actual working hours in February.`;
        correctText = 'Cannot say';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">The table shows working hours for March only.</div>
            <div class="formula-line">There is no February data, so the statement cannot be verified.</div>
          </div>
        `;
        variantKey = 'numerical-judgement-working-hours-month';
      }

      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        familyKey: 'numerical-statement-judgement',
        variantKey,
        timer: getTimerSeconds('numerical', difficulty),
        prompt,
        subtext: 'Select True, False, or Cannot say based only on the data shown.',
        visualHtml: renderNumericalTableCard(
          'Working hours',
          'Working hours for HR department employees in March',
          ['Employee', 'Agreed working hours', 'Actual working hours'],
          employees.map((name, index) => [name, String(agreed[index]), String(actual[index])]),
          'Use only the March data shown in the table.'
        ),
        options: TRUE_FALSE_CANNOT_SAY.map(text => ({ text, plain: text })),
        correctIndex: TRUE_FALSE_CANNOT_SAY.indexOf(correctText),
        explanation: 'Check whether the statement follows from the displayed month only. Do not assume missing data.',
        explanationHtml,
        pattern: 'For statement questions, decide whether the claim is supported, contradicted, or not derivable from the data.'
      };
    }

    export function numericalMailOrderJudgement(difficulty) {
      const national = [7.0, 10.4, 15.0];
      const international = [10.0, 11.6, 18.0];
      const expressRates = {
        'Express': 17.5,
        'Express before 9 a.m.': 33.0,
        'Express Sunday': 57.0,
      };
      const weights = [4, 8, 19];
      const promptType = pick(difficulty === 'easy'
        ? ['price-check', 'threshold-unknown']
        : ['price-check', 'price-check', 'threshold-unknown']);
      let prompt = '';
      let correctText = '';
      let explanationHtml = '';
      let variantKey = '';

      if (promptType === 'price-check') {
        const bucketIndex = randInt(0, weights.length - 1);
        const services = Object.keys(expressRates);
        const service = pick(services);
        const isInternational = pick([true, false]);
        const total = national[bucketIndex] + (isInternational ? international[bucketIndex] : 0) + expressRates[service];
        const quoted = pick([total, total + pick([2.0, 3.0, 4.0]), total - pick([1.0, 2.0, 3.0])]);
        prompt = `${isInternational ? 'International' : 'National'} delivery of a parcel weighing ${weights[bucketIndex]} kilos via '${service}' costs £${quoted.toFixed(2)}.`;
        correctText = Math.abs(quoted - total) < 0.001 ? 'True' : 'False';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">Base national price = £${national[bucketIndex].toFixed(2)}</div>
            <div class="formula-line">International surcharge = £${(isInternational ? international[bucketIndex] : 0).toFixed(2)}</div>
            <div class="formula-line">${service} surcharge = £${expressRates[service].toFixed(2)}</div>
            <div class="formula-line">Total = £${total.toFixed(2)}</div>
          </div>
        `;
        variantKey = 'numerical-judgement-mail-order-price';
      } else {
        const totalNational = national[2] + expressRates['Express Sunday'];
        const totalInternational = national[2] + international[2] + expressRates['Express Sunday'];
        prompt = 'A parcel weighing 19 kilos sent by Express Sunday costs more than £80.00.';
        correctText = 'Cannot say';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">If national: £${national[2].toFixed(2)} + £${expressRates['Express Sunday'].toFixed(2)} = £${totalNational.toFixed(2)}</div>
            <div class="formula-line">If international: £${national[2].toFixed(2)} + £${international[2].toFixed(2)} + £${expressRates['Express Sunday'].toFixed(2)} = £${totalInternational.toFixed(2)}</div>
            <div class="formula-line">One total is below £80.00 and the other is above it.</div>
          </div>
        `;
        variantKey = 'numerical-judgement-mail-order-unknown';
      }

      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        familyKey: 'numerical-statement-judgement',
        variantKey,
        timer: getTimerSeconds('numerical', difficulty),
        prompt,
        subtext: 'Select True, False, or Cannot say based only on the data shown.',
        visualHtml: renderMailOrderCard(national, international, expressRates),
        options: TRUE_FALSE_CANNOT_SAY.map(text => ({ text, plain: text })),
        correctIndex: TRUE_FALSE_CANNOT_SAY.indexOf(correctText),
        explanation: 'Build the parcel price from the relevant weight band plus any stated surcharges. If a key detail is missing, choose Cannot say.',
        explanationHtml,
        pattern: 'For delivery tables, start with the weight band, then add only the surcharges explicitly required.'
      };
    }

    export function numericalProfitLossJudgement(difficulty) {
      const products = ['Ignition coil', 'Ignition contact', 'Battery'];
      const material = [10, 8, 15].map(value => value + pick([-1, 0, 1]));
      const production = [15, 8, 25].map(value => value + pick([-1, 0, 1]));
      const profit = [25, 10, 20].map(value => value + pick([-1, 0, 1]));
      const totals = products.map((_, index) => material[index] + production[index] + profit[index]);
      const promptType = pick(['production-compare', 'revenue-compare', 'units-unknown']);
      let prompt = '';
      let correctText = '';
      let explanationHtml = '';
      let variantKey = '';

      if (promptType === 'production-compare') {
        const isTrue = production[2] > production[1];
        prompt = 'Production costs for manufacturing a battery are higher than production costs for manufacturing an ignition contact.';
        correctText = isTrue ? 'True' : 'False';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">Battery production cost = £${production[2]}</div>
            <div class="formula-line">Ignition contact production cost = £${production[1]}</div>
          </div>
        `;
        variantKey = 'numerical-judgement-profit-loss-production';
      } else if (promptType === 'revenue-compare') {
        const isTrue = totals[0] > totals[1];
        prompt = 'Total revenue for the ignition coil is greater than total revenue for the ignition contact.';
        correctText = isTrue ? 'True' : 'False';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">Ignition coil total = ${material[0]} + ${production[0]} + ${profit[0]} = £${totals[0]}</div>
            <div class="formula-line">Ignition contact total = ${material[1]} + ${production[1]} + ${profit[1]} = £${totals[1]}</div>
          </div>
        `;
        variantKey = 'numerical-judgement-profit-loss-revenue';
      } else {
        prompt = 'More battery units were sold than ignition contact units.';
        correctText = 'Cannot say';
        explanationHtml = `
          <div class="formula-block">
            <div class="formula-line">The chart shows costs and profit amounts.</div>
            <div class="formula-line">It does not show the number of units sold.</div>
          </div>
        `;
        variantKey = 'numerical-judgement-profit-loss-units';
      }

      return {
        topic: 'numerical',
        topicLabel: 'Numerical reasoning',
        familyKey: 'numerical-statement-judgement',
        variantKey,
        timer: getTimerSeconds('numerical', difficulty),
        prompt,
        subtext: 'Select True, False, or Cannot say based only on the data shown.',
        visualHtml: renderProfitLossCard(products, material, production, profit),
        options: TRUE_FALSE_CANNOT_SAY.map(text => ({ text, plain: text })),
        correctIndex: TRUE_FALSE_CANNOT_SAY.indexOf(correctText),
        explanation: 'For chart statements, compare only the values visible on the chart. Do not infer hidden variables such as units sold.',
        explanationHtml,
        pattern: 'True/False/Cannot say depends on whether the chart directly supports, contradicts, or omits the claim.'
      };
    }

    function renderNumericalTableCard(title, subtitle, headers, rows, note = '') {
      return `
        <div class="chart">
          <div class="center"><strong>${title}</strong></div>
          <div class="small center mt8">${subtitle}</div>
          <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:14px;color:#111827;">
            <thead>
              <tr>
                ${headers.map(header => `<th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;text-align:center;font-weight:700;">${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row, rowIndex) => `
                <tr>
                  ${row.map(cell => `<td style="background:${rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${note ? `<div class="small mt8">${note}</div>` : ''}
        </div>
      `;
    }

    function renderMailOrderCard(national, international, expressRates) {
      return `
        <div class="chart">
          <div class="center"><strong>Mail order</strong></div>
          <div class="small center mt8">Delivery costs for parcels</div>
          <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:14px;color:#111827;">
            <thead>
              <tr>
                <th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;">Weight</th>
                <th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;">National</th>
                <th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;">Int'l delivery surcharge</th>
              </tr>
            </thead>
            <tbody>
              ${[['1 - 5 kg', national[0], international[0]], ['6 - 10 kg', national[1], international[1]], ['11 - 20 kg', national[2], international[2]]].map((row, index) => `
                <tr>
                  <td style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">${row[0]}</td>
                  <td style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">£${Number(row[1]).toFixed(2)}</td>
                  <td style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">£${Number(row[2]).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="small center mt12">Express delivery surcharge</div>
          <table style="width:72%;margin:10px auto 0;border-collapse:collapse;font-size:14px;color:#111827;">
            <thead>
              <tr>
                <th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;">Service</th>
                <th style="background:#d1d5db;border:1px solid #cbd5e1;padding:8px 6px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(expressRates).map(([service, price], index) => `
                <tr>
                  <td style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">${service}</td>
                  <td style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'};border:1px solid #cbd5e1;padding:8px 6px;text-align:center;">£${price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="small mt8">Int'l delivery surcharge is added on top of the national price.</div>
        </div>
      `;
    }

    function renderProfitLossCard(products, material, production, profit) {
      const maxTotal = Math.max(...products.map((_, index) => material[index] + production[index] + profit[index]));
      return `
        <div class="chart">
          <div class="center"><strong>Profit &amp; loss</strong></div>
          <div style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:12px 0 10px;font-size:13px;color:#111827;">
            <div><span style="display:inline-block;width:12px;height:12px;background:#111827;margin-right:6px;"></span>Material costs</div>
            <div><span style="display:inline-block;width:12px;height:12px;background:#94a3b8;margin-right:6px;"></span>Production costs</div>
            <div><span style="display:inline-block;width:12px;height:12px;background:#2563eb;margin-right:6px;"></span>Profit</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;align-items:end;min-height:220px;">
            ${products.map((product, index) => {
              const materialHeight = Math.max(18, Math.round(material[index] / maxTotal * 150));
              const productionHeight = Math.max(18, Math.round(production[index] / maxTotal * 150));
              const profitHeight = Math.max(18, Math.round(profit[index] / maxTotal * 150));
              return `
                <div style="display:grid;justify-items:center;gap:10px;">
                  <div style="display:flex;align-items:flex-end;height:170px;gap:0;">
                    <div style="width:44px;height:${materialHeight}px;background:#111827;border-top-left-radius:6px;border-top-right-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">${material[index]}</div>
                    <div style="width:44px;height:${productionHeight}px;background:#94a3b8;border-top-left-radius:6px;border-top-right-radius:6px;display:flex;align-items:center;justify-content:center;color:#111827;font-size:12px;">${production[index]}</div>
                    <div style="width:44px;height:${profitHeight}px;background:#2563eb;border-top-left-radius:6px;border-top-right-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">${profit[index]}</div>
                  </div>
                  <div class="small center">${product}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    function round1(value) {
      return Math.round(value * 10) / 10;
    }
    function uniqueRoundedValues(values, decimals = 0) {
      const scale = decimals === 0 ? 1 : Math.pow(10, decimals);
      const result = [];
      values.forEach(value => {
        const normalized = decimals === 0
          ? Math.round(value)
          : Math.round(value * scale) / scale;
        if (!result.includes(normalized)) result.push(normalized);
      });
      return result;
    }

    export function askWholeNumber(value) {
      return Math.abs(value - Math.round(value)) < 0.001;
    }











