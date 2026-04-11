import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'
import { generateErrorCheck } from './errorCheck'

const LOGICAL_TOPIC_LABEL = 'Abstract / diagrammatic reasoning'
const SWITCH_SYMBOL_SET = [
  { key: 'triangle', label: 'yellow triangle', shape: 'triangle', color: '#f5c542' },
  { key: 'plus', label: 'blue plus', shape: 'plus', color: '#57c5f7' },
  { key: 'square', label: 'red square', shape: 'square', color: '#e1443d' },
  { key: 'circle', label: 'green circle', shape: 'circle', color: '#72b635' },
]
const GAP_SYMBOL_SET = [
  { key: 'triangle', label: 'yellow triangle', deLabel: 'gelbes Dreieck', color: '#d4a514' },
  { key: 'plus', label: 'blue plus', deLabel: 'blaues Plus', color: '#57c5f7' },
  { key: 'square', label: 'red square', deLabel: 'rotes Quadrat', color: '#e1443d' },
  { key: 'circle', label: 'green circle', deLabel: 'gruener Kreis', color: '#72b635' },
  { key: 'star', label: 'purple star', deLabel: 'lila Stern', color: '#6c4ed9' },
]
const PERMUTATION_CODES = buildPermutationCodes()

export function generateDiagrammatic(difficulty) {
  const patterns = difficulty === 'easy'
    ? ['alternation', 'rotation', 'position']
    : difficulty === 'medium'
    ? ['alternation', 'rotation', 'count', 'position', 'shading']
    : ['rotation', 'count', 'position', 'shading']
  const type = pick(patterns)

  if (type === 'rotation') return diagRotation(difficulty)
  if (type === 'count') return diagCount(difficulty)
  if (type === 'position') return diagPosition(difficulty)
  if (type === 'shading') return diagShading(difficulty)
  return diagAlternation(difficulty)
}

export function diagAlternation(difficulty) {
  const set = pick([
    ['&#9650;', '&#9679;', '&#9650;', '&#9679;', '&#9650;'],
    ['&#9632;', '&#9633;', '&#9632;', '&#9633;', '&#9632;'],
    ['&#9670;', '&#9671;', '&#9670;', '&#9671;', '&#9670;'],
  ])
  const answer = set[1]
  const options = shuffle([answer, set[0], '&#9675;', '&#9651;'].filter((value, index, array) => array.indexOf(value) === index)).slice(0, 4)
  const correctIndex = options.indexOf(answer)
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Find the next figure</strong></div>
      <div class="diagram-grid">
        ${set.map(symbol => `<div class="diagram-cell">${symbol}</div>`).join('')}
        <div class="diagram-cell missing">?</div>
      </div>
    </div>
  `

  return {
    topic: 'diagrammatic',
    topicLabel: 'Diagrammatic reasoning',
    variantKey: 'diagrammatic-alternation',
    timer: getTimerSeconds('diagrammatic', difficulty),
    prompt: 'Which figure comes next?',
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex,
    explanation: 'This is a simple A-B-A-B-A alternation, so the next figure must be B.',
    pattern: 'Check the simplest rule first: alternation before anything more complex.',
  }
}

export function diagRotation(difficulty) {
  const shapes = ['&#9650;', '&#9654;', '&#9660;', '&#9664;']
  const start = randInt(0, 3)
  const seq = [0, 1, 2, 3, 0].map(offset => shapes[(start + offset) % 4])
  const answer = seq[4]
  const options = shuffle([...new Set(shapes)]).slice(0, 4)
  const correctIndex = options.indexOf(answer)
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Rotation pattern</strong></div>
      <div class="diagram-grid">
        ${seq.slice(0, 4).map(symbol => `<div class="diagram-cell">${symbol}</div>`).join('')}
        <div class="diagram-cell missing">?</div>
      </div>
    </div>
  `

  return {
    topic: 'diagrammatic',
    topicLabel: 'Diagrammatic reasoning',
    variantKey: 'diagrammatic-rotation',
    timer: getTimerSeconds('diagrammatic', difficulty),
    prompt: 'Which figure comes next?',
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex,
    explanation: 'The figure rotates by 90 degrees at each step.',
    pattern: 'For figure sequences, test rotation, count, position, and shading in that order.',
  }
}

export function diagCount(difficulty) {
  const start = difficulty === 'medium' ? 1 : 2
  const seq = [start, start + 1, start + 2, start + 3]
  const answer = start + 4
  const options = shuffle([answer, answer - 1, answer + 1, answer + 2])
  const correctIndex = options.indexOf(answer)
  const renderDots = count => `
    <div style="display:grid;grid-template-columns:repeat(3,14px);gap:6px;justify-content:center;">
      ${Array.from({ length: count }, () => '<span style="width:14px;height:14px;border-radius:999px;background:#111827;display:block"></span>').join('')}
    </div>
  `
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Count pattern</strong></div>
      <div class="diagram-grid">
        ${seq.map(count => `<div class="diagram-cell">${renderDots(count)}</div>`).join('')}
        <div class="diagram-cell missing">?</div>
      </div>
    </div>
  `

  return {
    topic: 'diagrammatic',
    topicLabel: 'Diagrammatic reasoning',
    variantKey: 'diagrammatic-count',
    timer: getTimerSeconds('diagrammatic', difficulty),
    prompt: 'How many dots should the next box contain?',
    visualHtml,
    options: options.map(value => ({ text: String(value), plain: String(value) })),
    correctIndex,
    explanation: 'The number of elements increases by 1 at each step.',
    pattern: 'Ignore shape style and track only the number of elements.',
  }
}

export function diagPosition(difficulty) {
  const positions = ['top', 'right', 'bottom', 'left']
  const circles = ['&#9679;', '&#9675;']
  const start = randInt(0, 3)
  const filled = difficulty === 'hard'
  const seq = [0, 1, 2, 3].map(step => positions[(start + step) % 4])
  const answer = positions[(start + 4) % 4]
  const renderBox = position => {
    const top = position === 'top' ? '16%' : position === 'bottom' ? '68%' : '42%'
    const left = position === 'left' ? '16%' : position === 'right' ? '68%' : '42%'
    return `<div class="diagram-cell"><span style="position:absolute;top:${top};left:${left};font-size:28px;">${filled ? circles[0] : circles[1]}</span></div>`
  }
  const optionHtml = position => {
    const top = position === 'top' ? '16%' : position === 'bottom' ? '68%' : '42%'
    const left = position === 'left' ? '16%' : position === 'right' ? '68%' : '42%'
    return `<div style="position:relative;height:42px;"><span style="position:absolute;top:${top};left:${left};font-size:24px;">${filled ? circles[0] : circles[1]}</span></div>`
  }
  const options = shuffle(positions).slice(0, 4)
  const correctIndex = options.indexOf(answer)
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Position pattern</strong></div>
      <div class="diagram-grid">
        ${seq.map(renderBox).join('')}
        <div class="diagram-cell missing">?</div>
      </div>
    </div>
  `

  return {
    topic: 'diagrammatic',
    topicLabel: 'Diagrammatic reasoning',
    variantKey: 'diagrammatic-position',
    timer: getTimerSeconds('diagrammatic', difficulty),
    prompt: 'Which box comes next?',
    visualHtml,
    options: options.map(value => ({ html: optionHtml(value), text: value, plain: value })),
    correctIndex,
    explanation: 'The symbol moves clockwise: top, right, bottom, left, then repeats.',
    pattern: 'Track movement separately from rotation, count, or shading.',
  }
}

export function diagShading(difficulty) {
  const shades = ['#111827', '#94a3b8', '#ffffff']
  const borders = ['#111827', '#111827', '#334155']
  const start = randInt(0, 2)
  const seq = [0, 1, 2, 0].map(offset => (start + offset) % 3)
  const answer = (start + 4) % 3
  const renderCell = index => `
    <div class="diagram-cell">
      <span style="width:40px;height:40px;border-radius:999px;display:block;background:${shades[index]};border:2px solid ${borders[index]};"></span>
    </div>
  `
  const options = shuffle([0, 1, 2]).map(index => ({
    index,
    html: `
      <div style="display:grid;place-items:center;height:42px;">
        <span style="width:28px;height:28px;border-radius:999px;display:block;background:${shades[index]};border:2px solid ${borders[index]};"></span>
      </div>
    `,
  }))
  const correctIndex = options.findIndex(option => option.index === answer)
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Shading sequence</strong></div>
      <div class="diagram-grid">
        ${seq.slice(0, 4).map(renderCell).join('')}
        <div class="diagram-cell missing">?</div>
      </div>
    </div>
  `

  return {
    topic: 'diagrammatic',
    topicLabel: 'Diagrammatic reasoning',
    variantKey: 'diagrammatic-shading',
    timer: getTimerSeconds('diagrammatic', difficulty),
    prompt: 'Which figure comes next?',
    visualHtml,
    options: options.map(option => ({ html: option.html, text: String(option.index), plain: `Option ${option.index + 1}` })),
    correctIndex,
    explanation: 'The circle fill cycles through dark, grey, white, then repeats.',
    pattern: 'Check fill and shading cycles separately from movement or shape.',
  }
}

export function generateLogical(difficulty) {
  const types = difficulty === 'easy'
    ? ['gap-challenge', 'gap-challenge', 'gap-challenge', 'gap-challenge', 'code-switch', 'code-switch', 'symmetry', 'number-series', 'surface-count', 'matrix']
    : difficulty === 'medium'
    ? ['gap-challenge', 'gap-challenge', 'gap-challenge', 'gap-challenge', 'gap-challenge', 'code-switch', 'code-switch', 'symmetry', 'number-series', 'surface-count', 'matrix', 'code-switch']
    : ['gap-challenge', 'gap-challenge', 'gap-challenge', 'gap-challenge', 'gap-challenge', 'matrix', 'code-switch', 'code-switch', 'symmetry', 'number-series', 'surface-count', 'matrix', 'number-series']
  const type = pick(types)
  const question = type === 'symmetry'
    ? logicalSymmetry(difficulty)
    : type === 'matrix'
    ? logicalMatrix(difficulty)
    : type === 'number-series'
    ? logicalNumberSeries(difficulty)
    : type === 'surface-count'
    ? logicalSurfaceCount(difficulty)
    : type === 'gap-challenge'
    ? logicalGapChallenge(difficulty)
    : logicalCodeSwitch(difficulty)

  return {
    ...question,
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    variantKey: `logical-${question.variantKey || question.prompt}`,
    timer: getTimerSeconds('logical', difficulty),
    explanation: question.explanation,
    pattern: question.pattern || 'Look for the transformation rule between figures: rotation, position, count, alternation, shading, coded reordering, sequence rules, or spatial structure.',
  }
}

export function logicalSymmetry(difficulty) {
  const axis = pick(['vertical', 'horizontal'])
  const gridSize = difficulty === 'easy' ? 4 : pick([4, 5])
  const rowCount = difficulty === 'hard' ? 3 : 2
  const rows = Array.from({ length: rowCount + 1 }, (_, index) => {
    const source = buildSymmetryPattern(axis, gridSize, 3 + index)
    return {
      source,
      mirrored: mirrorPatternPoints(source, axis, gridSize),
    }
  })
  const missingSide = difficulty === 'hard' ? pick(['left', 'right']) : 'right'
  const missingRow = rows.length - 1
  const answerPattern = missingSide === 'right' ? rows[missingRow].mirrored : rows[missingRow].source
  const distractors = buildSymmetryDistractors({
    answerPattern,
    sourcePattern: rows[missingRow].source,
    axis,
    gridSize,
  })
  const options = shuffle([answerPattern, ...distractors])
  const correctIndex = options.findIndex(option => patternKey(option) === patternKey(answerPattern))
  const visualHtml = renderSymmetryChallenge({
    axis,
    gridSize,
    missingRow,
    missingSide,
    rows,
    title: 'Symmetry matrix',
  })

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    familyKey: 'logical-symmetry',
    variantKey: `symmetry-${axis}-${gridSize}-${missingSide}-${rows.map(row => patternKey(row.source)).join('_')}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which figure completes the symmetry matrix?',
    visualHtml,
    options: options.map((pattern, index) => ({
      html: renderPatternGrid(pattern, gridSize, 12),
      text: `Option ${index + 1}`,
      plain: `Pattern ${index + 1}`,
    })),
    correctIndex,
    explanation: `In each row, the figure on one side is the mirror image of the figure on the other side across the ${axis} axis. Reflect the missing row across that axis to get the correct block pattern.`,
    pattern: 'For symmetry matrices, compare complete example rows first. Then mirror the missing figure cell-by-cell across the shown axis.',
    translations: {
      de: {
        prompt: 'Welche Figur vervollstaendigt die Symmetrie-Matrix?',
        explanation: `In jeder Zeile ist die Figur auf einer Seite das Spiegelbild der Figur auf der anderen Seite an der ${axis === 'vertical' ? 'vertikalen' : 'horizontalen'} Achse. Spiegele die fehlende Zeile an dieser Achse, um das richtige Muster zu erhalten.`,
        pattern: 'Bei Symmetrie-Matrizen zuerst die vollstaendigen Beispielzeilen vergleichen. Dann die fehlende Figur Feld fuer Feld an der gezeigten Achse spiegeln.',
      },
    },
  }
}
export function logicalMatrix(difficulty) {
  const scenario = pick([
    buildCountFillMatrixScenario(difficulty),
    buildShapeRotationMatrixScenario(difficulty),
  ])

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    familyKey: 'logical-matrix',
    variantKey: scenario.variantKey,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which option completes the 3x3 matrix?',
    visualHtml: scenario.visualHtml,
    options: scenario.options,
    correctIndex: scenario.correctIndex,
    explanation: scenario.explanation,
    pattern: scenario.pattern,
    translations: {
      de: {
        prompt: 'Welche Option vervollstaendigt die 3x3-Matrix?',
        explanation: scenario.deExplanation,
        pattern: scenario.dePattern,
      },
    },
  }
}

export function logicalCodeSwitch(difficulty) {
  const stageTemplate = pick(
    difficulty === 'easy'
      ? [{ id: 'direct', stageCount: 1, missingIndex: 0 }]
      : difficulty === 'medium'
      ? [
                    { id: 'before-fixed', stageCount: 2, missingIndex: 0 },
          { id: 'after-fixed', stageCount: 2, missingIndex: 1 },
          { id: 'sandwich-lite', stageCount: 3, missingIndex: 1 },
        ]
      : [
          { id: 'sandwich', stageCount: 3, missingIndex: 1 },
          { id: 'before-double-fixed', stageCount: 3, missingIndex: 0 },
          { id: 'after-double-fixed', stageCount: 3, missingIndex: 2 },
        ]
  )

  let initial = shuffle([...SWITCH_SYMBOL_SET])
  let codes = []
  let target = initial

  for (let attempt = 0; attempt < 60; attempt++) {
    initial = shuffle([...SWITCH_SYMBOL_SET])
    codes = shuffle(PERMUTATION_CODES).slice(0, stageTemplate.stageCount)
    target = codes.reduce((current, code) => applySwitchCode(current, code), initial)
    if (!sameSwitchSequence(initial, target)) break
  }

  const answerCode = codes[stageTemplate.missingIndex]
  const stages = codes.map((code, index) => (
    index === stageTemplate.missingIndex
      ? { kind: 'missing' }
      : { kind: 'fixed', code }
  ))
  const optionCount = difficulty === 'easy' ? 3 : 4
  const options = shuffle([
    answerCode,
    ...shuffle(PERMUTATION_CODES.filter(code => code !== answerCode)).slice(0, optionCount - 1),
  ])
  const correctIndex = options.indexOf(answerCode)
  const prompt = stageTemplate.stageCount === 1
    ? 'Which code transforms the top row into the bottom row?'
    : 'Which code should replace the missing stage?'

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    familyKey: 'logical-code-switch',
    variantKey: `code-switch-${stageTemplate.id}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt,
    subtext: 'A code such as 2314 means: take the 2nd symbol first, then 3rd, then 1st, then 4th.',
    visualHtml: buildSwitchChallengeHtml({ initial, stages, target, stageCount: stageTemplate.stageCount }),
    options: options.map(code => ({
      html: `<div class="switch-option-code">${code}</div>`,
      text: code,
      plain: code,
    })),
    correctIndex,
    explanation: 'Treat each 4-digit code as a positional reordering of the current row, then apply the stages in order.',
    explanationHtml: buildSwitchExplanationHtml({ initial, stages, answerCode, target }),
    pattern: 'For code-switch tasks, each digit points to the next symbol position. Apply one code at a time from top to bottom.',
  }
}

function logicalNumberSeries(difficulty) {
  const scenarios = [
    {
      key: 'times-minus',
      series: [15, 30, 25, 75, 70, 280],
      answer: '275',
      options: ['550', '360', '140', '275', 'None of the answers is correct.'],
      explanation: 'The rule alternates between multiplying by an increasing number and subtracting 5: ×2, -5, ×3, -5, ×4, -5. So after 280 the next value is 275.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">15 × 2 = 30</div>
          <div class="formula-line">30 - 5 = 25</div>
          <div class="formula-line">25 × 3 = 75</div>
          <div class="formula-line">75 - 5 = 70</div>
          <div class="formula-line">70 × 4 = 280</div>
          <div class="formula-line">280 - 5 = 275</div>
        </div>
      `,
    },
    {
      key: 'triplet-columns',
      series: [1, 9, 5, 18, 26, 5, 35, 43, 5],
      answer: '52',
      options: ['52', '87', '55.5', '91', 'None of the answers is correct.'],
      explanation: 'Read the series in three interleaved columns. First column is 1, 18, 35, ... and increases by 17 each time. So the next number is 52.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Column 1: 1, 18, 35, ...</div>
          <div class="formula-line">Each step in that column adds 17.</div>
          <div class="formula-line">35 + 17 = 52</div>
        </div>
      `,
    },
    {
      key: 'descending-cubes',
      series: [216, 125, 64, 27, 8],
      answer: '1',
      options: ['4', '11', '1', '0', 'None of the answers is correct.'],
      explanation: 'These are descending cubes: 6^3, 5^3, 4^3, 3^3, 2^3. The next value is 1^3 = 1.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">216 = 6³</div>
          <div class="formula-line">125 = 5³</div>
          <div class="formula-line">64 = 4³</div>
          <div class="formula-line">27 = 3³</div>
          <div class="formula-line">8 = 2³</div>
          <div class="formula-line">Next: 1³ = 1</div>
        </div>
      `,
    }
  ]
  const scenario = pick(scenarios)
  const sequenceHtml = scenario.series.map(value => `<div class="diagram-cell" style="min-height:54px;font-size:28px;">${value}</div>`).join('')
  const options = shuffle([...scenario.options])

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    familyKey: 'logical-number-series',
    variantKey: `number-series-${scenario.key}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which number logically continues the number series?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Number series</strong></div>
        <div class="diagram-grid" style="grid-template-columns:repeat(${scenario.series.length + 1}, 1fr);max-width:760px;">
          ${sequenceHtml}
          <div class="diagram-cell missing" style="min-height:54px;font-size:28px;">?</div>
        </div>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For number-series questions, test alternating operations, interleaved sub-series, powers, and repeated increments before assuming one single linear rule.',
  }
}

function logicalSurfaceCount(difficulty) {
  const scenarios = [
    {
      key: 'square-tube',
      answer: '10',
      options: ['8', '9', '10', '12', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: squareTubeSvg(),
      explanation: 'This is a square tube, not a solid block. Count the 4 outer side faces, the 4 inner tunnel faces, and the 2 ring-shaped end faces. That gives 10 faces in total.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Outer side faces = 4</div>
          <div class="formula-line">Inner tunnel faces = 4</div>
          <div class="formula-line">End faces = 2</div>
          <div class="formula-line">Total = 4 + 4 + 2 = 10 faces</div>
        </div>
      `,
    },
    {
      key: 'triangle-prism',
      answer: '5',
      options: ['4', '5', '6', '7', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('96,132 128,72 162,132', 18, -30),
      explanation: 'The front outline is a triangle. A triangular prism has 3 side faces and 2 end faces, so it has 5 faces in total.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 3</div>
          <div class="formula-line">Prism faces = 3 side faces + 2 end faces</div>
          <div class="formula-line">Total = 5 faces</div>
        </div>
      `,
    },
    {
      key: 'trapezoid-prism',
      answer: '6',
      options: ['5', '6', '7', '8', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('78,126 100,80 156,80 178,126', -30, -14),
      explanation: 'The front outline is a 4-sided shape. A prism with a 4-sided base has 4 side faces plus 2 end faces, so it has 6 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 4</div>
          <div class="formula-line">Prism faces = 4 side faces + 2 end faces</div>
          <div class="formula-line">Total = 6 faces</div>
        </div>
      `,
    },
    {
      key: 'house-prism',
      answer: '7',
      options: ['6', '7', '8', '9', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('70,130 70,88 102,56 150,56 182,88 182,130', -18, -28),
      explanation: 'The front face is a pentagon. A prism with a 5-sided base has 5 side faces plus 2 end faces, so it has 7 faces in total.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Base shape: pentagon = 5 sides</div>
          <div class="formula-line">Prism faces = 5 rectangular side faces + 2 end faces</div>
          <div class="formula-line">Total = 7 faces</div>
        </div>
      `,
    },
    {
      key: 'notched-prism',
      answer: '9',
      options: ['8', '9', '10', '11', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('72,126 72,84 100,58 172,58 172,96 146,96 146,126', 30, -12),
      explanation: 'The front outline has 7 edges. A prism based on a 7-sided outline has 7 side faces and 2 end faces, so the body has 9 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 7</div>
          <div class="formula-line">Prism faces = 7 side faces + 2 end faces</div>
          <div class="formula-line">Total = 9 faces</div>
        </div>
      `,
    },
    {
      key: 'hex-prism-pyramid',
      answer: '13',
      options: ['11', '12', '13', '14', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismPyramidSvg(6),
      explanation: 'Break the solid into two joined parts: a hexagonal prism on top and a hexagonal pyramid below. The join is internal, so count only the top hexagon, 6 prism side faces, and 6 triangular pyramid faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Top face = 1 hexagon</div>
          <div class="formula-line">Prism side faces = 6</div>
          <div class="formula-line">Pyramid side faces = 6</div>
          <div class="formula-line">Shared hexagonal join is internal, so do not count it</div>
          <div class="formula-line">Total = 1 + 6 + 6 = 13 faces</div>
        </div>
      `,
    },
    {
      key: 'hex-prism',
      answer: '8',
      options: ['7', '8', '9', '10', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('86,120 66,92 86,64 138,64 158,92 138,120', -28, -12),
      explanation: 'The base is a hexagon. A hexagonal prism has 6 rectangular side faces and 2 hexagonal end faces, so it has 8 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Base shape: hexagon = 6 sides</div>
          <div class="formula-line">Prism faces = 6 side faces + 2 end faces</div>
          <div class="formula-line">Total = 8 faces</div>
        </div>
      `,
    },
    {
      key: 'slanted-hex-prism',
      answer: '8',
      options: ['7', '8', '9', '10', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('78,118 100,78 152,78 174,98 152,138 100,138', 14, -30),
      explanation: 'The front outline has 6 edges. A prism with a 6-sided base has 6 side faces and 2 end faces, giving 8 faces in total.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 6</div>
          <div class="formula-line">Prism faces = 6 side faces + 2 end faces</div>
          <div class="formula-line">Total = 8 faces</div>
        </div>
      `,
    },
    {
      key: 'arrow-prism',
      answer: '9',
      options: ['7', '8', '9', '10', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('74,110 112,76 112,92 164,92 164,128 112,128 112,144', -26, -16),
      explanation: 'The front outline has 7 edges. A prism based on a 7-sided outline has 7 side faces and 2 end faces, so the solid has 9 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 7</div>
          <div class="formula-line">Prism faces = 7 side faces + 2 end faces</div>
          <div class="formula-line">Total = 9 faces</div>
        </div>
      `,
    },
    {
      key: 'concave-step-prism',
      answer: '10',
      options: ['8', '9', '10', '11', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('78,138 78,82 110,82 110,56 158,56 158,104 132,104 132,138', 32, -10),
      explanation: 'The front outline has 8 edges. A prism built from an 8-sided outline has 8 side faces and 2 end faces, so the solid has 10 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 8</div>
          <div class="formula-line">Prism faces = 8 side faces + 2 end faces</div>
          <div class="formula-line">Total = 10 faces</div>
        </div>
      `,
    },
    {
      key: 'octagon-prism',
      answer: '10',
      options: ['7', '8', '9', '10', 'None of the answers is correct.'],
      title: 'Spatial understanding',
      svg: prismSvg('88,126 68,106 68,82 88,62 144,62 164,82 164,106 144,126', -20, -18),
      explanation: 'The front outline has 8 edges. A prism with an 8-sided base has 8 side faces plus 2 end faces, so it has 10 faces.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Front outline sides = 8</div>
          <div class="formula-line">Prism faces = 8 side faces + 2 end faces</div>
          <div class="formula-line">Total = 10 faces</div>
        </div>
      `,
    },
  ]
  const scenario = pick(scenarios)
  const options = shuffle([...scenario.options])

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    familyKey: 'logical-surface-count',
    variantKey: `surface-count-${scenario.key}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'How many faces does the solid shown have?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>${scenario.title}</strong></div>
        <svg viewBox="0 0 260 210" width="100%" height="220" style="display:block;margin-top:8px;max-width:320px;margin-left:auto;margin-right:auto;">
          ${scenario.svg}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For spatial face-count tasks, first identify whether the body is a prism, a hollow tube, or a composite solid. Count outer faces systematically, add any interior tunnel faces, and do not count shared internal joins.',
  }
}

function logicalGapChallenge(difficulty) {
  const size = difficulty === 'easy' ? 4 : pick(difficulty === 'medium' ? [4, 5] : [5, 5, 4])
  const symbols = shuffle([...GAP_SYMBOL_SET]).slice(0, size)
  const indexes = Array.from({ length: size }, (_, index) => index)
  const rowOrder = shuffle([...indexes])
  const colOrder = shuffle([...indexes])
  const transpose = Math.random() < 0.5
  const mirror = Math.random() < 0.5

  let board = rowOrder.map(row =>
    colOrder.map(col => symbols[(row + col) % size]),
  )

  if (transpose) {
    board = board[0].map((_, columnIndex) => board.map(row => row[columnIndex]))
  }
  if (mirror) {
    board = board.map(row => [...row].reverse())
  }

  const questionRow = randInt(0, size - 1)
  const questionCol = randInt(0, size - 1)
  const answerSymbol = board[questionRow][questionCol]

  const revealed = new Set()
  for (let row = 0; row < size; row++) {
    if (row !== questionRow) revealed.add(`${row}:${questionCol}`)
  }
  for (let col = 0; col < size; col++) {
    if (col !== questionCol) revealed.add(`${questionRow}:${col}`)
  }

  const extraCells = shuffle(
    indexes.flatMap(row => indexes.map(col => ({ row, col })))
      .filter(cell => cell.row !== questionRow || cell.col !== questionCol),
  )
  const extraCount = size === 4 ? randInt(3, 4) : randInt(5, 7)
  for (const cell of extraCells) {
    if (revealed.size >= ((size - 1) * 2) + extraCount) break
    revealed.add(`${cell.row}:${cell.col}`)
  }

  const boardHtml = renderGapBoard({
    size,
    board,
    revealed,
    questionRow,
    questionCol,
    title: 'Gap challenge',
  })
  const options = shuffle([...symbols])
  const correctIndex = options.findIndex(symbol => symbol.key === answerSymbol.key)

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    variantKey: `gap-challenge-${size}-${symbols.map(symbol => symbol.key).join('-')}-${questionRow}-${questionCol}-${transpose ? 't' : 'n'}-${mirror ? 'm' : 'n'}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which symbol belongs in the missing cell?',
    visualHtml: boardHtml,
    options: options.map(symbol => ({
      html: renderGapSymbol(symbol, 34),
      text: symbol.label,
      plain: symbol.label,
    })),
    correctIndex,
    explanation: `Each row and each column must contain each symbol exactly once. Check the missing row and column together: the only symbol that fits both is the ${answerSymbol.label}.`,
    pattern: 'For gap-challenge grids, scan the missing row and missing column first. The correct symbol is the one that satisfies both row and column uniqueness.',
    translations: {
      de: {
        prompt: 'Welches Symbol gehoert in das fehlende Feld?',
        visualHtml: renderGapBoard({
          size,
          board,
          revealed,
          questionRow,
          questionCol,
          title: 'Lueckenmuster',
        }),
        options: options.map(symbol => ({
          html: renderGapSymbol(symbol, 34),
          text: symbol.deLabel,
          plain: symbol.deLabel,
        })),
        explanation: `In jeder Zeile und jeder Spalte darf jedes Symbol genau einmal vorkommen. Wenn Sie die fehlende Zeile und die fehlende Spalte gemeinsam pruefen, passt nur ${answerSymbol.deLabel}.`,
        pattern: 'Pruefen Sie bei solchen Rasteraufgaben zuerst die fehlende Zeile und die fehlende Spalte. Das richtige Symbol muss beide Bedingungen gleichzeitig erfuellen.',
      },
    },
  }
}

function prismSvg(frontPoints, dx, dy) {
  const points = frontPoints.split(' ').map(point => point.split(',').map(Number))
  const shifted = points.map(([x, y]) => [x + dx, y + dy])
  const allX = [...points.map(([x]) => x), ...shifted.map(([x]) => x)]
  const allY = [...points.map(([, y]) => y), ...shifted.map(([, y]) => y)]
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const minY = Math.min(...allY)
  const maxY = Math.max(...allY)
  const offsetX = 130 - ((minX + maxX) / 2)
  const offsetY = 102 - ((minY + maxY) / 2)
  const frontPointsShifted = points.map(([x, y]) => [x + offsetX, y + offsetY])
  const backPointsShifted = shifted.map(([x, y]) => [x + offsetX, y + offsetY])
  const backPoints = backPointsShifted.map(([x, y]) => `${x},${y}`).join(' ')
  const front = frontPointsShifted.map(([x, y]) => `${x},${y}`).join(' ')
  const connectors = frontPointsShifted.map(([x, y], index) => `<line x1="${x}" y1="${y}" x2="${backPointsShifted[index][0]}" y2="${backPointsShifted[index][1]}" stroke="#64748b" stroke-width="2"></line>`).join('')
  return `
    <polygon points="${backPoints}" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>
    ${connectors}
    <polygon points="${front}" fill="#e5e7eb" stroke="#111827" stroke-width="2.2"></polygon>
  `
}

function renderGapBoard({ size, board, revealed, questionRow, questionCol, title }) {
  const cells = board.map((row, rowIndex) => row.map((symbol, colIndex) => {
    const key = `${rowIndex}:${colIndex}`
    if (rowIndex === questionRow && colIndex === questionCol) {
      return `<div class="diagram-cell missing" style="aspect-ratio:auto;height:56px;font-size:28px;font-weight:800;">?</div>`
    }
    if (!revealed.has(key)) {
      return `<div class="diagram-cell" style="aspect-ratio:auto;height:56px;background:#f8fafc;border-color:#e2e8f0;"></div>`
    }
    return `<div class="diagram-cell" style="aspect-ratio:auto;height:56px;">${renderGapSymbol(symbol, 34)}</div>`
  }).join('')).join('')

  return `
    <div class="chart">
      <div class="center"><strong>${title}</strong></div>
      <div style="display:grid;grid-template-columns:repeat(${size}, 56px);gap:10px;justify-content:center;margin-top:14px;">
        ${cells}
      </div>
    </div>
  `
}

function renderGapSymbol(symbol, size = 32) {
  const viewBox = 100
  if (symbol.key === 'circle') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="${symbol.color}"></circle></svg>`
  }
  if (symbol.key === 'square') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true"><rect x="20" y="20" width="60" height="60" rx="6" fill="${symbol.color}"></rect></svg>`
  }
  if (symbol.key === 'triangle') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true"><polygon points="50,16 84,78 16,78" fill="${symbol.color}"></polygon></svg>`
  }
  if (symbol.key === 'star') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true"><polygon points="50,12 60,36 86,38 66,54 72,80 50,65 28,80 34,54 14,38 40,36" fill="${symbol.color}"></polygon></svg>`
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true"><rect x="38" y="16" width="24" height="68" rx="5" fill="${symbol.color}"></rect><rect x="16" y="38" width="68" height="24" rx="5" fill="${symbol.color}"></rect></svg>`
}

function buildCountFillMatrixScenario(difficulty) {
  const rowShapes = shuffle(['triangle', 'circle', 'square', 'diamond']).slice(0, 3)
  const countSeries = pick(
    difficulty === 'easy'
      ? [[1, 2, 3], [2, 3, 4]]
      : [[1, 2, 3], [2, 3, 4], [2, 4, 6]]
  )
  const fillMode = pick(['checker', 'column'])
  const missingIndex = pick(difficulty === 'easy' ? [5, 7, 8] : [4, 5, 6, 7, 8])
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    return {
      shape: rowShapes[row],
      count: countSeries[col],
      fill: fillMode === 'checker'
        ? ((row + col) % 2 === 0 ? 'solid' : 'outline')
        : (col % 2 === 0 ? 'solid' : 'outline'),
      rotation: 0,
    }
  })
  const correctCell = cells[missingIndex]
  const distractors = dedupeMatrixCells([
    { ...correctCell, fill: correctCell.fill === 'solid' ? 'outline' : 'solid' },
    { ...correctCell, count: countSeries[(missingIndex + 1) % 3] },
    { ...correctCell, shape: rowShapes[(Math.floor(missingIndex / 3) + 1) % 3] },
    { ...correctCell, count: Math.max(1, correctCell.count + (correctCell.count > countSeries[0] ? -1 : 1)) },
  ], matrixCellKey).slice(0, difficulty === 'easy' ? 3 : 4)
  const options = shuffle([correctCell, ...distractors]).slice(0, difficulty === 'easy' ? 4 : 5)
  const correctIndex = options.findIndex(option => matrixCellKey(option) === matrixCellKey(correctCell))

  return {
    variantKey: `matrix-count-fill-${rowShapes.join('-')}-${countSeries.join('-')}-${fillMode}-${missingIndex}`,
    visualHtml: renderMatrixBoard({
      title: 'Matrix completion',
      cells,
      missingIndex,
    }),
    options: options.map((cell, index) => ({
      html: renderMatrixOption(cell),
      text: `Option ${index + 1}`,
      plain: describeMatrixCell(cell),
    })),
    correctIndex,
    explanation: `Each row keeps the same shape family, each column changes the number of symbols to ${countSeries.join(', ')}, and the fill style follows a ${fillMode === 'checker' ? 'checkerboard' : 'column-by-column'} pattern.`,
    deExplanation: `Jede Zeile behaelt dieselbe Formfamilie, jede Spalte aendert die Anzahl der Symbole zu ${countSeries.join(', ')}, und die Fuellung folgt einem ${fillMode === 'checker' ? 'Schachbrettmuster' : 'spaltenweisen'} Muster.`,
    pattern: 'For matrix questions, isolate one rule for rows and a different rule for columns. Then check whether fill or shading adds a third rule.',
    dePattern: 'Bei Matrixaufgaben zuerst eine Regel fuer die Zeilen und eine andere fuer die Spalten trennen. Danach pruefen, ob Fuellung oder Schattierung noch eine dritte Regel bilden.',
  }
}

function buildShapeRotationMatrixScenario(difficulty) {
  const rowShapes = shuffle(['triangle', 'bar', 'diamond', 'square']).slice(0, 3)
  const rowCounts = difficulty === 'easy' ? [1, 2, 3] : pick([[1, 2, 3], [2, 3, 4]])
  const rotations = pick([[0, 90, 180], [45, 135, 225]])
  const fills = pick(['row-band', 'checker'])
  const missingIndex = pick(difficulty === 'easy' ? [5, 7, 8] : [4, 5, 6, 7, 8])
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    return {
      shape: rowShapes[row],
      count: rowCounts[row],
      fill: fills === 'row-band'
        ? (row % 2 === 0 ? 'solid' : 'outline')
        : ((row + col) % 2 === 0 ? 'solid' : 'outline'),
      rotation: rotations[col],
    }
  })
  const correctCell = cells[missingIndex]
  const distractors = dedupeMatrixCells([
    { ...correctCell, rotation: rotations[(missingIndex + 1) % 3] },
    { ...correctCell, count: rowCounts[(Math.floor(missingIndex / 3) + 1) % 3] },
    { ...correctCell, shape: rowShapes[(Math.floor(missingIndex / 3) + 1) % 3] },
    { ...correctCell, fill: correctCell.fill === 'solid' ? 'outline' : 'solid' },
  ], matrixCellKey).slice(0, difficulty === 'easy' ? 3 : 4)
  const options = shuffle([correctCell, ...distractors]).slice(0, difficulty === 'easy' ? 4 : 5)
  const correctIndex = options.findIndex(option => matrixCellKey(option) === matrixCellKey(correctCell))

  return {
    variantKey: `matrix-rotation-${rowShapes.join('-')}-${rowCounts.join('-')}-${rotations.join('-')}-${fills}-${missingIndex}`,
    visualHtml: renderMatrixBoard({
      title: 'Matrix completion',
      cells,
      missingIndex,
    }),
    options: options.map((cell, index) => ({
      html: renderMatrixOption(cell),
      text: `Option ${index + 1}`,
      plain: describeMatrixCell(cell),
    })),
    correctIndex,
    explanation: `Each row keeps the same shape and count, while each column rotates the figure through ${rotations.join('°, ')}°. The fill style follows a ${fills === 'row-band' ? 'row-based' : 'checkerboard'} pattern.`,
    deExplanation: `Jede Zeile behaelt dieselbe Form und Anzahl, waehrend jede Spalte die Figur um ${rotations.join('°, ')}° weiterdreht. Die Fuellung folgt einem ${fills === 'row-band' ? 'zeilenbasierten' : 'Schachbrett'} Muster.`,
    pattern: 'Harder matrices often combine two visible rules with a third styling rule. Track shape/count first, then confirm rotation or fill.',
    dePattern: 'Schwierigere Matrizen kombinieren oft zwei sichtbare Regeln mit einer dritten Stilregel. Erst Form und Anzahl verfolgen, dann Rotation oder Fuellung bestaetigen.',
  }
}

function renderMatrixBoard({ title, cells, missingIndex }) {
  return `
    <div class="chart">
      <div class="center"><strong>${title}</strong></div>
      <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);max-width:700px;margin-left:auto;margin-right:auto;">
        ${cells.map((cell, index) => (
          index === missingIndex
            ? '<div class="diagram-cell missing" style="min-height:150px;font-size:32px;">?</div>'
            : `<div class="diagram-cell" style="min-height:150px;">${renderMatrixCell(cell)}</div>`
        )).join('')}
      </div>
    </div>
  `
}

function renderMatrixCell(cell) {
  return `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;">
      ${renderReasoningShapeRow(cell, 26)}
    </div>
  `
}

function renderMatrixOption(cell) {
  return `
    <div style="display:flex;align-items:center;justify-content:center;height:52px;">
      ${renderReasoningShapeRow(cell, 18)}
    </div>
  `
}

function renderReasoningShapeRow(cell, size) {
  return `
    <div style="display:flex;gap:${Math.max(6, Math.round(size * 0.22))}px;align-items:center;justify-content:center;flex-wrap:wrap;max-width:100%;">
      ${Array.from({ length: cell.count }, () => renderReasoningShape(cell.shape, {
        size,
        fill: cell.fill,
        rotation: cell.rotation,
      })).join('')}
    </div>
  `
}

function renderReasoningShape(shape, { size = 20, fill = 'solid', rotation = 0 }) {
  const stroke = '#0f172a'
  const solidFill = fill === 'solid' ? '#0f172a' : '#ffffff'
  if (shape === 'circle') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(${rotation}deg);"><circle cx="50" cy="50" r="30" fill="${solidFill}" stroke="${stroke}" stroke-width="8"></circle></svg>`
  }
  if (shape === 'square') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(${rotation}deg);"><rect x="22" y="22" width="56" height="56" fill="${solidFill}" stroke="${stroke}" stroke-width="8"></rect></svg>`
  }
  if (shape === 'diamond') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(${rotation}deg);"><polygon points="50,14 86,50 50,86 14,50" fill="${solidFill}" stroke="${stroke}" stroke-width="8"></polygon></svg>`
  }
  if (shape === 'bar') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(${rotation}deg);"><rect x="20" y="38" width="60" height="24" rx="6" fill="${solidFill}" stroke="${stroke}" stroke-width="8"></rect></svg>`
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="transform:rotate(${rotation}deg);"><polygon points="50,16 84,80 16,80" fill="${solidFill}" stroke="${stroke}" stroke-width="8"></polygon></svg>`
}

function describeMatrixCell(cell) {
  return `${cell.count} ${cell.fill === 'solid' ? 'solid' : 'outline'} ${cell.shape}${cell.count > 1 ? 's' : ''}${cell.rotation ? ` rotated ${cell.rotation} degrees` : ''}`
}

function matrixCellKey(cell) {
  return `${cell.shape}|${cell.count}|${cell.fill}|${cell.rotation}`
}

function dedupeMatrixCells(items, keyFn) {
  const seen = new Set()
  return items.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function buildSymmetryPattern(axis, gridSize, salt = 0) {
  const points = []
  const targetCount = randInt(gridSize + 1, gridSize + 3)
  const seen = new Set()

  while (points.length < targetCount) {
    const row = randInt(0, gridSize - 1)
    const col = randInt(0, gridSize - 1)
    const key = `${row}:${col}`
    if (seen.has(key)) continue
    seen.add(key)
    points.push([row, col])
  }

  if (patternKey(points) === patternKey(mirrorPatternPoints(points, axis, gridSize))) {
    const row = (salt + 1) % gridSize
    const col = axis === 'vertical' ? 0 : ((salt + 2) % gridSize)
    points.push([row, col])
  }

  return normalizePattern(points, gridSize)
}

function mirrorPatternPoints(points, axis, gridSize) {
  return normalizePattern(points.map(([row, col]) => (
    axis === 'vertical'
      ? [row, (gridSize - 1) - col]
      : [(gridSize - 1) - row, col]
  )), gridSize)
}

function normalizePattern(points, gridSize) {
  const seen = new Set()
  return points
    .filter(([row, col]) => row >= 0 && row < gridSize && col >= 0 && col < gridSize)
    .filter(([row, col]) => {
      const key = `${row}:${col}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((left, right) => (left[0] - right[0]) || (left[1] - right[1]))
}

function rotatePatternPoints(points, gridSize) {
  return normalizePattern(points.map(([row, col]) => [col, (gridSize - 1) - row]), gridSize)
}

function mutatePatternPoints(points, gridSize) {
  const mutated = [...points.map(([row, col]) => [row, col])]
  const index = randInt(0, mutated.length - 1)
  mutated[index] = [mutated[index][0], Math.max(0, Math.min(gridSize - 1, mutated[index][1] + (mutated[index][1] === 0 ? 1 : -1)))]
  return normalizePattern(mutated, gridSize)
}

function patternKey(points) {
  return points.map(([row, col]) => `${row}:${col}`).join('|')
}

function buildSymmetryDistractors({ answerPattern, sourcePattern, axis, gridSize }) {
  return dedupeMatrixCells([
    sourcePattern,
    mirrorPatternPoints(answerPattern, axis, gridSize),
    mirrorPatternPoints(answerPattern, axis === 'vertical' ? 'horizontal' : 'vertical', gridSize),
    rotatePatternPoints(answerPattern, gridSize),
    mutatePatternPoints(answerPattern, gridSize),
  ], patternKey).filter(pattern => patternKey(pattern) !== patternKey(answerPattern)).slice(0, 3)
}

function renderSymmetryChallenge({ axis, gridSize, missingRow, missingSide, rows, title }) {
  const axisHtml = axis === 'vertical'
    ? '<div style="width:4px;height:56px;background:#7c9bc4;border-radius:999px;"></div>'
    : '<div style="width:56px;height:4px;background:#7c9bc4;border-radius:999px;"></div>'

  return `
    <div class="chart">
      <div class="center"><strong>${title}</strong></div>
      <div style="display:grid;grid-template-columns:minmax(110px, 1fr) 72px minmax(110px, 1fr);gap:14px;align-items:center;max-width:520px;margin:16px auto 0;">
        ${rows.map((row, index) => `
          <div class="diagram-cell" style="min-height:92px;">${index === missingRow && missingSide === 'left' ? '<div class="diagram-cell missing" style="min-height:72px;font-size:28px;">?</div>' : renderPatternGrid(row.source, gridSize, 12)}</div>
          <div class="diagram-cell" style="min-height:92px;background:#f8fafc;border-style:dashed;">${axisHtml}</div>
          <div class="diagram-cell" style="min-height:92px;">${index === missingRow && missingSide === 'right' ? '<div class="diagram-cell missing" style="min-height:72px;font-size:28px;">?</div>' : renderPatternGrid(row.mirrored, gridSize, 12)}</div>
        `).join('')}
      </div>
      <div class="small center mt8">Mirror each row across the ${axis} axis and use the completed rows as examples.</div>
    </div>
  `
}

function renderPatternGrid(points, gridSize, cellSize = 12) {
  const active = new Set(points.map(([row, col]) => `${row}:${col}`))
  return `
    <div style="display:grid;grid-template-columns:repeat(${gridSize}, ${cellSize}px);gap:4px;justify-content:center;">
      ${Array.from({ length: gridSize * gridSize }, (_, index) => {
        const row = Math.floor(index / gridSize)
        const col = index % gridSize
        const isActive = active.has(`${row}:${col}`)
        return `<span style="width:${cellSize}px;height:${cellSize}px;border-radius:3px;border:1px solid ${isActive ? '#0f172a' : '#d7dee8'};background:${isActive ? '#0f172a' : '#ffffff'};display:block;"></span>`
      }).join('')}
    </div>
  `
}

function squareTubeSvg() {
  const outerFront = '72,68 144,68 144,140 72,140'
  const outerBack = '98,50 170,50 170,122 98,122'
  const innerFront = '94,90 122,90 122,118 94,118'
  const innerBack = '120,72 148,72 148,100 120,100'

  return `
    <polygon points="${outerBack}" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>
    <polygon points="${innerBack}" fill="#ffffff" stroke="#64748b" stroke-width="2"></polygon>

    <line x1="72" y1="68" x2="98" y2="50" stroke="#64748b" stroke-width="2"></line>
    <line x1="144" y1="68" x2="170" y2="50" stroke="#64748b" stroke-width="2"></line>
    <line x1="144" y1="140" x2="170" y2="122" stroke="#64748b" stroke-width="2"></line>
    <line x1="72" y1="140" x2="98" y2="122" stroke="#64748b" stroke-width="2"></line>

    <line x1="94" y1="90" x2="120" y2="72" stroke="#64748b" stroke-width="2"></line>
    <line x1="122" y1="90" x2="148" y2="72" stroke="#64748b" stroke-width="2"></line>
    <line x1="122" y1="118" x2="148" y2="100" stroke="#64748b" stroke-width="2"></line>
    <line x1="94" y1="118" x2="120" y2="100" stroke="#64748b" stroke-width="2"></line>

    <polygon points="${outerFront}" fill="#e5e7eb" stroke="#111827" stroke-width="2.2"></polygon>
    <polygon points="${innerFront}" fill="#ffffff" stroke="#111827" stroke-width="2.2"></polygon>
  `
}

function prismPyramidSvg(sideCount) {
  if (sideCount !== 6) return ''

  return `
    <polygon points="96,58 114,40 146,40 164,58 150,78 110,78" fill="#e5e7eb" stroke="#111827" stroke-width="2.2"></polygon>

    <polygon points="96,58 110,78 110,108 94,88" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>
    <polygon points="164,58 150,78 150,108 166,88" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>
    <polygon points="110,78 150,78 150,108 110,108" fill="#eef2f7" stroke="#64748b" stroke-width="2"></polygon>

    <polygon points="94,88 110,108 130,174" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>
    <polygon points="110,108 150,108 130,174" fill="#ffffff" stroke="#64748b" stroke-width="2"></polygon>
    <polygon points="150,108 166,88 130,174" fill="#f8fafc" stroke="#64748b" stroke-width="2"></polygon>

  `
}

function regularPolygonPoints(cx, cy, rx, ry, sides, rotation = 0) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / sides
    return [
      Math.round((cx + rx * Math.cos(angle)) * 10) / 10,
      Math.round((cy + ry * Math.sin(angle)) * 10) / 10,
    ]
  })
}
function buildPermutationCodes() {
  const digits = ['1', '2', '3', '4']
  const results = []

  const walk = (prefix, remaining) => {
    if (!remaining.length) {
      const code = prefix.join('')
      if (code !== '1234') results.push(code)
      return
    }

    remaining.forEach((digit, index) => {
      walk(
        [...prefix, digit],
        remaining.filter((_, remainingIndex) => remainingIndex !== index),
      )
    })
  }

  walk([], digits)
  return results
}

function applySwitchCode(sequence, code) {
  return code.split('').map(digit => sequence[Number(digit) - 1])
}

function sameSwitchSequence(left, right) {
  return left.every((item, index) => item.key === right[index]?.key)
}

function buildSwitchChallengeHtml({ initial, stages, target, stageCount }) {
  const title = stageCount === 1 ? 'Code transform' : 'Code switch chain'

  return `
    <div class="chart switch-chart">
      <div class="center"><strong>${title}</strong></div>
      <div class="switch-challenge">
        ${renderSwitchSymbolRow(initial)}
        <div class="switch-stage-stack">
          <div class="switch-funnel switch-funnel-top"></div>
          ${stages.map((stage, index) => `
            ${index === 0 ? '' : '<div class="switch-connector"></div>'}
            <div class="switch-code ${stage.kind === 'missing' ? 'switch-code--missing' : ''}">
              ${stage.kind === 'missing' ? '?' : stage.code}
            </div>
          `).join('')}
          <div class="switch-funnel switch-funnel-bottom"></div>
        </div>
        ${renderSwitchSymbolRow(target)}
      </div>
    </div>
  `
}

function buildSwitchExplanationHtml({ initial, stages, answerCode, target }) {
  let current = initial
  const steps = stages.map((stage, index) => {
    const code = stage.kind === 'missing' ? answerCode : stage.code
    current = applySwitchCode(current, code)
    return `
      <div class="formula-line">
        Stage ${index + 1}: ${code} means take positions ${code.split('').join(', ')}.
        Result: ${formatSwitchSequence(current)}
      </div>
    `
  }).join('')

  return `
    <div><strong>How the code works</strong></div>
    <div class="formula-block">
      <div class="formula-line">2314 means: take the 2nd symbol first, then 3rd, then 1st, then 4th.</div>
      <div class="formula-line">Start order: ${formatSwitchSequence(initial)}</div>
      ${steps}
      <div class="formula-line">Target order reached: ${formatSwitchSequence(target)}</div>
    </div>
  `
}

function formatSwitchSequence(sequence) {
  return sequence.map(item => item.label).join(' -> ')
}

function renderSwitchSymbolRow(sequence) {
  return `
    <div class="switch-row">
      ${sequence.map(renderSwitchSymbol).join('')}
    </div>
  `
}

function renderSwitchSymbol(symbol) {
  return `
    <div class="switch-symbol-cell">
      <span class="switch-symbol switch-symbol--${symbol.shape}" style="--switch-color:${symbol.color};"></span>
    </div>
  `
}

export function generateConcentration(difficulty) {
  const question = generateErrorCheck(difficulty)
  return {
    ...question,
    topic: 'concentration',
    topicLabel: 'Concentration',
    timer: getTimerSeconds('concentration', difficulty),
    prompt: 'Identify the mismatching line as quickly and accurately as possible.',
  }
}

export function generatePlanning(difficulty) {
  const family = pick(['timeline', 'timeline', 'process-flow', 'process-flow'])
  if (family === 'process-flow') return planningProcessFlow(difficulty)
  return planningTimeline(difficulty)
}

function planningTimeline(difficulty) {
  const tasks = ['Assembly', 'Inspection', 'Packing', 'Dispatch']
  const durations = tasks.map(() => randInt(20, 55))
  const slotStart = pick([480, 510, 540])
  const breakStart = pick([600, 615, 630])
  const idx = randInt(0, tasks.length - 1)
  const finish = slotStart + durations.slice(0, idx + 1).reduce((sum, duration) => sum + duration, 0)
  const finishDisplay = `${String(Math.floor(finish / 60)).padStart(2, '0')}:${String(finish % 60).padStart(2, '0')}`
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Shift plan</strong></div>
      <div class="review-list">
        <div class="review-item">Start time: ${String(Math.floor(slotStart / 60)).padStart(2, '0')}:${String(slotStart % 60).padStart(2, '0')}</div>
        ${tasks.map((task, index) => `<div class="review-item">${task}: ${durations[index]} minutes</div>`).join('')}
        <div class="review-item">Break starts at ${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}</div>
      </div>
    </div>
  `
  const options = shuffle([
    finishDisplay,
    `${String(Math.floor((finish + 15) / 60)).padStart(2, '0')}:${String((finish + 15) % 60).padStart(2, '0')}`,
    `${String(Math.floor((finish - 10) / 60)).padStart(2, '0')}:${String((finish - 10) % 60).padStart(2, '0')}`,
    `${String(Math.floor(breakStart / 60)).padStart(2, '0')}:${String(breakStart % 60).padStart(2, '0')}`,
  ].filter((value, index, array) => array.indexOf(value) === index))

  return {
    topic: 'planning',
    topicLabel: 'Planning',
    variantKey: 'planning-timeline',
    timer: getTimerSeconds('planning', difficulty),
    prompt: `At what time should ${tasks[idx]} finish if tasks are done in the listed order?`,
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(finishDisplay),
    explanation: `Add the durations from the shift start up to ${tasks[idx]}. That gives a finish time of ${finishDisplay}.`,
    pattern: 'For planning questions, build the timeline in sequence and ignore unrelated times unless the prompt asks for them.',
  }
}

function planningProcessFlow(difficulty) {
  const scenarios = [
    {
      key: 'step-1',
      prompt: 'Which answer sensibly replaces number 1 in the flowchart?',
      options: ['Was the customer reached?', 'Enter data', 'Contact customer', 'Delete data', 'Reject application'],
      answer: 'Enter data',
      explanation: 'After the application is received, the next sensible processing step is to enter the data before checking whether the data are complete.'
    },
    {
      key: 'step-2',
      prompt: 'Which answer sensibly replaces number 2 in the flowchart?',
      options: ['Application received?', 'Reject application?', 'Was the customer reached?', 'Could the data be completed?', 'Check data'],
      answer: 'Could the data be completed?',
      explanation: 'After trying to complete the missing data, the next decision is whether the data could in fact be completed. If yes, the record is uploaded; if no, the customer is contacted.'
    },
    {
      key: 'step-3',
      prompt: 'Which answer sensibly replaces number 3 in the flowchart?',
      options: ['Reject customer', 'Restart data entry', 'Put application on hold?', 'Enter data?', 'Was customer contact successful?'],
      answer: 'Was customer contact successful?',
      explanation: 'After the customer is contacted, the next decision is whether the contact was successful. If yes, the data can be uploaded. If no, the application is put on hold.'
    },
    {
      key: 'unreachable-customer',
      prompt: 'What happens if a record is incomplete and the customer cannot be reached?',
      options: [
        'The incomplete record is uploaded to the server.',
        'The data are deleted.',
        'The application is put on hold first.',
        'The data are shown to a supervisor for approval.',
        'Nothing else happens until the customer calls back.'
      ],
      answer: 'The application is put on hold first.',
      explanation: 'Incomplete records first go to the data-completion step. If completion is not possible, the customer is contacted. If that contact is not successful, the flow leads to putting the application on hold.'
    },
    {
      key: 'which-data-uploaded',
      prompt: 'Which data are transferred to the server?',
      options: [
        'All records',
        'Only complete records',
        'Incomplete records as well, but with a note',
        'Incomplete records that are still usable',
        'Only data confirmed by the customer by phone'
      ],
      answer: 'Only complete records',
      explanation: 'Records are transferred directly when the data are complete, or after the missing data have been completed successfully. In both cases, only complete records reach the server upload step.'
    }
  ]
  const scenario = pick(scenarios)
  const options = shuffle([...scenario.options])

  return {
    topic: 'planning',
    topicLabel: 'Planning',
    variantKey: `planning-process-flow-${scenario.key}`,
    timer: getTimerSeconds('planning', difficulty),
    prompt: scenario.prompt,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Data capture flowchart</strong></div>
        <svg viewBox="0 0 560 500" width="100%" height="400" style="display:block;margin-top:8px;">
          ${planningFlowchartSvg()}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    pattern: 'Read the flowchart in direction order. For each decision node, follow the yes/no branches and test where the process can actually continue.'
  }
}

function planningFlowchartSvg() {
  return `
    <rect x="245" y="10" width="70" height="34" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="280" y="32" text-anchor="middle" font-size="14" font-weight="600" fill="#111827">Start</text>

    <line x1="280" y1="44" x2="280" y2="70" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="276,66 284,66 280,74" fill="#475569"></polygon>

    <path d="M 240 74 L 320 74 L 320 112 Q 280 126 240 112 Z" fill="#f8fafc" stroke="#475569" stroke-width="2"></path>
    <text x="280" y="96" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">Application</text>
    <text x="280" y="111" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">received</text>

    <line x1="280" y1="124" x2="280" y2="148" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="276,144 284,144 280,152" fill="#475569"></polygon>

    <polygon points="236,152 324,152 308,194 220,194" fill="#f8fafc" stroke="#475569" stroke-width="2"></polygon>
    <circle cx="272" cy="173" r="16" fill="#111827"></circle>
    <text x="272" y="179" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">1</text>

    <line x1="220" y1="173" x2="148" y2="173" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="152,169 152,177 144,173" fill="#475569"></polygon>

    <polygon points="96,132 144,173 96,214 48,173" fill="#f8fafc" stroke="#475569" stroke-width="2"></polygon>
    <text x="96" y="167" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">Data</text>
    <text x="96" y="182" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">complete?</text>
    <text x="64" y="154" text-anchor="middle" font-size="12" fill="#111827">yes</text>
    <text x="132" y="196" text-anchor="middle" font-size="12" fill="#111827">no</text>

    <line x1="62" y1="206" x2="62" y2="330" stroke="#475569" stroke-width="2.5"></line>
    <line x1="62" y1="330" x2="188" y2="330" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="184,326 184,334 192,330" fill="#475569"></polygon>

    <line x1="130" y1="206" x2="130" y2="224" stroke="#475569" stroke-width="2.5"></line>
    <line x1="130" y1="224" x2="272" y2="224" stroke="#475569" stroke-width="2.5"></line>
    <line x1="272" y1="224" x2="272" y2="232" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="268,228 276,228 272,236" fill="#475569"></polygon>

    <rect x="208" y="236" width="128" height="40" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="272" y="252" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">Complete</text>
    <text x="272" y="268" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">data</text>

    <line x1="272" y1="276" x2="272" y2="292" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="268,288 276,288 272,296" fill="#475569"></polygon>

    <polygon points="272,296 320,337 272,378 224,337" fill="#f8fafc" stroke="#475569" stroke-width="2"></polygon>
    <circle cx="272" cy="337" r="16" fill="#111827"></circle>
    <text x="272" y="343" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">2</text>
    <text x="240" y="318" text-anchor="middle" font-size="12" fill="#111827">yes</text>
    <text x="308" y="318" text-anchor="middle" font-size="12" fill="#111827">no</text>

    <line x1="224" y1="337" x2="192" y2="337" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="196,333 196,341 188,337" fill="#475569"></polygon>

    <line x1="320" y1="337" x2="366" y2="337" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="362,333 362,341 370,337" fill="#475569"></polygon>

    <rect x="370" y="316" width="106" height="42" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="423" y="333" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">Contact</text>
    <text x="423" y="349" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">customer</text>

    <line x1="423" y1="358" x2="423" y2="372" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="419,368 427,368 423,376" fill="#475569"></polygon>

    <polygon points="423,376 471,417 423,458 375,417" fill="#f8fafc" stroke="#475569" stroke-width="2"></polygon>
    <circle cx="423" cy="417" r="16" fill="#111827"></circle>
    <text x="423" y="423" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">3</text>
    <text x="391" y="398" text-anchor="middle" font-size="12" fill="#111827">yes</text>
    <text x="459" y="398" text-anchor="middle" font-size="12" fill="#111827">no</text>

    <line x1="375" y1="417" x2="320" y2="417" stroke="#475569" stroke-width="2.5"></line>
    <line x1="320" y1="417" x2="320" y2="330" stroke="#475569" stroke-width="2.5"></line>
    <line x1="320" y1="330" x2="312" y2="330" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="316,326 316,334 308,330" fill="#475569"></polygon>

    <line x1="471" y1="417" x2="500" y2="417" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="496,413 496,421 504,417" fill="#475569"></polygon>
    <rect x="504" y="396" width="52" height="42" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="530" y="412" text-anchor="middle" font-size="11" font-weight="600" fill="#111827">Put on</text>
    <text x="530" y="427" text-anchor="middle" font-size="11" font-weight="600" fill="#111827">hold</text>

    <rect x="192" y="310" width="116" height="40" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="250" y="326" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">Upload data</text>
    <text x="250" y="342" text-anchor="middle" font-size="13" font-weight="600" fill="#111827">to server</text>

    <rect x="8" y="310" width="124" height="40" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="70" y="326" text-anchor="middle" font-size="12" font-weight="600" fill="#111827">Automatic</text>
    <text x="70" y="341" text-anchor="middle" font-size="12" font-weight="600" fill="#111827">data forwarding</text>

    <line x1="132" y1="330" x2="192" y2="330" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="188,326 188,334 196,330" fill="#475569"></polygon>

    <line x1="250" y1="350" x2="250" y2="382" stroke="#475569" stroke-width="2.5"></line>
    <polygon points="246,378 254,378 250,386" fill="#475569"></polygon>

    <rect x="218" y="386" width="64" height="34" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2"></rect>
    <text x="250" y="407" text-anchor="middle" font-size="14" font-weight="600" fill="#111827">End</text>
  `
}


