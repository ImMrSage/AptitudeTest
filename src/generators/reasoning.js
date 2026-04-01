import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'
import { generateErrorCheck } from './errorCheck'

const LOGICAL_TOPIC_LABEL = 'Abstract / diagrammatic reasoning'
const SWITCH_SYMBOL_SET = [
  { key: 'triangle', label: 'yellow triangle', shape: 'triangle', color: '#f5c542' },
  { key: 'plus', label: 'blue plus', shape: 'plus', color: '#57c5f7' },
  { key: 'square', label: 'red square', shape: 'square', color: '#e1443d' },
  { key: 'circle', label: 'green circle', shape: 'circle', color: '#72b635' },
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
    ? ['symmetry', 'code-switch', 'code-switch']
    : difficulty === 'medium'
    ? ['symmetry', 'code-switch', 'code-switch', 'code-switch']
    : ['symmetry', 'matrix', 'code-switch', 'code-switch', 'code-switch', 'code-switch']
  const type = pick(types)
  const question = type === 'symmetry'
    ? logicalSymmetry(difficulty)
    : type === 'matrix'
    ? logicalMatrix(difficulty)
    : logicalCodeSwitch(difficulty)

  return {
    ...question,
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    variantKey: `logical-${question.variantKey || question.prompt}`,
    timer: getTimerSeconds('logical', difficulty),
    explanation: question.explanation,
    pattern: 'Look for the transformation rule between figures: rotation, position, count, alternation, shading, or coded reordering.',
  }
}

export function logicalSymmetry(difficulty) {
  const axis = pick(['vertical', 'horizontal'])
  const leftShapes = ['&#9698;', '&#9699;', '&#9700;', '&#9701;', '&#9703;', '&#9704;']
  const pairMap = axis === 'vertical'
    ? { '&#9698;': '&#9699;', '&#9699;': '&#9698;', '&#9700;': '&#9701;', '&#9701;': '&#9700;', '&#9703;': '&#9704;', '&#9704;': '&#9703;' }
    : { '&#9698;': '&#9700;', '&#9700;': '&#9698;', '&#9699;': '&#9701;', '&#9701;': '&#9699;', '&#9703;': '&#9703;', '&#9704;': '&#9704;' }
  const seed = pick(leftShapes)
  const answer = pairMap[seed]
  const options = shuffle([answer, ...Object.values(pairMap).filter(value => value !== answer)]).slice(0, 4)
  const correctIndex = options.indexOf(answer)
  const visualHtml = `
    <div class="chart">
      <div class="center"><strong>Symmetry</strong></div>
      <div class="diagram-grid" style="grid-template-columns:repeat(3, 1fr);max-width:340px;margin-left:auto;margin-right:auto;">
        <div class="diagram-cell">${seed}</div>
        <div class="diagram-cell" style="font-size:18px;color:#64748b;">${axis === 'vertical' ? '|' : '&mdash;'}</div>
        <div class="diagram-cell missing">?</div>
      </div>
      <div class="small center mt8">Choose the figure that is the mirror image across the ${axis} axis.</div>
    </div>
  `

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    variantKey: `symmetry-${axis}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which option completes the symmetry rule?',
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex,
    explanation: `Reflect the figure across the ${axis} axis, so the filled corner moves to the mirrored side.`,
    pattern: 'In symmetry questions, keep the shape the same and flip only its orientation across the stated axis.',
  }
}
export function logicalMatrix(difficulty) {
  const rows = [
    ['&#9650;', '&#9650;&#9650;', '&#9650;&#9650;&#9650;'],
    ['&#9679;', '&#9679;&#9679;', '&#9679;&#9679;&#9679;'],
  ]
  const answerBase = pick(['&#9632;', '&#9670;'])
  const thirdRow = [answerBase, answerBase + answerBase, answerBase + answerBase + answerBase]
  const options = shuffle([
    thirdRow[2],
    thirdRow[1],
    answerBase,
    answerBase + answerBase + answerBase + answerBase,
  ])
  const correctIndex = options.indexOf(thirdRow[2])
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
  `

  return {
    topic: 'logical',
    topicLabel: LOGICAL_TOPIC_LABEL,
    variantKey: `matrix-${answerBase}`,
    timer: getTimerSeconds('logical', difficulty),
    prompt: 'Which option completes the 3x3 matrix?',
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex,
    explanation: 'Each row keeps the same shape while each column increases the number of symbols from 1 to 3.',
    pattern: 'For matrix questions, check what changes by row and what changes by column separately.',
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
    timer: getTimerSeconds('planning', difficulty),
    prompt: `At what time should ${tasks[idx]} finish if tasks are done in the listed order?`,
    visualHtml,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(finishDisplay),
    explanation: `Add the durations from the shift start up to ${tasks[idx]}. That gives a finish time of ${finishDisplay}.`,
    pattern: 'For planning questions, build the timeline in sequence and ignore unrelated times unless the prompt asks for them.',
  }
}



