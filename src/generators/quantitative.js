import { getTimerSeconds, pick, shuffle } from '../engine-core'

export function generateQuantitative(difficulty) {
  const families = difficulty === 'easy'
    ? [
        'fraction-arithmetic',
        'percent-word',
        'percent-word',
        'rate-word',
        'rate-word',
        'geometry-visual',
        'symbolic-total',
        'double-discount',
        'cube-volume',
        'inclusion-exclusion',
        'expand-expression',
      ]
    : difficulty === 'medium'
    ? [
        'fraction-arithmetic',
        'percent-word',
        'rate-word',
        'geometry-visual',
        'symbolic-total',
        'expand-expression',
        'reverse-decrease',
        'double-discount',
        'cube-volume',
        'remaining-share',
        'investment-income',
        'inclusion-exclusion',
        'multi-year-growth',
      ]
    : [
        'percent-word',
        'rate-word',
        'geometry-visual',
        'expand-expression',
        'reverse-decrease',
        'double-discount',
        'cube-volume',
        'remaining-share',
        'relative-percent-gap',
        'investment-income',
        'inclusion-exclusion',
        'multi-year-growth',
        'symbolic-total',
      ]

  const family = pick(families)
  if (family === 'fraction-arithmetic') return quantitativeFractionArithmetic(difficulty)
  if (family === 'percent-word') return quantitativePercentWord(difficulty)
  if (family === 'rate-word') return quantitativeRateWord(difficulty)
  if (family === 'geometry-visual') return quantitativeGeometryVisual(difficulty)
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

function quantitativeFractionArithmetic(difficulty) {
  const scenarios = [
    {
      key: 'multiply-equals-one',
      left: { n: 4, d: 2 },
      op: 'times',
      right: { n: 2, d: 4 },
      answerHtml: '1',
      answerPlain: '1',
      distractors: [
        { html: fractionHtml(6, 8), plain: '6/8' },
        { html: fractionHtml(8, 6), plain: '8/6' },
        { html: fractionHtml(16, 32), plain: '16/32' },
        { html: 'Keine Antwort ist richtig.', plain: 'None of the answers is correct.' },
      ],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">4/2 = 2</div>
          <div class="formula-line">2/4 = 1/2</div>
          <div class="formula-line">2 &times; 1/2 = 1</div>
        </div>
      `,
      explanation: 'Simplify each fraction first, then multiply. The result is 1.',
    },
    {
      key: 'divide-same-fraction',
      left: { n: 2, d: 3 },
      op: 'divide',
      right: { n: 2, d: 3 },
      answerHtml: '1',
      answerPlain: '1',
      distractors: [
        { html: fractionHtml(4, 9), plain: '4/9' },
        { html: fractionHtml(5, 2), plain: '5/2' },
        { html: fractionHtml(2, 3), plain: '2/3' },
        { html: 'Keine Antwort ist richtig.', plain: 'None of the answers is correct.' },
      ],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Dividing a number by itself gives 1.</div>
          <div class="formula-line">(2/3) &divide; (2/3) = 1</div>
        </div>
      `,
      explanation: 'Any non-zero fraction divided by the same fraction equals 1.',
    },
    {
      key: 'mixed-add-subtract',
      expressionHtml: `-${fractionHtml(100, 300)} - ${fractionHtml(5, 3)} + 12`,
      answerHtml: '10',
      answerPlain: '10',
      distractors: [
        { html: fractionHtml(9, 12), plain: '9/12' },
        { html: '5', plain: '5' },
        { html: fractionHtml(750, 30), plain: '750/30' },
        { html: 'Keine Antwort ist richtig.', plain: 'None of the answers is correct.' },
      ],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">-100/300 = -1/3</div>
          <div class="formula-line">-1/3 - 5/3 = -6/3 = -2</div>
          <div class="formula-line">-2 + 12 = 10</div>
        </div>
      `,
      explanation: 'Convert the fractions first, keep the negative sign, and then combine the terms. The result is 10.',
    },
  ]

  const scenario = pick(scenarios)
  const answerOption = { html: scenario.answerHtml, plain: scenario.answerPlain }
  const visualExpression = scenario.expressionHtml || `${fractionHtml(scenario.left.n, scenario.left.d)} ${scenario.op === 'times' ? '&times;' : '&divide;'} ${fractionHtml(scenario.right.n, scenario.right.d)}`
  const options = shuffle([answerOption, ...scenario.distractors]).slice(0, 5)
  const correctIndex = options.findIndex(option => option.plain === answerOption.plain)

  return {
    topic: 'quantitative',
    topicLabel: 'AP Quantitative',
    familyKey: 'quantitative-fraction-arithmetic',
    variantKey: `quantitative-fraction-arithmetic-${scenario.key}`,
    timer: getTimerSeconds('quantitative', difficulty),
    prompt: 'What is the result?',
    visualHtml: `
      <div class="chart center">
        <div class="center"><strong>Fraction arithmetic</strong></div>
        <div class="question-text" style="font-size:30px; margin-top:14px;">${visualExpression} = ?</div>
      </div>
    `,
    options: options.map(option => ({ text: option.html, html: option.html, plain: option.plain })),
    correctIndex,
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For fraction arithmetic, simplify first when possible, then use the operation rule and common denominators where needed.',
  }
}
function quantitativePercentWord(difficulty) {
  const scenarios = [
    {
      key: 'cycle-race',
      prompt: 'A cycle race has 50 participants. 10% of the riders drop out after the first stage and 30% do not complete the next stage. How many riders start the third stage?',
      answer: 'None of the answers is correct.',
      options: ['10 drivers', '44 drivers', '20 drivers', '30 drivers', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">After stage 1: 50 - 10% of 50 = 45 riders</div>
          <div class="formula-line">After stage 2: 45 - 30% of 45 = 31.5 riders</div>
          <div class="formula-line">That result does not match any listed whole-number answer.</div>
        </div>
      `,
      explanation: 'Apply the second percentage to the remaining riders. The resulting value does not match any listed answer, so the correct choice is none of the answers.',
    },
    {
      key: 'everest',
      prompt: 'Mount Everest is 8,848 meters high. What share of the total height still remains when you are at Everest base camp at 5,350 meters?',
      answer: 'About 39.5%',
      options: ['About 47.2%', 'About 43.8%', 'About 42.1%', 'About 39.5%', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Height remaining = 8,848 - 5,350 = 3,498 meters</div>
          <div class="formula-line">Share remaining = 3,498 / 8,848 = 0.3953</div>
          <div class="formula-line">That is about 39.5%</div>
        </div>
      `,
      explanation: 'Subtract the base-camp altitude from the total height, then divide by the total height to get the remaining share.',
    },
    {
      key: 'nyc-population',
      prompt: 'The New York City metropolitan region had about 19.2 million inhabitants in 2020. That was about 5.8% of the total US population of ... ?',
      answer: 'About 331 million people',
      options: ['About 342 million people', 'About 331 million people', 'About 325 million people', 'About 317 million people', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Total population = 19.2 million / 0.058</div>
          <div class="formula-line">= 331.0 million approximately</div>
        </div>
      `,
      explanation: 'If 19.2 million is 5.8% of the whole, divide 19.2 by 0.058 to find the total population.',
    },
  ]
  const scenario = pick(scenarios)
  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-percent-word',
    variantKey: `quantitative-percent-word-${scenario.key}`,
    prompt: scenario.prompt,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Percentage reasoning</strong></div>
      </div>
    `,
    answer: scenario.answer,
    options: scenario.options,
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For percentage word problems, first identify the base quantity, then apply or reverse the percentage carefully.',
  })
}

function quantitativeRateWord(difficulty) {
  const scenarios = [
    {
      key: 'excavators',
      prompt: '10 large excavators transport 15 tonnes of rubble per day. How much rubble do 15 excavators transport per day?',
      answer: '22.5 tonnes',
      options: ['20 tonnes', '22.5 tonnes', '25 tonnes', '30 tonnes', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Per excavator: 15 / 10 = 1.5 tonnes per day</div>
          <div class="formula-line">For 15 excavators: 15 x 1.5 = 22.5 tonnes per day</div>
        </div>
      `,
      explanation: 'Find the daily output per excavator, then scale it up to 15 excavators.',
    },
    {
      key: 'pool-pipes',
      prompt: 'A swimming pool is filled by 4 pipes in 1 hour. How long would filling take with 3 pipes?',
      answer: '80 minutes',
      options: ['70 minutes', '80 minutes', '90 minutes', '100 minutes', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">4 pipes fill 1 pool in 60 minutes</div>
          <div class="formula-line">Work is proportional to pipes x time</div>
          <div class="formula-line">Time with 3 pipes = 60 x 4 / 3 = 80 minutes</div>
        </div>
      `,
      explanation: 'This is inverse proportion: fewer pipes means more time, so multiply by 4/3.',
    },
    {
      key: 'drilling-machine',
      prompt: 'An automated drilling machine drills 30,000 holes in 1.5 hours. How many holes would 5 machines drill in one working day (8 hours)?',
      answer: '800,000 holes',
      options: ['1,000,000 holes', '800,000 holes', '600,000 holes', '400,000 holes', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Per machine per hour: 30,000 / 1.5 = 20,000 holes</div>
          <div class="formula-line">5 machines for 8 hours: 20,000 x 5 x 8 = 800,000 holes</div>
        </div>
      `,
      explanation: 'Convert to an hourly rate for one machine, then multiply by the number of machines and hours.',
    },
    {
      key: 'athletes-water',
      prompt: '3 track athletes drink 54 bottles of water in 6 days. How much water do 2 athletes drink per week?',
      answer: '42 bottles',
      options: ['42 bottles', '46 bottles', '32 bottles', '36 bottles', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Per athlete per day: 54 / 3 / 6 = 3 bottles</div>
          <div class="formula-line">For 2 athletes over 7 days: 3 x 2 x 7 = 42 bottles</div>
        </div>
      `,
      explanation: 'Reduce to one athlete per day first, then scale to 2 athletes and 7 days.',
    },
    {
      key: 'screw-stock',
      prompt: 'A stock of 720 crosshead screws is expected to last for 7.5 days. When will the stock be exhausted if 24 more screws per day are needed than planned?',
      answer: 'After 6 days',
      options: ['After 5.5 days', 'After 7 days', 'After 4 days', 'After 6 days', 'None of the answers is correct.'],
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Planned daily use: 720 / 7.5 = 96 screws</div>
          <div class="formula-line">Actual daily use: 96 + 24 = 120 screws</div>
          <div class="formula-line">Days until empty: 720 / 120 = 6</div>
        </div>
      `,
      explanation: 'First find the planned daily consumption, add the extra 24 screws, then divide the stock by the new daily use.',
    },
  ]
  const scenario = pick(scenarios)
  return buildQuantQuestion(difficulty, {
    familyKey: 'quantitative-rate-word',
    variantKey: `quantitative-rate-word-${scenario.key}`,
    prompt: scenario.prompt,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Mixed word problems</strong></div>
      </div>
    `,
    answer: scenario.answer,
    options: scenario.options,
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For rate and proportion problems, reduce to a unit rate or use direct/inverse proportion before scaling back up.',
  })
}
function quantitativeGeometryVisual(difficulty) {
  const scenarios = [
    {
      key: 'right-triangle-leg',
      prompt: 'What is the length of the unknown leg of the right triangle shown?',
      answer: { html: 'About 3.32 cm', plain: 'About 3.32 cm' },
      options: [
        { html: 'About 3.32 cm', plain: 'About 3.32 cm' },
        { html: 'About 4.61 cm', plain: 'About 4.61 cm' },
        { html: 'About 3.71 cm', plain: 'About 3.71 cm' },
        { html: 'About 5.51 cm', plain: 'About 5.51 cm' },
        { html: 'About 5.91 cm', plain: 'About 5.91 cm' },
      ],
      visualHtml: `
        <div class="chart center">
          <div class="center"><strong>Geometry</strong></div>
          <svg width="320" height="180" viewBox="0 0 320 180" role="img" aria-label="Right triangle">
            <polygon points="50,140 250,140 250,40" fill="#eef3fb" stroke="#28334a" stroke-width="2"></polygon>
            <line x1="50" y1="140" x2="250" y2="40" stroke="#28334a" stroke-width="3"></line>
            <line x1="230" y1="140" x2="230" y2="120" stroke="#28334a" stroke-width="2"></line>
            <line x1="250" y1="120" x2="230" y2="120" stroke="#28334a" stroke-width="2"></line>
            <text x="138" y="154" font-size="16" text-anchor="middle">5 cm</text>
            <text x="132" y="82" font-size="16" text-anchor="middle" transform="rotate(-27 132 82)">6 cm</text>
            <text x="264" y="96" font-size="18">?</text>
          </svg>
        </div>
      `,
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Use the Pythagorean theorem: a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></div>
          <div class="formula-line">Unknown leg = &radic;(6<sup>2</sup> - 5<sup>2</sup>) = &radic;(36 - 25) = &radic;11</div>
          <div class="formula-line">&radic;11 &asymp; 3.32 cm</div>
        </div>
      `,
      explanation: 'In a right triangle, the missing leg equals the square root of the hypotenuse squared minus the known leg squared.',
      pattern: 'For right triangles, use the Pythagorean theorem and round only at the end.',
    },
    {
      key: 'cube-volume',
      prompt: 'What is the volume of the cube?',
      answer: { html: '125 cm<sup>3</sup>', plain: '125 cm^3' },
      options: [
        { html: '85 cm<sup>3</sup>', plain: '85 cm^3' },
        { html: '205 cm<sup>3</sup>', plain: '205 cm^3' },
        { html: '125 cm<sup>3</sup>', plain: '125 cm^3' },
        { html: '95 cm<sup>3</sup>', plain: '95 cm^3' },
        { html: '165 cm<sup>3</sup>', plain: '165 cm^3' },
      ],
      visualHtml: `
        <div class="chart center">
          <div class="center"><strong>Geometry</strong></div>
          <svg width="320" height="190" viewBox="0 0 320 190" role="img" aria-label="Cube with side length 5 cm">
            <polygon points="85,55 205,55 205,150 85,150" fill="#eef3fb" stroke="#28334a" stroke-width="2"></polygon>
            <polygon points="85,55 125,25 245,25 205,55" fill="#f7f9fc" stroke="#28334a" stroke-width="2"></polygon>
            <polygon points="205,55 245,25 245,120 205,150" fill="#e4ebf7" stroke="#28334a" stroke-width="2"></polygon>
            <line x1="60" y1="150" x2="60" y2="55" stroke="#28334a" stroke-width="2"></line>
            <line x1="55" y1="150" x2="65" y2="150" stroke="#28334a" stroke-width="2"></line>
            <line x1="55" y1="55" x2="65" y2="55" stroke="#28334a" stroke-width="2"></line>
            <text x="40" y="106" font-size="16" transform="rotate(-90 40 106)">5 cm</text>
          </svg>
        </div>
      `,
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Volume of a cube = side<sup>3</sup></div>
          <div class="formula-line">V = 5<sup>3</sup> = 5 &times; 5 &times; 5 = 125 cm<sup>3</sup></div>
        </div>
      `,
      explanation: 'For a cube, volume equals side length cubed.',
      pattern: 'For cubes, use V = a^3.',
    },
    {
      key: 'box-surface-area',
      prompt: 'What is the surface area of the box shown?',
      answer: { html: '16,175 cm<sup>2</sup>', plain: '16,175 cm^2' },
      options: [
        { html: '12,750 cm<sup>2</sup>', plain: '12,750 cm^2' },
        { html: '16,175 cm<sup>2</sup>', plain: '16,175 cm^2' },
        { html: '10,250 cm<sup>2</sup>', plain: '10,250 cm^2' },
        { html: '21,050 cm<sup>2</sup>', plain: '21,050 cm^2' },
        { html: '18,375 cm<sup>2</sup>', plain: '18,375 cm^2' },
      ],
      visualHtml: `
        <div class="chart center">
          <div class="center"><strong>Geometry</strong></div>
          <svg width="360" height="210" viewBox="0 0 360 210" role="img" aria-label="Rectangular box with dimensions 85 cm, 40 cm and 37.5 cm">
            <polygon points="70,80 250,80 250,150 70,150" fill="#eef3fb" stroke="#28334a" stroke-width="2"></polygon>
            <polygon points="70,80 110,50 290,50 250,80" fill="#f7f9fc" stroke="#28334a" stroke-width="2"></polygon>
            <polygon points="250,80 290,50 290,120 250,150" fill="#e4ebf7" stroke="#28334a" stroke-width="2"></polygon>
            <line x1="55" y1="150" x2="55" y2="80" stroke="#28334a" stroke-width="2"></line>
            <line x1="50" y1="150" x2="60" y2="150" stroke="#28334a" stroke-width="2"></line>
            <line x1="50" y1="80" x2="60" y2="80" stroke="#28334a" stroke-width="2"></line>
            <text x="37" y="120" font-size="14" transform="rotate(-90 37 120)">37.5 cm</text>
            <text x="160" y="170" font-size="16" text-anchor="middle">85 cm</text>
            <text x="305" y="118" font-size="16" transform="rotate(-38 305 118)">40 cm</text>
          </svg>
        </div>
      `,
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Surface area of a rectangular box = 2(lw + lh + wh)</div>
          <div class="formula-line">= 2(85 &times; 40 + 85 &times; 37.5 + 40 &times; 37.5)</div>
          <div class="formula-line">= 2(3400 + 3187.5 + 1500)</div>
          <div class="formula-line">= 16,175 cm<sup>2</sup></div>
        </div>
      `,
      explanation: 'For a rectangular box, add the areas of the three different face pairs and multiply by two.',
      pattern: 'For cuboids, use surface area = 2(lw + lh + wh).',
    },
  ]

  const scenario = pick(scenarios)
  const options = shuffle(scenario.options.map(option => ({ ...option })))
  const correctIndex = options.findIndex(option => option.plain === scenario.answer.plain)

  return {
    topic: 'quantitative',
    topicLabel: 'AP Quantitative',
    familyKey: 'quantitative-geometry-visual',
    variantKey: `quantitative-geometry-visual-${scenario.key}`,
    timer: getTimerSeconds('quantitative', difficulty),
    prompt: scenario.prompt,
    visualHtml: scenario.visualHtml,
    options: options.map(option => ({ text: option.html, html: option.html, plain: option.plain })),
    correctIndex,
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: scenario.pattern,
  }
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

function fractionHtml(numerator, denominator) {
  return `<span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1;vertical-align:middle;"><span style="padding:0 4px;">${numerator}</span><span style="width:100%;border-top:2px solid currentColor;margin:2px 0;"></span><span style="padding:0 4px;">${denominator}</span></span>`
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





