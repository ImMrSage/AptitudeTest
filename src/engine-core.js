export function createInitialState() {
  return {
    mode: 'training',
    topic: 'numerical',
    difficulty: 'medium',
    count: 8,
    questionIndex: 0,
    questions: [],
    answers: [],
    secondsLeft: 0,
    startedAt: null,
    showExplanation: false,
    sessionDone: false,
    lastView: 'home',
    reviewIndex: null,
    lastQuestionTemplateSignature: null,
    stats: {
      totalSessions: 0,
      totalQuestions: 0,
      correct: 0,
      byTopic: {
        numerical: { total: 0, correct: 0 },
        verbal: { total: 0, correct: 0 },
        logical: { total: 0, correct: 0 },
        concentration: { total: 0, correct: 0 },
        planning: { total: 0, correct: 0 },
        quantitative: { total: 0, correct: 0 },
        mechanical: { total: 0, correct: 0 },
        mixed: { total: 0, correct: 0 }
      }
    }
  }
}

    export const TOPICS = [
      { value: 'numerical', label: 'Numerical reasoning' },
      { value: 'verbal', label: 'Verbal reasoning' },
      { value: 'logical', label: 'Abstract logical reasoning' },
      { value: 'concentration', label: 'Concentration' },
      { value: 'planning', label: 'Planning' },
      { value: 'quantitative', label: 'AP Quantitative' },
      { value: 'mechanical', label: 'Mechanical reasoning' },
      { value: 'mixed', label: 'Assessment Mix' }
    ];

    export const DIFFICULTIES = ['easy', 'medium', 'hard'];
    export const MODES = [
      { value: 'training', label: 'Training' },
      { value: 'timed', label: 'Timed Test' },
      { value: 'drill', label: 'Drill' }
    ];
    export function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function pick(arr) {
      return arr[randInt(0, arr.length - 1)];
    }
    export function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    export function formatTime(sec) {
      const safe = Math.max(0, Number.isFinite(sec) ? sec : 0);
      const m = Math.floor(safe / 60);
      const s = safe % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    export function getTimerSeconds(topic, difficulty) {
      const base = {
        numerical: { easy: 70, medium: 55, hard: 45 },
        verbal: { easy: 50, medium: 40, hard: 32 },
        logical: { easy: 40, medium: 32, hard: 26 },
        concentration: { easy: 28, medium: 22, hard: 18 },
        planning: { easy: 55, medium: 45, hard: 36 },
        quantitative: { easy: 75, medium: 60, hard: 48 },
        mechanical: { easy: 45, medium: 35, hard: 28 },
        mixed: { easy: 45, medium: 38, hard: 30 }
      };
      return (base[topic] && base[topic][difficulty]) || 30;
    }

    export function matchAllNumbers(text) {
      const matches = String(text).match(/-?\d+(?:\.\d+)?/g);
      return matches ? matches.map(Number) : [];
    }

    export function buildDetailedExplanationHtml(q) {
      if (q.explanationHtml) return q.explanationHtml;

      if (q.topic === 'numerical' || q.topic === 'quantitative') {
        if (q.variantKey === 'numerical-bar-profit') {
          const scaleMatch = q.visualHtml.match(/1 bar unit = \$(\d+)/);
          const wageMatch = q.visualHtml.match(/Wages for all: \$(\d+) per hour/);
          const hoursMatch = q.visualHtml.match(/Average working hours per month: ([^<]+)/);
          const scale = scaleMatch ? Number(scaleMatch[1]) : 0;
          const wage = wageMatch ? Number(wageMatch[1]) : 0;
          const hours = hoursMatch ? matchAllNumbers(hoursMatch[1]) : [];
          const unitMatches = [...q.visualHtml.matchAll(/<div>(\d+)<\/div>\s*<\/div>/g)].map(m => Number(m[1])).slice(0, 3);
          const names = ['Mike', 'Paul', 'Hugh'];
          const profitLines = names.map((name, i) => {
            const profit = (unitMatches[i] || 0) * scale;
            const wageCost = (hours[i] || 0) * wage;
            return `<div class="formula-line">${name}: ${(unitMatches[i] || 0)} × ${scale} = $${profit.toLocaleString()} ; ${(hours[i] || 0)} × ${wage} = $${wageCost.toLocaleString()}</div>`;
          }).join('');
          return `
            <div><strong>Formula setup</strong></div>
            <div class="formula-block">
              <div class="formula-line">Profit = bar units × bar value</div>
              <div class="formula-line">Wage = hours × hourly wage</div>
              ${profitLines}
            </div>
            <div><strong>Final rule:</strong> choose the people whose profit is at least their wage.</div>
          `;
        }

        if (q.variantKey === 'numerical-pie-growth') {
          const promptNums = matchAllNumbers(q.prompt);
          const totalMatch = q.visualHtml.match(/Total sold: (\d+) million bottles/);
          const regionMatch = q.prompt.match(/sales in (.+?) by \d+%/);
          const total = totalMatch ? Number(totalMatch[1]) : 0;
          const growth = promptNums.length ? promptNums[promptNums.length - 1] : 0;
          const region = regionMatch ? regionMatch[1] : '';
          const regionPctMatch = q.visualHtml.match(new RegExp(region.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ': (\\d+)%'));
          const regionPct = regionPctMatch ? Number(regionPctMatch[1]) : 0;
          const base = total * regionPct / 100;
          const result = base * (1 + growth / 100);
          return `
            <div><strong>Step 1</strong></div>
            <div class="formula-block">
              <div class="formula-line">Base sales = ${total} × ${regionPct}% = ${total} × ${regionPct / 100} = ${base.toFixed(1)} million</div>
            </div>
            <div><strong>Step 2</strong></div>
            <div class="formula-block">
              <div class="formula-line">2021 sales = ${base.toFixed(1)} × (1 + ${growth}/100)</div>
              <div class="formula-line">2021 sales = ${base.toFixed(1)} × ${(1 + growth / 100).toFixed(2)} = ${result.toFixed(1)} million</div>
            </div>
          `;
        }

        if (q.variantKey === 'numerical-loan-fine') {
          const multMatch = q.visualHtml.match(/1 bar unit = ([\d,]+) loans/);
          const mult = multMatch ? Number(multMatch[1].replace(/,/g, '')) : 0;
          const values = [...q.visualHtml.matchAll(/<div>(\d+)<\/div>\s*<\/div>/g)].map(m => Number(m[1])).slice(0, 5);
          const promptNums = matchAllNumbers(q.prompt);
          const ratio = promptNums[0] || 1;
          const fine = promptNums[1] || 0;
          const totalUnits = values.reduce((a, b) => a + b, 0);
          const totalLoans = totalUnits * mult;
          const late = totalLoans / ratio;
          const income = late * fine;
          return `
            <div class="formula-block">
              <div class="formula-line">Total units = ${values.join(' + ')} = ${totalUnits}</div>
              <div class="formula-line">Total loans = ${totalUnits} × ${mult.toLocaleString()} = ${totalLoans.toLocaleString()}</div>
              <div class="formula-line">Late loans = ${totalLoans.toLocaleString()} ÷ ${ratio} = ${late.toLocaleString()}</div>
              <div class="formula-line">Fine income = ${late.toLocaleString()} × $${fine} = $${Math.round(income).toLocaleString()}</div>
            </div>
          `;
        }

        if (q.variantKey === 'numerical-factory-output') {
          const itemMatch = q.prompt.match(/did (Line [A-D]) produce/);
          const lineName = itemMatch ? itemMatch[1] : '';
          const rowMatch = q.visualHtml.match(new RegExp(`${lineName}: (\\d+) units, defect rate (\\d+)%`));
          if (rowMatch) {
            const units = Number(rowMatch[1]);
            const defect = Number(rowMatch[2]);
            const good = Math.round(units * (1 - defect / 100));
            return `
              <div class="formula-block">
                <div class="formula-line">Usable rate = 100% - ${defect}% = ${100 - defect}%</div>
                <div class="formula-line">Good units = ${units} × ${(100 - defect) / 100} = ${good}</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'numerical-discount-table') {
          const qtyMatch = q.prompt.match(/for (\d+) units of (.+?)\?/);
          const qty = qtyMatch ? Number(qtyMatch[1]) : 0;
          const product = qtyMatch ? qtyMatch[2] : '';
          const priceMatch = q.visualHtml.match(new RegExp(product.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ': \\$(\\d+(?:\\.\\d+)?) each'));
          const discountMatch = q.visualHtml.match(/Bulk discount: (\d+)%/);
          if (priceMatch && discountMatch) {
            const price = Number(priceMatch[1]);
            const discount = Number(discountMatch[1]);
            const original = qty * price;
            const total = original * (1 - discount / 100);
            return `
              <div class="formula-block">
                <div class="formula-line">Original total = ${qty} × $${price.toFixed(2)} = $${original.toFixed(2)}</div>
                <div class="formula-line">Discounted total = $${original.toFixed(2)} × ${(1 - discount / 100).toFixed(2)} = $${total.toFixed(2)}</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'numerical-averages-mean' || q.variantKey === 'numerical-averages-missing') {
          const scores = [...q.visualHtml.matchAll(/: (\d+) points/g)].map(m => Number(m[1]));
          const total = scores.reduce((a, b) => a + b, 0);
          if (q.variantKey === 'numerical-averages-mean') {
            return `
              <div class="formula-block">
                <div class="formula-line">Total = ${scores.join(' + ')} = ${total}</div>
                <div class="formula-line">Average = ${total} ÷ ${scores.length} = ${(total / scores.length).toFixed(0)}</div>
              </div>
            `;
          }
          const avgMatch = q.prompt.match(/average to be (\d+)/);
          const nameMatch = q.prompt.match(/must (.+?) have/);
          if (avgMatch && nameMatch) {
            const avg = Number(avgMatch[1]);
            const requiredTotal = avg * scores.length;
            return `
              <div class="formula-block">
                <div class="formula-line">Required total = ${avg} × ${scores.length} = ${requiredTotal}</div>
                <div class="formula-line">Missing score = required total - known scores</div>
                <div class="formula-line">Missing score = ${requiredTotal} - (${scores.join(' + ')} - ${nameMatch[1]})</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'numerical-time-work') {
          const nums = matchAllNumbers(q.visualHtml);
          const a = nums[0] || 1;
          const b = nums[1] || 1;
          const rate = 1 / a + 1 / b;
          return `
            <div class="formula-block">
              <div class="formula-line">Rate A = 1/${a}</div>
              <div class="formula-line">Rate B = 1/${b}</div>
              <div class="formula-line">Combined rate = ${(1 / a).toFixed(3)} + ${(1 / b).toFixed(3)} = ${rate.toFixed(3)}</div>
              <div class="formula-line">Time = 1 ÷ ${rate.toFixed(3)} = ${(1 / rate).toFixed(1)} hours</div>
            </div>
          `;
        }

        if (q.variantKey === 'numerical-table-diff' || q.variantKey === 'numerical-table-winner') {
          const monthMatch = q.prompt.match(/in (\w+)/);
          const month = monthMatch ? monthMatch[1] : '';
          const rowMatch = q.visualHtml.match(new RegExp(`${month}: East (\\d+) \\| West (\\d+)`));
          if (rowMatch) {
            const east = Number(rowMatch[1]);
            const west = Number(rowMatch[2]);
            return `
              <div class="formula-block">
                <div class="formula-line">Use only the ${month} row: East = ${east}, West = ${west}</div>
                <div class="formula-line">${q.variantKey === 'numerical-table-diff' ? `Difference = |${east} - ${west}| = ${Math.abs(east - west)}` : `Larger value = ${east > west ? 'East' : 'West'}`}</div>
              </div>
            `;
          }
        }
      }

      if (q.topic === 'mechanical') {
        if (q.variantKey.includes('Gear A turns clockwise')) {
          return `
            <div class="formula-block">
              <div class="formula-line">Rule: touching gears always rotate in opposite directions.</div>
              <div class="formula-line">Gear A = clockwise</div>
              <div class="formula-line">Gear B = counterclockwise</div>
              <div class="formula-line">Gear C = opposite of B = clockwise</div>
            </div>
            <div class="explain-list">
              <div>Each contact reverses the direction once.</div>
              <div>With three gears in a chain, the first and third rotate in the same direction.</div>
            </div>
          `;
        }

        if (q.variantKey.includes('ramp needs less force')) {
          return `
            <div class="formula-block">
              <div class="formula-line">Same load + same final height</div>
              <div class="formula-line">Longer ramp -> smaller slope angle -> less force needed at each moment</div>
            </div>
            <div class="explain-list">
              <div>An inclined plane trades force for distance.</div>
              <div>A gentler ramp spreads the lift over a longer path, so the force required is lower.</div>
            </div>
          `;
        }

        if (q.variantKey.includes('lever has the load close')) {
          return `
            <div class="formula-block">
              <div class="formula-line">Turning effect (moment) = force × distance from pivot</div>
              <div class="formula-line">Longer effort arm -> larger moment for the same applied force</div>
            </div>
            <div class="explain-list">
              <div>Because the load is close to the pivot, its load arm is short.</div>
              <div>Because effort is applied far from the pivot, you gain mechanical advantage.</div>
            </div>
          `;
        }

        if (q.variantKey.includes('Two pulleys lift the same load')) {
          return `
            <div class="formula-block">
              <div class="formula-line">More supporting rope segments -> greater mechanical advantage</div>
              <div class="formula-line">Greater mechanical advantage -> less input force needed</div>
            </div>
            <div class="explain-list">
              <div>System B shares the load across more rope segments than System A.</div>
              <div>That reduces the effort needed to lift the same weight.</div>
            </div>
          `;
        }

        if (q.variantKey.includes('metal rod is heated')) {
          return `
            <div class="formula-block">
              <div class="formula-line">Most metals expand when heated.</div>
              <div class="formula-line">Heating increases particle vibration, which slightly increases the average spacing.</div>
            </div>
            <div class="explain-list">
              <div>That means the rod becomes longer, not shorter.</div>
              <div>This is the basic idea behind thermal expansion.</div>
            </div>
          `;
        }
      }

      return '';
    }

    export function topicLabel(k) {
      return ({
        numerical: 'Numerical reasoning',
        verbal: 'Verbal reasoning',
        logical: 'Abstract logical reasoning',
        concentration: 'Concentration',
        planning: 'Planning',
        quantitative: 'AP Quantitative',
        mechanical: 'Mechanical reasoning',
        mixed: 'Assessment Mix'
      })[k] || k;
    }

    export function questionTemplateSignature(q) {
      return `${q.topic}|${q.variantKey || q.prompt}`;
    }

    export function questionSignature(q) {
      const optionsSig = (q.options || []).map(opt => opt.plain || opt.text || opt.html || '').join('||');
      return `${questionTemplateSignature(q)}|${q.prompt}|${q.visualHtml || ''}|${optionsSig}`;
    }

    export function getUniqueQuestionLimit(topic) {
      const limits = {
        verbal: 6,
        concentration: 5,
        logical: 5,
        quantitative: 5,
        mechanical: 5
      };
      return limits[topic] || 20;
    }

