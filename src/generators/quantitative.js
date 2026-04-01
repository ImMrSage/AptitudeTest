import { getTimerSeconds, pick, shuffle } from '../engine-core'

export function generateQuantitative(difficulty) {
  const families = difficulty === 'easy'
    ? ['symbolic-total', 'double-discount', 'cube-volume', 'inclusion-exclusion', 'expand-expression']
    : difficulty === 'medium'
    ? ['symbolic-total', 'expand-expression', 'reverse-decrease', 'double-discount', 'cube-volume', 'remaining-share', 'investment-income', 'inclusion-exclusion', 'multi-year-growth']
    : ['expand-expression', 'reverse-decrease', 'double-discount', 'cube-volume', 'remaining-share', 'relative-percent-gap', 'investment-income', 'inclusion-exclusion', 'multi-year-growth', 'symbolic-total']

  const family = pick(families)
  if (family === 'symbolic-total') return quantitativeSymbolicTotal(difficulty)
  if (family === 'expand-expression') return quantitativeExpandExpression(difficulty)
  if (family === 'reverse-decrease') return quantitativeReverseDecrease(difficulty)
  if (family === 'double-discount') return quantitativeDoubleDiscount(difficulty)
  if (family === 'cube-volume') return quantitativeCubeVolume(difficulty)
  if (family === 'remaining-share') return quantitativeRemainingShare(difficulty)
  if (family === 'relative-percent-gap') return quantitativeRelativePercentGap(difficulty)
  if (family === 'investment-income') return quantitativeInvestmentIncome(difficulty)
  if (family === 'inclusion-exclusion') return quantitativeInclusionExclusion(difficulty)
  return quantitativeMultiYearGrowth(difficulty)
}

function quantitativeSymbolicTotal(difficulty) {
  const scenarios = [
    {
      intro: 'An office manager bought a computer for A euros, three desks for B euros each, and two chairs for C euros each.',
      terms: [[1, 'A'], [3, 'B'], [2, 'C']],
    },
    {
      intro: 'A buyer ordered two tablets for A euros each, four monitors for B euros each, and one printer for C euros.',
      terms: [[2, 'A'], [4, 'B'], [1, 'C']],
    },
    {
      intro: 'A warehouse bought three scanners for A euros each, two label printers for B euros each, and five cables for C euros each.',
      terms: [[3, 'A'], [2, 'B'], [5, 'C']],
    },
  ]
  const scenario = pick(scenarios)
  const answer = expressionFromTerms(scenario.terms)
  const wrongNoMultipliers = scenario.terms.map(([, symbol]) => symbol).join(' + ')
  const wrongAddCounts = `${scenario.terms[0][1]} + (${expressionFromTerms(scenario.terms.slice(1))})/${scenario.terms.length}`
  const wrongSwap = expressionFromTerms([[scenario.terms[0][0], scenario.terms[0][1]], [scenario.terms[2][0], scenario.terms[1][1]], [scenario.terms[1][0], scenario.terms[2][1]]])
  const wrongMultiply = `${scenario.terms[0][1]}${scenario.terms[1][1]} + ${termText(scenario.terms[2][0], scenario.terms[2][1])}`
  const options = buildOptions(answer, [wrongNoMultipliers, wrongSwap, wrongMultiply, wrongAddCounts])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-symbolic-total',
    variantKey: `quantitative-symbolic-total-${answer}`,
    prompt: 'What is the total cost of the order?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Sample item</strong></div>
        <div class="statement mt8">${scenario.intro}</div>
      </div>
    `,
    answer,
    options,
    explanation: `Translate each purchase into algebra and then add the terms: ${answer}.`,
    explanationHtml: `
      <div class="formula-block">
        ${scenario.terms.map(([count, symbol]) => `<div class="formula-line">${count === 1 ? `One item at ${symbol}` : `${count} items at ${symbol} each`} -> ${termText(count, symbol)}</div>`).join('')}
        <div class="formula-line">Total = ${answer}</div>
      </div>
    `,
    pattern: 'For symbolic purchase questions, convert each quantity into count x price, then add the terms.'
  })
}

function quantitativeMultiYearGrowth(difficulty) {
  const initial = pick([40, 60, 80, 120])
  const final = initial * 1.5 * 1.5 * 2 * 3
  const answer = String(initial)
  const options = buildOptions(answer, [
    String(final / 6),
    String(final / 9),
    String(final / 12),
    String(final / 15),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-multi-year-growth',
    variantKey: `quantitative-multi-year-growth-${initial}`,
    prompt: 'What was the initial value of the commodity?',
    visualHtml: `
      <div class="chart">
        <div class="statement">A commodity has been on the market for four years and is currently worth ${formatNumber(final)} euros.</div>
        <div class="statement mt8">In its first two years, its value increased by 50% every year. Its value doubled in the third year and tripled in the last year to reach its current value.</div>
      </div>
    `,
    answer,
    options,
    explanation: `Work backwards by reversing the yearly multipliers: divide by 3, divide by 2, then divide by 1.5 twice. That gives ${initial}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Current value = ${formatNumber(final)}</div>
        <div class="formula-line">Reverse last year tripling: ${formatNumber(final)} / 3 = ${formatNumber(final / 3)}</div>
        <div class="formula-line">Reverse third-year doubling: ${formatNumber(final / 3)} / 2 = ${formatNumber(final / 6)}</div>
        <div class="formula-line">Reverse second-year 50% growth: ${formatNumber(final / 6)} / 1.5 = ${formatNumber(final / 9)}</div>
        <div class="formula-line">Reverse first-year 50% growth: ${formatNumber(final / 9)} / 1.5 = ${initial}</div>
      </div>
    `,
    pattern: 'When a value changes over time, reverse the operations in the opposite order.'
  })
}

function quantitativeExpandExpression(difficulty) {
  let m = 4
  let b = 6
  let n = 3
  let d = 2
  const candidates = [
    [4, 6, 3, 2],
    [3, 8, 4, 2],
    [5, 4, 2, 1],
    [2, 10, 3, 4],
  ]
  ;[m, b, n, d] = pick(candidates)

  const aCoeff = m * n
  const kCoeff = b * n - m * d
  const constantTerm = -b * d
  const answerValue = aCoeff + kCoeff - constantTerm
  const answer = String(answerValue)
  const options = buildOptions(answer, [
    String(aCoeff + kCoeff + constantTerm),
    String(aCoeff - kCoeff - constantTerm),
    String(aCoeff + Math.abs(kCoeff) - Math.abs(constantTerm)),
    String(aCoeff + kCoeff),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-expand-expression',
    variantKey: `quantitative-expand-expression-${m}-${b}-${n}-${d}`,
    prompt: 'What is the value of a + k - n?',
    visualHtml: `
      <div class="chart center">
        <div class="question-text" style="font-size:30px;">(${m}x + ${b}) (${n}x - ${d}) = ax<sup>2</sup> + kx + n</div>
      </div>
    `,
    answer,
    options,
    explanation: `Expand the brackets to identify a, k and n, then substitute them into a + k - n. The value is ${answerValue}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">(${m}x + ${b}) (${n}x - ${d}) = ${aCoeff}x<sup>2</sup> + ${kCoeff}x ${constantTerm < 0 ? '- ' + Math.abs(constantTerm) : '+ ' + constantTerm}</div>
        <div class="formula-line">So a = ${aCoeff}, k = ${kCoeff}, n = ${constantTerm}</div>
        <div class="formula-line">a + k - n = ${aCoeff} + ${kCoeff} - (${constantTerm}) = ${answerValue}</div>
      </div>
    `,
    pattern: 'For bracket expansion, compute x<sup>2</sup>, x, and constant terms separately before substituting.'
  })
}

function quantitativeReverseDecrease(difficulty) {
  const increase = pick([10, 20, 25, 50])
  const answerValue = increase / (100 + increase)
  const answer = formatDecimal(answerValue, 4)
  const options = buildOptions(answer, [
    formatDecimal(increase / 100, 4),
    formatDecimal(answerValue / 2, 4),
    formatDecimal(1 - answerValue, 4),
    '1',
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-reverse-decrease',
    variantKey: `quantitative-reverse-decrease-${increase}`,
    prompt: 'If the price is the same in March as it was in January, by what percent did the price decrease from February to March?',
    visualHtml: `
      <div class="chart">
        <div class="statement">The price of a computer program increased by ${increase}% from January to February.</div>
        <div class="statement mt8">In March, the price returned to exactly the January level.</div>
      </div>
    `,
    answer,
    options,
    explanation: `After a ${increase}% increase, the February price is ${formatDecimal(1 + increase / 100, 4)} times the January price. To return to the January price, the decrease must be ${answer} of the February price.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Let the January price be 1.</div>
        <div class="formula-line">February price = 1 + ${increase / 100} = ${formatDecimal(1 + increase / 100, 4)}</div>
        <div class="formula-line">Decrease needed = (${formatDecimal(1 + increase / 100, 4)} - 1) / ${formatDecimal(1 + increase / 100, 4)}</div>
        <div class="formula-line">= ${answer}</div>
      </div>
    `,
    pattern: 'A rise of p% is reversed by dividing the increase amount by the new value, not by using the same percentage again.'
  })
}

function quantitativeDoubleDiscount(difficulty) {
  const scenarios = [
    { first: 50, second: 20 },
    { first: 40, second: 25 },
    { first: 25, second: 20 },
    { first: 30, second: 10 },
  ]
  const scenario = pick(scenarios)
  const factor = (1 - scenario.first / 100) * (1 - scenario.second / 100)
  const answer = `${formatDecimal(factor, 2)}X`
  const options = buildOptions(answer, [
    `${formatDecimal(1 - scenario.first / 100, 2)}X`,
    `${formatDecimal(1 - scenario.second / 100, 2)}X`,
    `${formatDecimal(1 - (scenario.first + scenario.second) / 100, 2)}X`,
    `${formatDecimal((scenario.first / 100) * (scenario.second / 100), 2)}X`,
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-double-discount',
    variantKey: `quantitative-double-discount-${scenario.first}-${scenario.second}`,
    prompt: 'What will a customer pay for this item in terms of X?',
    visualHtml: `
      <div class="chart">
        <div class="statement">As part of a store-wide clearance event, customers receive ${scenario.second}% off already reduced merchandise.</div>
        <div class="statement mt8">An item was originally priced at X euros and had been on sale for ${scenario.first}% off.</div>
      </div>
    `,
    answer,
    options,
    explanation: `Apply the discounts one after another, not by adding them. The customer pays ${formatDecimal(1 - scenario.first / 100, 2)}X first, then ${formatDecimal(1 - scenario.second / 100, 2)} of that, which equals ${answer}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">After the first discount: X x ${formatDecimal(1 - scenario.first / 100, 2)} = ${formatDecimal(1 - scenario.first / 100, 2)}X</div>
        <div class="formula-line">After the second discount: ${formatDecimal(1 - scenario.first / 100, 2)}X x ${formatDecimal(1 - scenario.second / 100, 2)}</div>
        <div class="formula-line">= ${answer}</div>
      </div>
    `,
    pattern: 'For repeated percentage discounts, multiply the remaining factors.'
  })
}

function quantitativeCubeVolume(difficulty) {
  const volume = pick([8, 27, 64, 125])
  const increase = volume * 7
  const answer = String(increase)
  const options = buildOptions(answer, [
    String(volume),
    String(volume * 2),
    String(volume * 4),
    String(volume * 8),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-cube-volume',
    variantKey: `quantitative-cube-volume-${volume}`,
    prompt: 'By how many cubic meters would the volume of the box increase if each side were twice as long?',
    visualHtml: `
      <div class="chart">
        <div class="statement">A cubical box has a volume of ${volume} cubic meters.</div>
      </div>
    `,
    answer,
    options,
    explanation: `Doubling every side multiplies the volume by 2 cubed = 8. So the new volume is ${volume * 8}, and the increase is ${volume * 8} - ${volume} = ${increase}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Volume scale factor = 2<sup>3</sup> = 8</div>
        <div class="formula-line">New volume = ${volume} x 8 = ${volume * 8}</div>
        <div class="formula-line">Increase = ${volume * 8} - ${volume} = ${increase}</div>
      </div>
    `,
    pattern: 'If side lengths scale by k, volume scales by k^3.'
  })
}

function quantitativeRemainingShare(difficulty) {
  const scenarios = [
    { first: 45, second: 15, thirdOfRemaining: 20 },
    { first: 30, second: 20, thirdOfRemaining: 25 },
    { first: 40, second: 10, thirdOfRemaining: 50 },
    { first: 35, second: 25, thirdOfRemaining: 30 },
  ]
  const scenario = pick(scenarios)
  const remainingAfterTwo = 100 - scenario.first - scenario.second
  const thirdShare = remainingAfterTwo * scenario.thirdOfRemaining / 100
  const outsideShare = (100 - scenario.first - scenario.second - thirdShare) / 100
  const answer = formatDecimal(outsideShare, 4)
  const options = buildOptions(answer, [
    formatDecimal(remainingAfterTwo / 100, 4),
    formatDecimal((100 - scenario.first - scenario.second - scenario.thirdOfRemaining) / 100, 4),
    formatDecimal(thirdShare / 100, 4),
    formatDecimal(scenario.first / 100, 4),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-remaining-share',
    variantKey: `quantitative-remaining-share-${scenario.first}-${scenario.second}-${scenario.thirdOfRemaining}`,
    prompt: 'What is the proportion not located in one of these three states?',
    visualHtml: `
      <div class="chart">
        <div class="statement">${scenario.first}% of a retailer's stores are in Florida.</div>
        <div class="statement">${scenario.second}% are in Illinois.</div>
        <div class="statement">${scenario.thirdOfRemaining}% of the remaining stores are in North Carolina.</div>
      </div>
    `,
    answer,
    options,
    explanation: `After Florida and Illinois, ${remainingAfterTwo}% remain. North Carolina takes ${scenario.thirdOfRemaining}% of that remainder, so the stores outside all three states make up ${answer}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Remaining after first two states = 100 - ${scenario.first} - ${scenario.second} = ${remainingAfterTwo}%</div>
        <div class="formula-line">North Carolina share = ${scenario.thirdOfRemaining}% of ${remainingAfterTwo}% = ${formatDecimal(thirdShare / 100, 4)}</div>
        <div class="formula-line">Outside all three states = ${formatDecimal(remainingAfterTwo / 100, 4)} - ${formatDecimal(thirdShare / 100, 4)} = ${answer}</div>
      </div>
    `,
    pattern: 'When a percentage is taken from the remaining group, apply it to the remainder, not to the whole.'
  })
}

function quantitativeRelativePercentGap(difficulty) {
  const morePercent = pick([6.25, 12.5, 20, 25])
  const answerValue = morePercent / (100 + morePercent)
  const answer = formatDecimal(answerValue, 4)
  const options = buildOptions(answer, [
    formatDecimal(morePercent / 100, 4),
    formatDecimal(morePercent / (100 - morePercent), 4),
    formatDecimal(answerValue + 0.01, 4),
    formatDecimal(answerValue - 0.0088, 4),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-relative-percent-gap',
    variantKey: `quantitative-relative-percent-gap-${morePercent}`,
    prompt: `Your income is ${morePercent}% more than Bob's. By what percentage is Bob's income less than yours?`,
    visualHtml: `
      <div class="chart">
        <div class="statement">Compare Bob's income to your larger income, not to Bob's own income.</div>
      </div>
    `,
    answer,
    options,
    explanation: `If Bob earns 1, then you earn ${formatDecimal(1 + morePercent / 100, 4)}. Bob is therefore ${answer} less than your income.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Let Bob's income = 1</div>
        <div class="formula-line">Your income = 1 + ${morePercent / 100} = ${formatDecimal(1 + morePercent / 100, 4)}</div>
        <div class="formula-line">Difference = ${formatDecimal(morePercent / 100, 4)}</div>
        <div class="formula-line">Percentage Bob is below yours = ${formatDecimal(morePercent / 100, 4)} / ${formatDecimal(1 + morePercent / 100, 4)} = ${answer}</div>
      </div>
    `,
    pattern: 'A percentage "more than Bob" is based on Bob, but "less than yours" must be based on your larger amount.'
  })
}

function quantitativeInvestmentIncome(difficulty) {
  const scenarios = [
    { total: 6500, lowRate: 2, highRate: 3 },
    { total: 9000, lowRate: 4, highRate: 5 },
    { total: 4800, lowRate: 3, highRate: 5 },
    { total: 7500, lowRate: 2, highRate: 4 },
  ]
  const scenario = pick(scenarios)
  const totalIncome = 2 * scenario.lowRate * scenario.highRate * scenario.total / (scenario.lowRate + scenario.highRate) / 100
  const answer = formatDecimal(totalIncome, 2)
  const options = buildOptions(answer, [
    formatDecimal(scenario.total * scenario.lowRate / 100, 2),
    formatDecimal(scenario.total * scenario.highRate / 100, 2),
    formatDecimal(totalIncome / 2, 2),
    formatDecimal(totalIncome + scenario.lowRate + scenario.highRate, 2),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-investment-income',
    variantKey: `quantitative-investment-income-${scenario.total}-${scenario.lowRate}-${scenario.highRate}`,
    prompt: 'If the annual income provided by the two investments is the same, what is the total investment income per year?',
    visualHtml: `
      <div class="chart">
        <div class="statement">An investor has a total of ${formatNumber(scenario.total)} euros to invest.</div>
        <div class="statement mt8">Part is invested at ${scenario.lowRate}% annual return and the remainder at ${scenario.highRate}% annual return.</div>
      </div>
    `,
    answer,
    options,
    explanation: `Set the two annual incomes equal, solve for one portion, and then add the two equal income amounts. The total annual income is ${answer}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Let x be the amount at ${scenario.lowRate}%.</div>
        <div class="formula-line">Equal income means ${scenario.lowRate}% of x = ${scenario.highRate}% of (${scenario.total} - x)</div>
        <div class="formula-line">That gives one income amount of ${formatDecimal(totalIncome / 2, 2)}</div>
        <div class="formula-line">Total income = 2 x ${formatDecimal(totalIncome / 2, 2)} = ${answer}</div>
      </div>
    `,
    pattern: 'When two investment incomes are equal, set rate x amount on one side equal to rate x amount on the other.'
  })
}

function quantitativeInclusionExclusion(difficulty) {
  const scenarios = [
    { total: 32, morning: 6, evening: 18, both: 4 },
    { total: 40, morning: 14, evening: 19, both: 6 },
    { total: 36, morning: 11, evening: 17, both: 5 },
    { total: 28, morning: 9, evening: 13, both: 4 },
  ]
  const scenario = pick(scenarios)
  const union = scenario.morning + scenario.evening - scenario.both
  const neither = scenario.total - union
  const answer = String(neither)
  const options = buildOptions(answer, [
    String(scenario.total - scenario.morning - scenario.evening),
    String(scenario.total - scenario.both),
    String(union),
    String(scenario.total - Math.max(scenario.morning, scenario.evening)),
  ])

  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-inclusion-exclusion',
    variantKey: `quantitative-inclusion-exclusion-${scenario.total}-${scenario.morning}-${scenario.evening}-${scenario.both}`,
    prompt: 'How many employees do not work either shift on Monday?',
    visualHtml: `
      <div class="chart">
        <div class="statement">In a store of ${scenario.total} employees, ${scenario.morning} employees work Monday's morning shift, ${scenario.evening} employees work Monday's evening shift, and ${scenario.both} employees work both the morning and evening shifts.</div>
      </div>
    `,
    answer,
    options,
    explanation: `Use inclusion-exclusion: employees working at least one shift = ${scenario.morning} + ${scenario.evening} - ${scenario.both} = ${union}. Then subtract from ${scenario.total}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">At least one shift = ${scenario.morning} + ${scenario.evening} - ${scenario.both} = ${union}</div>
        <div class="formula-line">Neither shift = ${scenario.total} - ${union} = ${neither}</div>
      </div>
    `,
    pattern: 'For overlap questions, subtract the overlap once when finding the union.'
  })
}

function buildQuantQuestion(difficulty, { familyKey, variantKey, prompt, visualHtml, answer, options, explanation, explanationHtml, pattern }) {
  return {
    topic: 'quantitative',
    topicLabel: 'AP Quantitative',
    familyKey,
    variantKey,
    timer: getTimerSeconds('quantitative', difficulty),
    prompt,
    visualHtml,
    options: options.map(value => ({ text: String(value), plain: String(value) })),
    correctIndex: options.indexOf(String(answer)),
    explanation,
    explanationHtml,
    pattern,
  }
}

function termText(count, symbol) {
  return count === 1 ? symbol : `${count}${symbol}`
}

function expressionFromTerms(terms) {
  return terms.map(([count, symbol]) => termText(count, symbol)).join(' + ')
}

function buildOptions(answer, distractors) {
  const values = [...new Set([String(answer), ...distractors.map(value => String(value))])]
  return shuffle(values).slice(0, 5)
}

function formatDecimal(value, maxDecimals = 4) {
  return Number(value.toFixed(maxDecimals)).toString()
}

function formatNumber(value) {
  return Number(value).toLocaleString('en-US')
}