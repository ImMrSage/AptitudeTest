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
          const totalMatch = q.visualHtml.match(/Total sold: (\d+) million bottles/);
          const growthMatch = q.prompt.match(/by (\d+)%/);
          const regionMatch = q.prompt.match(/sales in (.+?) by \d+%/);
          const total = totalMatch ? Number(totalMatch[1]) : 0;
          const growth = growthMatch ? Number(growthMatch[1]) : 0;
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
          const ratioMatch = q.prompt.match(/1 in (\d+) loans/);
          const fineMatch = q.prompt.match(/fine of \$(\d+)/);
          const ratio = ratioMatch ? Number(ratioMatch[1]) : 1;
          const fine = fineMatch ? Number(fineMatch[1]) : 0;
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
          const scoreRows = [...q.visualHtml.matchAll(/([A-Za-z]+): (\d+) points/g)].map(match => ({ name: match[1], score: Number(match[2]) }));
          if (avgMatch && nameMatch) {
            const avg = Number(avgMatch[1]);
            const targetName = nameMatch[1];
            const requiredTotal = avg * scores.length;
            const otherScores = scoreRows.filter(row => row.name !== targetName).map(row => row.score);
            const otherTotal = otherScores.reduce((a, b) => a + b, 0);
            const missingScore = requiredTotal - otherTotal;
            return `
              <div class="formula-block">
                <div class="formula-line">Required total = ${avg} x ${scores.length} = ${requiredTotal}</div>
                <div class="formula-line">Other scores = ${otherScores.join(' + ')} = ${otherTotal}</div>
                <div class="formula-line">${targetName}'s score = ${requiredTotal} - ${otherTotal} = ${missingScore}</div>
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


        if (q.variantKey === 'quantitative-comparison') {
          const aMatch = q.visualHtml.match(/Quantity A: (\d+) x (\d+)/);
          const hardBMatch = q.visualHtml.match(/Quantity B: \((\d+) \+ (\d+)\) x \((\d+) \+ (\d+)\)/);
          const simpleBMatch = q.visualHtml.match(/Quantity B: (\d+) x \((\d+) \+ 1\)/);
          if (aMatch) {
            const aLeft = Number(aMatch[1]);
            const aRight = Number(aMatch[2]);
            const valueA = aLeft * aRight;
            let valueB = 0;
            let formulaB = '';
            if (hardBMatch) {
              valueB = (Number(hardBMatch[1]) + Number(hardBMatch[2])) * (Number(hardBMatch[3]) + Number(hardBMatch[4]));
              formulaB = `(${hardBMatch[1]} + ${hardBMatch[2]}) x (${hardBMatch[3]} + ${hardBMatch[4]})`;
            } else if (simpleBMatch) {
              valueB = Number(simpleBMatch[1]) * (Number(simpleBMatch[2]) + 1);
              formulaB = `${simpleBMatch[1]} x (${simpleBMatch[2]} + 1)`;
            }
            return `
              <div class="formula-block">
                <div class="formula-line">Quantity A = ${aLeft} x ${aRight} = ${valueA}</div>
                <div class="formula-line">Quantity B = ${formulaB} = ${valueB}</div>
                <div class="formula-line">Compare ${valueA} and ${valueB} to choose the correct relation.</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'quantitative-ratio') {
          const ratioMatch = q.prompt.match(/ratio (\d+):(\d+)/);
          const addMatch = q.prompt.match(/If (\d+) red counters are added/);
          if (ratioMatch && addMatch) {
            const blue = Number(ratioMatch[1]);
            const red = Number(ratioMatch[2]);
            const add = Number(addMatch[1]);
            return `
              <div class="formula-block">
                <div class="formula-line">Blue stays the same = ${blue}</div>
                <div class="formula-line">New red count = ${red} + ${add} = ${red + add}</div>
                <div class="formula-line">New ratio blue:red = ${blue}:${red + add}</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'quantitative-algebra') {
          const equationMatch = q.visualHtml.match(/(\d+)x \+ (\d+) = (\d+)/);
          if (equationMatch) {
            const mult = Number(equationMatch[1]);
            const add = Number(equationMatch[2]);
            const total = Number(equationMatch[3]);
            const reduced = total - add;
            const x = reduced / mult;
            return `
              <div class="formula-block">
                <div class="formula-line">${mult}x + ${add} = ${total}</div>
                <div class="formula-line">${mult}x = ${total} - ${add} = ${reduced}</div>
                <div class="formula-line">x = ${reduced} / ${mult} = ${x}</div>
              </div>
            `;
          }
        }

        if (q.variantKey === 'quantitative-table-total') {
          const rowMatch = q.prompt.match(/row ([A-Z])/);
          if (rowMatch) {
            const row = rowMatch[1];
            const valuesMatch = q.visualHtml.match(new RegExp(`Row ${row}: Period 1 = (\\d+), Period 2 = (\\d+)`));
            if (valuesMatch) {
              const period1 = Number(valuesMatch[1]);
              const period2 = Number(valuesMatch[2]);
              return `
                <div class="formula-block">
                  <div class="formula-line">Use row ${row} only.</div>
                  <div class="formula-line">Total = ${period1} + ${period2} = ${period1 + period2}</div>
                </div>
              `;
            }
          }
        }

        if (q.variantKey === 'quantitative-percent-change') {
          const promptMatch = q.prompt.match(/A value of (\d+) increases by (\d+)%/);
          if (promptMatch) {
            const start = Number(promptMatch[1]);
            const pct = Number(promptMatch[2]);
            const increase = start * pct / 100;
            const end = start + increase;
            return `
              <div class="formula-block">
                <div class="formula-line">Increase amount = ${start} x ${pct}/100 = ${increase}</div>
                <div class="formula-line">New value = ${start} + ${increase} = ${end}</div>
              </div>
            `;
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



