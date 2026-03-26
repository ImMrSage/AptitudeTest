import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

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
