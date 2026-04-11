import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

const DIRECTIONS = ['Clockwise', 'Counterclockwise']

export function generateMechanical(difficulty) {
  const families = [
    'gear',
    'gear-loop',
    'gear-loop',
    'gear-faster',
    'gear-removal',
    'logic-gate',
    'technical-knowledge',
    'technical-knowledge',
    'bar-lock',
    'bar-lock',
    'ramp',
    'lever',
    'pulley',
    'belt-shaft-speed',
    'belt-shaft-speed',
    'parallel-resistance',
    'thermal',
    'rope-slip',
    'rope-slip',
    'bulb-circuit',
    'bulb-circuit',
    'bulb-count',
    'bulb-count',
    'bulb-failure',
    'dynamo-brightness',
    'spring-load',
    'buoyancy-tank',
    'bridge-deflection',
    'convex-mirror',
    'cold-air-door',
    'bucket-leak',
    'candle-jars',
    'door-spring',
    'bolt-cutter',
    'relative-speed',
    'halligan',
    'bulb-bypass',
    'drain-seal',
    'winch-direction',
    'doorstop-slip-compare',
    'reflector-light-area',
    'drum-pitch',
    'pressure-pointer',
    'shelf-bracket',
    'curve-skid',
    'fan-drive-direction',
    'bulb-power',
    'ladder-stability',
    'pulley-rank',
    'balance-heaviest',
    'chain-load',
    'water-overflow-level',
    'wheel-direction-pair'
  ]
  const family = pick(families)
  if (family === 'gear') return mechanicalGear(difficulty)
  if (family === 'gear-loop') return mechanicalGearLoop(difficulty)
  if (family === 'gear-faster') return mechanicalGearFaster(difficulty)
  if (family === 'gear-removal') return mechanicalGearRemoval(difficulty)
  if (family === 'logic-gate') return mechanicalLogicGate(difficulty)
  if (family === 'technical-knowledge') return mechanicalTechnicalKnowledge(difficulty)
  if (family === 'bar-lock') return mechanicalBarLock(difficulty)
  if (family === 'ramp') return mechanicalRamp(difficulty)
  if (family === 'lever') return mechanicalLever(difficulty)
  if (family === 'pulley') return mechanicalPulley(difficulty)
  if (family === 'belt-shaft-speed') return mechanicalBeltShaftSpeed(difficulty)
  if (family === 'parallel-resistance') return mechanicalParallelResistance(difficulty)
  if (family === 'thermal') return mechanicalThermal(difficulty)
  if (family === 'rope-slip') return mechanicalRopeSlip(difficulty)
  if (family === 'bulb-circuit') return mechanicalBulbCircuit(difficulty)
  if (family === 'bulb-count') return mechanicalBulbCount(difficulty)
  if (family === 'bulb-failure') return mechanicalBulbFailure(difficulty)
  if (family === 'dynamo-brightness') return mechanicalDynamoBrightness(difficulty)
  if (family === 'spring-load') return mechanicalSpringLoad(difficulty)
  if (family === 'buoyancy-tank') return mechanicalBuoyancyTank(difficulty)
  if (family === 'bridge-deflection') return mechanicalBridgeDeflection(difficulty)
  if (family === 'convex-mirror') return mechanicalConvexMirror(difficulty)
  if (family === 'cold-air-door') return mechanicalColdAirDoor(difficulty)
  if (family === 'bucket-leak') return mechanicalBucketLeak(difficulty)
  if (family === 'candle-jars') return mechanicalCandleJars(difficulty)
  if (family === 'door-spring') return mechanicalDoorSpring(difficulty)
  if (family === 'bolt-cutter') return mechanicalBoltCutter(difficulty)
  if (family === 'relative-speed') return mechanicalRelativeSpeed(difficulty)
  if (family === 'bulb-bypass') return mechanicalBulbBypass(difficulty)
  if (family === 'drain-seal') return mechanicalDrainSeal(difficulty)
  if (family === 'winch-direction') return mechanicalWinchDirection(difficulty)
  if (family === 'doorstop-slip-compare') return mechanicalDoorstopSlipCompare(difficulty)
  if (family === 'reflector-light-area') return mechanicalReflectorLightArea(difficulty)
  if (family === 'drum-pitch') return mechanicalDrumPitch(difficulty)
  if (family === 'pressure-pointer') return mechanicalPressurePointer(difficulty)
  if (family === 'shelf-bracket') return mechanicalShelfBracket(difficulty)
  if (family === 'curve-skid') return mechanicalCurveSkid(difficulty)
  if (family === 'fan-drive-direction') return mechanicalFanDriveDirection(difficulty)
  if (family === 'bulb-power') return mechanicalBulbPower(difficulty)
  if (family === 'ladder-stability') return mechanicalLadderStability(difficulty)
  if (family === 'pulley-rank') return mechanicalPulleyRank(difficulty)
  if (family === 'balance-heaviest') return mechanicalBalanceHeaviest(difficulty)
  if (family === 'chain-load') return mechanicalChainLoad(difficulty)
  if (family === 'water-overflow-level') return mechanicalWaterOverflowLevel(difficulty)
  if (family === 'wheel-direction-pair') return mechanicalWheelDirectionPair(difficulty)
  return mechanicalHalligan(difficulty)
}
function mechanicalGear(difficulty) {
  const gearCount = difficulty === 'hard' ? pick([3, 4, 5]) : pick([3, 4])
  const labels = ['A', 'B', 'C', 'D', 'E'].slice(0, gearCount)
  const startDirection = pick(DIRECTIONS)
  const targetLabel = labels[labels.length - 1]
  const flips = gearCount - 1
  const answer = flips % 2 === 0 ? startDirection : oppositeDirection(startDirection)
  const options = shuffle([answer, oppositeDirection(answer), 'It stops', 'Cannot say'])
  const spacing = 62
  const startX = 48
  const circles = labels.map((label, index) => {
    const x = startX + index * spacing
    return `
      <circle cx="${x}" cy="65" r="24" fill="${index % 2 === 0 ? '#dbeafe' : '#e2e8f0'}" stroke="${index % 2 === 0 ? '#1d4ed8' : '#475569'}" stroke-width="4"></circle>
      <text x="${x}" y="71" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">${label}</text>
    `
  }).join('')
  const arrowLeft = startX - 28
  const arrowPath = startDirection === 'Clockwise'
    ? `<path d="M ${arrowLeft} 25 C ${arrowLeft - 25} 45 ${arrowLeft - 25} 85 ${arrowLeft} 105" fill="none" stroke="#16a34a" stroke-width="4"></path><polygon points="${arrowLeft - 4},20 ${arrowLeft + 13},25 ${arrowLeft + 2},37" fill="#16a34a"></polygon>`
    : `<path d="M ${arrowLeft} 105 C ${arrowLeft - 25} 85 ${arrowLeft - 25} 45 ${arrowLeft} 25" fill="none" stroke="#16a34a" stroke-width="4"></path><polygon points="${arrowLeft - 4},110 ${arrowLeft + 13},105 ${arrowLeft + 2},93" fill="#16a34a"></polygon>`

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-gear-direction',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `If Gear ${labels[0]} turns ${startDirection.toLowerCase()}, which way will Gear ${targetLabel} turn?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Gear direction</strong></div>
        <svg viewBox="0 0 ${startX + spacing * (gearCount - 1) + 48} 130" width="100%" height="130" style="display:block;margin-top:10px;">
          ${circles}
          ${arrowPath}
          <text x="${startX}" y="120" text-anchor="middle" font-size="14" fill="#0f172a">${startDirection}</text>
        </svg>
        <div class="small center mt8">Each touching gear reverses direction once. Count the number of contacts from ${labels[0]} to ${targetLabel}.</div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: `Every gear contact reverses direction. From ${labels[0]} to ${targetLabel} there are ${flips} contacts, so the final direction is ${answer.toLowerCase()}.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Starting direction of Gear ${labels[0]} = ${startDirection}</div>
        <div class="formula-line">Number of gear contacts = ${flips}</div>
        <div class="formula-line">Each contact reverses the direction once.</div>
        <div class="formula-line">After ${flips} reversals, Gear ${targetLabel} turns ${answer.toLowerCase()}.</div>
      </div>
    `,
    pattern: 'For gear trains, count how many times the direction is reversed between the first gear and the target gear.'
  }
}

function mechanicalRamp(difficulty) {
  const height = pick([40, 45, 50])
  const rampALength = randInt(90, 120)
  const rampBLength = randInt(130, 180)
  const answer = rampBLength > rampALength ? 'Ramp B' : 'Ramp A'
  const options = shuffle([answer, answer === 'Ramp A' ? 'Ramp B' : 'Ramp A', 'Both need the same force', 'Cannot say'])
  const topYA = 120 - height
  const topYB = 120 - height

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-ramp-force',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `Which ramp needs less force to move the same box up ${height} cm to the same height?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Ramp comparison</strong></div>
        <svg viewBox="0 0 380 150" width="100%" height="150" style="display:block;margin-top:10px;">
          <line x1="40" y1="120" x2="${40 + rampALength}" y2="${topYA}" stroke="#1d4ed8" stroke-width="6"></line>
          <line x1="40" y1="120" x2="${40 + rampALength}" y2="120" stroke="#475569" stroke-width="4"></line>
          <rect x="${40 + rampALength - 24}" y="${topYA - 18}" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
          <text x="${40 + Math.floor(rampALength / 2)}" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp A</text>
          <text x="${40 + Math.floor(rampALength / 2)}" y="22" text-anchor="middle" font-size="13">Length ${rampALength} cm</text>
          <line x1="210" y1="120" x2="${210 + rampBLength}" y2="${topYB}" stroke="#16a34a" stroke-width="6"></line>
          <line x1="210" y1="120" x2="${210 + rampBLength}" y2="120" stroke="#475569" stroke-width="4"></line>
          <rect x="${210 + rampBLength - 24}" y="${topYB - 18}" width="22" height="22" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
          <text x="${210 + Math.floor(rampBLength / 2)}" y="140" text-anchor="middle" font-size="16" font-weight="700">Ramp B</text>
          <text x="${210 + Math.floor(rampBLength / 2)}" y="22" text-anchor="middle" font-size="13">Length ${rampBLength} cm</text>
        </svg>
        <div class="small center mt8">Same box, same final height. Compare which slope is gentler.</div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: `${answer} is longer for the same height, so it is less steep and needs less force.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Both ramps lift the same load to the same height = ${height} cm.</div>
        <div class="formula-line">Ramp A length = ${rampALength} cm</div>
        <div class="formula-line">Ramp B length = ${rampBLength} cm</div>
        <div class="formula-line">The longer ramp is gentler, so it requires less force at each moment.</div>
        <div class="formula-line">Therefore the answer is ${answer}.</div>
      </div>
    `,
    pattern: 'For inclined planes, the same work can be spread over a longer distance, reducing the force needed.'
  }
}

function mechanicalLever(difficulty) {
  const loadArm = randInt(2, 5)
  const effortArm = randInt(6, 10)
  const answer = 'Less effort is needed'
  const options = shuffle([answer, 'More effort is needed', 'No change', 'The lever cannot move'])
  const pivotX = 170
  const loadX = pivotX - loadArm * 20
  const effortX = pivotX + effortArm * 16

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-lever-advantage',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `A lever has a load arm of ${loadArm} units and an effort arm of ${effortArm} units. What is the effect?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Lever setup</strong></div>
        <svg viewBox="0 0 380 140" width="100%" height="140" style="display:block;margin-top:10px;">
          <line x1="40" y1="90" x2="340" y2="90" stroke="#0f172a" stroke-width="6"></line>
          <polygon points="${pivotX},90 ${pivotX + 24},120 ${pivotX - 24},120" fill="#64748b"></polygon>
          <rect x="${loadX - 10}" y="58" width="20" height="20" fill="#ef4444"></rect>
          <text x="${loadX}" y="50" text-anchor="middle" font-size="14">Load</text>
          <line x1="${effortX}" y1="45" x2="${effortX}" y2="85" stroke="#16a34a" stroke-width="5"></line>
          <polygon points="${effortX},35 ${effortX - 8},49 ${effortX + 8},49" fill="#16a34a"></polygon>
          <text x="${effortX}" y="28" text-anchor="middle" font-size="14">Effort</text>
        </svg>
        <div class="small center mt8">Load arm = ${loadArm} units. Effort arm = ${effortArm} units.</div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'A longer effort arm produces a larger moment, so less force is needed to move the load.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Moment = force x distance from the pivot</div>
        <div class="formula-line">Load arm = ${loadArm} units</div>
        <div class="formula-line">Effort arm = ${effortArm} units</div>
        <div class="formula-line">Because the effort arm is longer than the load arm, the lever gives mechanical advantage.</div>
        <div class="formula-line">So less effort is needed.</div>
      </div>
    `,
    pattern: 'A longer effort arm increases turning effect for the same applied force.'
  }
}

function mechanicalTechnicalKnowledge(difficulty) {
  const bank = [
    {
      key: 'forming-process',
      prompt: 'Which of the following is not a forming process?',
      options: ['Bending', 'Welding', 'Rolling', 'Deep drawing', 'None of the answers is correct.'],
      answer: 'Welding',
      explanation: 'Forming processes change the shape of a workpiece without joining separate parts. Welding is a joining process, not a forming process.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Bending, rolling and deep drawing all belong to shaping or forming processes.</div>
          <div class="formula-line">Welding is used to join parts together.</div>
          <div class="formula-line">So welding is not a forming process.</div>
        </div>
      `,
      pattern: 'Distinguish manufacturing groups: forming changes shape, while welding belongs to joining.',
    },
    {
      key: 'energy-definition',
      prompt: 'How can energy be defined?',
      options: [
        'As work divided by the time needed for it',
        'As the product of mass and acceleration of a body',
        'As the ability to do work',
        'As the time-based change of a body\'s state of motion',
        'None of the answers is correct.',
      ],
      answer: 'As the ability to do work',
      explanation: 'In basic physics, energy is defined as the capacity or ability to do work.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Work divided by time describes power.</div>
          <div class="formula-line">Mass times acceleration describes force.</div>
          <div class="formula-line">Energy is the ability to do work.</div>
        </div>
      `,
      pattern: 'Separate core physics definitions: energy, power and force are different quantities.',
    },
    {
      key: 'detachable-joint',
      prompt: 'Which of the following is a detachable connection?',
      options: ['Soldered joint', 'Clamp connection', 'Adhesive bond', 'Welded joint', 'None of the answers is correct.'],
      answer: 'Clamp connection',
      explanation: 'A clamp connection can be released again without destroying the joined parts. Soldered, bonded and welded joints are normally non-detachable.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">A detachable connection can be opened again during service.</div>
          <div class="formula-line">Clamp connections are designed for release.</div>
          <div class="formula-line">Soldered, bonded and welded joints are usually permanent.</div>
        </div>
      `,
      pattern: 'For connection questions, identify whether the joint is intended to be released or is permanent.',
    },
    {
      key: 'alloy',
      prompt: 'Which material is an alloy?',
      options: ['Silver', 'Bronze', 'Gold', 'Aluminium', 'None of the answers is correct.'],
      answer: 'Bronze',
      explanation: 'Bronze is an alloy, typically made mainly from copper and tin. The other options are elemental materials in this context.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">An alloy is a metallic material made from at least two elements.</div>
          <div class="formula-line">Bronze is a copper-based alloy.</div>
          <div class="formula-line">Silver, gold and aluminium are elemental metals here.</div>
        </div>
      `,
      pattern: 'An alloy is a mixture of elements; common examples include bronze, brass and steel.',
    },
    {
      key: 'conductor',
      prompt: 'Which material is an electrical conductor?',
      options: ['Polystyrene', 'Glass', 'Aluminium', 'Germanium', 'None of the answers is correct.'],
      answer: 'Aluminium',
      explanation: 'Aluminium is a good electrical conductor. Polystyrene and glass are insulators, while germanium is better classified as a semiconductor.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Metals such as aluminium conduct electric current well.</div>
          <div class="formula-line">Polystyrene and glass are insulating materials.</div>
          <div class="formula-line">Germanium is a semiconductor, not the best answer here.</div>
        </div>
      `,
      pattern: 'Classify materials by electrical behavior: conductor, insulator or semiconductor.',
    },
    {
      key: 'reduce-friction',
      prompt: 'How can friction be reduced most effectively?',
      options: [
        'By lubricating the friction surfaces',
        'By cleaning the friction surfaces',
        'By drying the friction surfaces',
        'By moistening the friction surfaces',
        'None of the answers is correct.',
      ],
      answer: 'By lubricating the friction surfaces',
      explanation: 'Lubrication creates a separating film between surfaces and is the standard way to reduce friction and wear effectively.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Friction is reduced when direct surface contact is lowered.</div>
          <div class="formula-line">Lubricants create a film between the surfaces.</div>
          <div class="formula-line">That is why lubrication is the most effective answer.</div>
        </div>
      `,
      pattern: 'In tribology questions, lubrication is the standard method for reducing friction and wear.',
    },
  ]
  const item = pick(bank)
  const options = item.options.map(value => ({ text: value, plain: value }))

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-technical-knowledge-${item.key}`,
    familyKey: 'mechanical-technical-knowledge',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: item.prompt,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Technical knowledge</strong></div>
        <div class="statement mt12">Choose the best answer from materials, manufacturing and basic physics.</div>
      </div>
    `,
    options,
    correctIndex: item.options.indexOf(item.answer),
    explanation: item.explanation,
    explanationHtml: item.explanationHtml,
    pattern: item.pattern,
  }
}
function mechanicalPulley(difficulty) {
  const segmentsA = randInt(1, 2)
  const segmentsB = randInt(3, 4)
  const answer = 'System B'
  const options = shuffle([answer, 'System A', 'Both need the same effort', 'Cannot say'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-pulley-effort',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `Two pulleys lift the same load. System A has ${segmentsA} supporting rope segment${segmentsA > 1 ? 's' : ''}; System B has ${segmentsB}. Which needs less effort?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Pulley comparison</strong></div>
        <svg viewBox="0 0 380 150" width="100%" height="150" style="display:block;margin-top:10px;">
          <circle cx="100" cy="40" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
          <line x1="100" y1="0" x2="100" y2="22" stroke="#475569" stroke-width="3"></line>
          ${Array.from({ length: segmentsA }, (_, index) => `<line x1="${88 + index * 8}" y1="58" x2="${88 + index * 8}" y2="102" stroke="#1d4ed8" stroke-width="4"></line>`).join('')}
          <rect x="84" y="102" width="32" height="24" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
          <text x="100" y="142" text-anchor="middle" font-size="16" font-weight="700">System A</text>
          <text x="100" y="22" text-anchor="middle" font-size="12">${segmentsA} segment${segmentsA > 1 ? 's' : ''}</text>
          <circle cx="265" cy="35" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
          <circle cx="265" cy="85" r="16" fill="#e2e8f0" stroke="#475569" stroke-width="3"></circle>
          <line x1="265" y1="0" x2="265" y2="19" stroke="#475569" stroke-width="3"></line>
          ${Array.from({ length: segmentsB }, (_, index) => `<line x1="${247 + index * 10}" y1="53" x2="${247 + index * 10}" y2="110" stroke="#16a34a" stroke-width="4"></line>`).join('')}
          <rect x="248" y="110" width="34" height="24" fill="#f59e0b" stroke="#0f172a" stroke-width="2"></rect>
          <text x="265" y="142" text-anchor="middle" font-size="16" font-weight="700">System B</text>
          <text x="265" y="22" text-anchor="middle" font-size="12">${segmentsB} segments</text>
        </svg>
        <div class="small center mt8">More supporting rope segments create greater mechanical advantage.</div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'The system with more supporting rope segments needs less force to lift the same load.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">System A support segments = ${segmentsA}</div>
        <div class="formula-line">System B support segments = ${segmentsB}</div>
        <div class="formula-line">More supporting segments = greater mechanical advantage</div>
        <div class="formula-line">So System B requires less effort.</div>
      </div>
    `,
    pattern: 'In pulley questions, compare the number of rope segments supporting the load.'
  }
}
function mechanicalThermal(difficulty) {
  const object = pick(['metal rod', 'steel bar', 'metal rail'])
  const action = pick(['heated', 'cooled'])
  const answer = action === 'heated' ? 'It increases' : 'It decreases'
  const options = shuffle(['It increases', 'It decreases', 'It stays exactly the same', 'Cannot say'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-thermal-expansion',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `A ${object} is ${action}. What usually happens to its length?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Thermal behavior</strong></div>
        <svg viewBox="0 0 360 120" width="100%" height="120" style="display:block;margin-top:10px;">
          <rect x="40" y="35" width="110" height="18" rx="8" fill="#94a3b8"></rect>
          <text x="95" y="28" text-anchor="middle" font-size="14">Before</text>
          <rect x="200" y="35" width="${action === 'heated' ? 140 : 85}" height="18" rx="8" fill="${action === 'heated' ? '#f97316' : '#60a5fa'}"></rect>
          <text x="255" y="28" text-anchor="middle" font-size="14">After being ${action}</text>
          <path d="M165 44 L190 44" stroke="#ef4444" stroke-width="4"></path>
          <polygon points="190,44 180,38 180,50" fill="#ef4444"></polygon>
        </svg>
        <div class="statement">Assume normal thermal behavior of metals.</div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: action === 'heated'
      ? 'Most metals expand when heated, so the object becomes slightly longer.'
      : 'Most metals contract when cooled, so the object becomes slightly shorter.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Metals usually expand when heated and contract when cooled.</div>
        <div class="formula-line">This ${object} is ${action}.</div>
        <div class="formula-line">So its length ${action === 'heated' ? 'increases' : 'decreases'}.</div>
      </div>
    `,
    pattern: 'Thermal expansion increases length when heated and decreases length when cooled.'
  }
}


function mechanicalBuoyancyTank(difficulty) {
  const container = pick(['cylindrical metal tank', 'hollow steel drum', 'sealed metal vessel'])
  const answer = 'Water replaces the air in the tank which makes it heavier'
  const options = shuffle([
    answer,
    'The escaping bubbles push the tank downward',
    'The metal itself becomes denser underwater',
    'The bubbles make the surrounding water heavier',
    'Impossible to tell',
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-buoyancy-tank',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `A non-pressurised ${container} filled with air is submerged underwater. As the air escapes, the tank gradually moves deeper underwater. Which statement best explains this?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Air escaping underwater</strong></div>
        <svg viewBox="0 0 360 190" width="100%" height="190" style="display:block;margin-top:10px;">
          <rect x="0" y="0" width="360" height="190" fill="#eef6ff"></rect>
          <rect x="110" y="74" width="110" height="56" rx="22" fill="#4b5563"></rect>
          <circle cx="110" cy="102" r="28" fill="#4b5563"></circle>
          <circle cx="220" cy="102" r="28" fill="#4b5563"></circle>
          <rect x="228" y="93" width="18" height="18" fill="#9ca3af"></rect>
          <path d="M245 101 C258 86 267 86 276 104" fill="none" stroke="#6b7280" stroke-width="6"></path>
          ${Array.from({ length: 18 }, (_, index) => {
            const x = 255 + (index % 4) * 8 + randInt(-2, 2)
            const y = 75 - index * 6 + randInt(-2, 2)
            const r = 3 + (index % 3)
            return `<circle cx="${x}" cy="${y}" r="${r}" fill="#9ca3af" opacity="0.85"></circle>`
          }).join('')}
          <path d="M120 142 L120 172 M90 142 L90 172 M150 142 L150 172" stroke="#6b7280" stroke-width="5"></path>
          <polygon points="120,172 109,158 131,158" fill="#6b7280"></polygon>
          <polygon points="90,172 79,158 101,158" fill="#6b7280"></polygon>
          <polygon points="150,172 139,158 161,158" fill="#6b7280"></polygon>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'As air leaves and water enters, the tank contains more mass while its displaced external volume stays broadly the same, so it becomes less buoyant and sinks deeper.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Buoyancy depends on the water displaced by the outside of the tank.</div>
        <div class="formula-line">As air escapes, water enters the non-pressurised tank.</div>
        <div class="formula-line">That increases the mass of the tank-and-contents system.</div>
        <div class="formula-line">So the tank becomes heavier relative to its buoyancy and moves deeper underwater.</div>
      </div>
    `,
    pattern: 'For buoyancy questions, compare weight and upthrust. Replacing air with water increases weight without helping buoyancy.'
  }
}

function mechanicalBridgeDeflection(difficulty) {
  const answer = 'Below the cars'
  const options = shuffle(['Under the towers', answer, 'Middle of the bridge', 'All of the above will have equal deflection', 'Impossible to tell'])
  const car1X = 160 + randInt(-10, 10)
  const car2X = 245 + randInt(-10, 10)

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-bridge-deflection',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'There are two identical cars along a bridge. If the bridge has the same thickness along its span, which part(s) of the bridge would undergo the most deflection?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Bridge loading</strong></div>
        <svg viewBox="0 0 420 190" width="100%" height="190" style="display:block;margin-top:10px;">
          <rect x="40" y="95" width="340" height="18" fill="#27272a"></rect>
          <rect x="78" y="30" width="24" height="130" fill="#18181b"></rect>
          <rect x="315" y="30" width="24" height="130" fill="#18181b"></rect>
          <rect x="65" y="78" width="50" height="18" fill="#27272a"></rect>
          <rect x="302" y="78" width="50" height="18" fill="#27272a"></rect>
          <rect x="84" y="20" width="12" height="10" fill="#3f3f46"></rect>
          <rect x="82" y="10" width="16" height="10" fill="#18181b"></rect>
          <rect x="321" y="20" width="12" height="10" fill="#3f3f46"></rect>
          <rect x="319" y="10" width="16" height="10" fill="#18181b"></rect>
          ${carSvg(car1X, 75, 1)}
          ${carSvg(car2X, 75, 1)}
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'The largest local bending occurs where the loads are applied, so the bridge sags most directly beneath the cars.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">The bridge bends where the downward loads are applied.</div>
        <div class="formula-line">The cars are the concentrated loads in this picture.</div>
        <div class="formula-line">So the greatest local deflection occurs directly below the cars, not under the rigid supports.</div>
      </div>
    `,
    pattern: 'For beam and bridge questions, supports resist motion while concentrated loads create the largest sagging in the loaded region.'
  }
}

function mechanicalConvexMirror(difficulty) {
  const answer = 'The wider angle of view reduces blind spots'
  const options = shuffle([
    'It provides a clearer reflection',
    'It has a more accurate reflection',
    answer,
    'It is easier to clean a convex mirror',
    'A convex mirror provides no advantage',
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-convex-mirror',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Convex mirrors are used for rear-view mirrors on vehicles. What is the main advantage of using a convex mirror instead of a flat mirror?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Vehicle mirror</strong></div>
        <svg viewBox="0 0 420 200" width="100%" height="200" style="display:block;margin-top:10px;">
          <rect x="28" y="24" width="58" height="40" fill="#e5e7eb"></rect>
          <path d="M61 30 Q82 44 61 58" fill="#6b7280"></path>
          <text x="57" y="18" text-anchor="middle" font-size="12">Convex</text>
          <rect x="28" y="84" width="58" height="40" fill="#e5e7eb"></rect>
          <rect x="54" y="90" width="8" height="28" fill="#6b7280"></rect>
          <text x="57" y="78" text-anchor="middle" font-size="12">Flat</text>
          <path d="M150 45 Q250 18 344 55 Q382 72 370 108 Q362 142 318 138 Q220 132 160 110 Q124 96 126 73 Q128 55 150 45 Z" fill="#1f1f1f"></path>
          <path d="M170 60 Q246 38 325 62 Q345 70 338 98 Q332 118 302 117 Q226 114 179 98 Q154 90 156 72 Q158 64 170 60 Z" fill="#9ca3af"></path>
          <path d="M175 68 Q246 48 318 68" fill="none" stroke="#dbeafe" stroke-width="5" opacity="0.65"></path>
          <path d="M180 105 L238 63 L306 62" fill="none" stroke="#f8fafc" stroke-width="2" opacity="0.7"></path>
          <path d="M180 105 L238 87 L306 82" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"></path>
          <path d="M346 110 Q380 124 401 149 L386 149 Q365 135 338 130" fill="#111827"></path>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'Convex mirrors show a wider field of view, so the driver can see more area around the vehicle and reduce blind spots.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">A convex mirror spreads reflected rays over a wider angle.</div>
        <div class="formula-line">That lets the driver see more of the road and nearby traffic.</div>
        <div class="formula-line">So the main advantage is reduced blind spots, not a more accurate image size.</div>
      </div>
    `,
    pattern: 'Convex mirrors trade image size for field of view.'
  }
}

function mechanicalColdAirDoor(difficulty) {
  const answer = 'Scenario A, the cold air will flow towards the floor'
  const options = shuffle([
    answer,
    'Scenario B, the cold air will flow towards the ceiling',
    'A combination of A and B',
    'The cold air will not enter the house',
    'Impossible to tell',
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-cold-air-door',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'It is a cold winter outside and a heated house has its front door open. If the wind speed outside is very low, how would the cold air enter the house?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Cold air entering a warm house</strong></div>
        <svg viewBox="0 0 420 200" width="100%" height="200" style="display:block;margin-top:10px;">
          <rect x="90" y="26" width="54" height="112" fill="#e5e7eb" stroke="#6b7280" stroke-width="4"></rect>
          <path d="M144 34 L178 55 L178 145 L144 136 Z" fill="#d1d5db" stroke="#6b7280" stroke-width="3"></path>
          <path d="M48 138 C70 138 76 154 88 168" fill="none" stroke="#94a3b8" stroke-width="6" opacity="0.55"></path>
          <path d="M88 168 L77 160 M88 168 L82 155" stroke="#94a3b8" stroke-width="4" opacity="0.55"></path>
          <text x="123" y="168" text-anchor="middle" font-size="14">Scenario A</text>
          <rect x="258" y="26" width="54" height="112" fill="#e5e7eb" stroke="#6b7280" stroke-width="4"></rect>
          <path d="M312 34 L345 18 L345 145 L312 136 Z" fill="#d1d5db" stroke="#6b7280" stroke-width="3"></path>
          <path d="M244 126 C248 80 276 66 292 40" fill="none" stroke="#cbd5e1" stroke-width="6" opacity="0.55"></path>
          <path d="M292 40 L281 47 M292 40 L290 53" stroke="#cbd5e1" stroke-width="4" opacity="0.55"></path>
          <path d="M268 52 C292 40 316 34 336 26" fill="none" stroke="#cbd5e1" stroke-width="6" opacity="0.55"></path>
          <text x="286" y="168" text-anchor="middle" font-size="14">Scenario B</text>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'Cold air is denser than warm indoor air, so it tends to sink and enter near the bottom of the doorway while warmer air escapes higher up.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Cold air is denser than warm air.</div>
        <div class="formula-line">Denser air tends to sink lower in a doorway opening.</div>
        <div class="formula-line">So the cold air enters along the lower part of the door opening, matching Scenario A.</div>
      </div>
    `,
    pattern: 'For convection questions, colder air sinks and warmer air rises.'
  }
}

function mechanicalBucketLeak(difficulty) {
  const answer = 'It decreases'
  const options = shuffle(['It increases', 'It stays the same', answer, 'It reverses', 'Impossible to tell'])
  const level = pick([52, 58, 64])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-bucket-leak',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'A bucket of water has a leak on its lower side. As the water level goes down, what happens to the speed of the water coming out of the hole?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Leaking bucket</strong></div>
        <svg viewBox="0 0 340 210" width="100%" height="210" style="display:block;margin-top:10px;">
          <path d="M110 40 Q170 20 230 40 L214 164 Q205 194 170 198 Q135 194 126 164 Z" fill="#050505"></path>
          <path d="M128 58 Q170 48 212 58 L204 88 Q170 100 136 88 Z" fill="#9ca3af"></path>
          <path d="M130 ${level} Q170 ${level - 12} 210 ${level}" fill="none" stroke="#e5e7eb" stroke-width="10" opacity="0.7"></path>
          <path d="M120 38 Q170 -6 220 38" fill="none" stroke="#2f2f2f" stroke-width="4"></path>
          <circle cx="236" cy="126" r="5" fill="#9ca3af"></circle>
          <path d="M240 126 C270 126 280 150 295 170" fill="none" stroke="#9ca3af" stroke-width="6"></path>
          <path d="M296 170 C302 176 306 182 307 188" fill="none" stroke="#d1d5db" stroke-width="4"></path>
          ${Array.from({ length: 10 }, (_, index) => `<circle cx="${292 + (index % 4) * 4}" cy="${181 + (index % 3) * 4}" r="2.5" fill="#d1d5db"></circle>`).join('')}
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'The pressure driving water out depends on the height of water above the hole. As that height falls, the outflow speed decreases.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Water pressure at the hole depends on the water depth above it.</div>
        <div class="formula-line">As the water level drops, that pressure head becomes smaller.</div>
        <div class="formula-line">Less pressure head means lower exit speed.</div>
        <div class="formula-line">So the water comes out more slowly over time.</div>
      </div>
    `,
    pattern: 'Lower water head means lower pressure and lower outflow speed.'
  }
}

function mechanicalCandleJars(difficulty) {
  const answer = 'A, candle in a small sealed jar'
  const options = shuffle([
    answer,
    'B, candle in a large sealed jar',
    'C, candle in a small jar with holes',
    'They will all extinguish at the same time',
    'Impossible to tell',
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-candle-jars',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Three identical candles were lit and covered at the same time. Which candle would have its flame extinguish first?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Covered candles</strong></div>
        <svg viewBox="0 0 430 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${jarSvg(85, 1, false, 'A')}
          ${jarSvg(215, 1.35, false, 'B')}
          ${jarSvg(345, 1, true, 'C')}
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'The small sealed jar contains the least usable oxygen, so candle A uses it up first and goes out first.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">A flame needs oxygen to keep burning.</div>
        <div class="formula-line">Jar A is sealed and smaller than Jar B, so it traps less air.</div>
        <div class="formula-line">Jar C has holes, so fresh air can still enter more easily than in a sealed jar.</div>
        <div class="formula-line">Therefore candle A extinguishes first.</div>
      </div>
    `,
    pattern: 'For burning questions, compare oxygen supply and whether fresh air can enter.'
  }
}

function mechanicalDoorSpring(difficulty) {
  const answer = 'The door will close faster'
  const options = shuffle(['The door will close slower', 'The door will not fully close', 'The door will make a screeching noise as it closes', answer, 'It will not make a difference'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-door-spring',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Fire doors use a spring which automatically pushes and closes the door when it is open. If the spring were made thicker, what effect would this have on how the door closes?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Door closer</strong></div>
        <svg viewBox="0 0 380 190" width="100%" height="190" style="display:block;margin-top:10px;">
          <rect x="90" y="95" width="200" height="44" rx="10" fill="#6b7280"></rect>
          <circle cx="104" cy="109" r="4" fill="#4b5563"></circle>
          <circle cx="104" cy="125" r="4" fill="#4b5563"></circle>
          <circle cx="276" cy="109" r="4" fill="#4b5563"></circle>
          <circle cx="276" cy="125" r="4" fill="#4b5563"></circle>
          <path d="M155 88 L135 36 Q130 20 146 14 L159 13 Q171 16 171 30 L168 94" fill="none" stroke="#9ca3af" stroke-width="14"></path>
          <path d="M167 56 L256 56 L286 76" fill="none" stroke="#9ca3af" stroke-width="10"></path>
          <rect x="248" y="50" width="46" height="18" fill="#9ca3af"></rect>
          <rect x="236" y="84" width="22" height="20" fill="#6b7280"></rect>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'A thicker spring is usually stiffer, so it applies a larger restoring force and tends to close the door faster.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">A thicker spring is generally stiffer than a thinner spring.</div>
        <div class="formula-line">A stiffer spring pushes back harder when the door is open.</div>
        <div class="formula-line">More restoring force means the door is pulled closed faster.</div>
      </div>
    `,
    pattern: 'Stiffer springs exert more force for the same displacement.'
  }
}

function mechanicalBoltCutter(difficulty) {
  const answer = 'It provides mechanical advantage which allows cutting through thick bolts.'
  const options = shuffle([
    'Longer handles make the cutting blade move faster',
    answer,
    'The appearance of the tool is significantly more aesthetic with longer handles',
    'It makes the bolt cutter more durable when dropped accidentally',
    'Longer handles are more ergonomic and allow easier storage',
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-bolt-cutter',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'A bolt cutter has long handles with handle grips that are located as far away as possible from the neck. Which statement best explains this design?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Bolt cutter leverage</strong></div>
        <svg viewBox="0 0 420 200" width="100%" height="200" style="display:block;margin-top:10px;">
          <path d="M95 103 L278 66" stroke="#7c7f84" stroke-width="12" fill="none"></path>
          <path d="M95 118 L278 145" stroke="#7c7f84" stroke-width="12" fill="none"></path>
          <path d="M270 72 L328 57" stroke="#6b7280" stroke-width="12" fill="none"></path>
          <path d="M270 139 L328 148" stroke="#6b7280" stroke-width="12" fill="none"></path>
          <rect x="314" y="49" width="42" height="16" rx="8" fill="#2f2f2f"></rect>
          <rect x="314" y="140" width="42" height="16" rx="8" fill="#2f2f2f"></rect>
          <circle cx="146" cy="112" r="8" fill="#6b7280"></circle>
          <circle cx="184" cy="107" r="8" fill="#6b7280"></circle>
          <path d="M78 95 L96 87 L117 101 L109 122 L79 123 Z" fill="#6b7280"></path>
          <path d="M78 126 L96 136 L117 123 L109 101 L79 100 Z" fill="#6b7280"></path>
          <path d="M70 108 L85 111 L73 120" fill="#111827"></path>
          <path d="M70 114 L85 111 L73 102" fill="#111827"></path>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'Long handles increase the distance from the pivot, so the user creates a larger moment and gets greater cutting force at the jaws.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Moment = force x distance from the pivot.</div>
        <div class="formula-line">Longer handles increase that distance.</div>
        <div class="formula-line">A larger moment at the handles produces a larger cutting force at the jaws.</div>
        <div class="formula-line">That is mechanical advantage.</div>
      </div>
    `,
    pattern: 'Tools with long handles usually use leverage to multiply force.'
  }
}

function mechanicalRelativeSpeed(difficulty) {
  const leadSpeed = pick([50, 60, 70])
  const answer = `${leadSpeed} mph`
  const options = shuffle([`${leadSpeed + 20} mph`, `${leadSpeed + 10} mph`, answer, `${Math.max(10, leadSpeed - 10)} mph`, 'Impossible to tell'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-relative-speed',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: `A car is behind a moving fire engine on a motorway. The fire engine is travelling at ${leadSpeed} mph. If the distance between the two vehicles is not changing, what is the car's speed?`,
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Constant separation</strong></div>
        <svg viewBox="0 0 420 180" width="100%" height="180" style="display:block;margin-top:10px;">
          <path d="M50 120 L80 120 L94 88 L160 88 L182 101 L182 120 L190 120 L190 132 L50 132 Z" fill="#9ca3af"></path>
          <rect x="72" y="96" width="28" height="18" fill="#e5e7eb"></rect>
          <rect x="104" y="96" width="48" height="18" fill="#cbd5e1"></rect>
          <circle cx="82" cy="133" r="10" fill="#1f2937"></circle>
          <circle cx="158" cy="133" r="10" fill="#1f2937"></circle>
          <path d="M236 127 Q250 106 290 106 Q325 106 341 127 L350 127 L350 136 L226 136 L226 127 Z" fill="#6b7280"></path>
          <circle cx="252" cy="136" r="9" fill="#1f2937"></circle>
          <circle cx="324" cy="136" r="9" fill="#1f2937"></circle>
          <path d="M112 72 L46 72" stroke="#111827" stroke-width="5"></path>
          <polygon points="46,72 58,66 58,78" fill="#111827"></polygon>
          <text x="79" y="62" text-anchor="middle" font-size="14">${leadSpeed} mph</text>
          <path d="M320 72 L250 72" stroke="#111827" stroke-width="5"></path>
          <polygon points="250,72 262,66 262,78" fill="#111827"></polygon>
          <text x="285" y="62" text-anchor="middle" font-size="14">? mph</text>
          <path d="M190 104 L226 104" stroke="#6b7280" stroke-width="3"></path>
          <path d="M190 121 L226 121" stroke="#6b7280" stroke-width="3"></path>
          <text x="208" y="98" text-anchor="middle" font-size="12">distance</text>
          <text x="208" y="112" text-anchor="middle" font-size="12">does not</text>
          <text x="208" y="126" text-anchor="middle" font-size="12">change</text>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'If the gap between two vehicles stays constant, their relative speed is zero, so they must be travelling at the same speed.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Distance not changing means relative speed = 0.</div>
        <div class="formula-line">So the car must match the fire engine's speed.</div>
        <div class="formula-line">Fire engine speed = ${leadSpeed} mph.</div>
        <div class="formula-line">Therefore the car speed = ${leadSpeed} mph.</div>
      </div>
    `,
    pattern: 'Constant separation means equal speeds in the same direction.'
  }
}

function mechanicalHalligan(difficulty) {
  const answer = 'D'
  const options = shuffle(['A', 'B', 'C', 'D', 'They would all require the same effort'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-halligan-leverage',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Firefighters use a halligan tool to forcibly enter locked doors during rescue operations. Which halligan would require the least effort to forcibly open the door?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Prying with leverage</strong></div>
        <svg viewBox="0 0 420 190" width="100%" height="190" style="display:block;margin-top:10px;">
          <rect x="64" y="34" width="118" height="126" fill="#9ca3af"></rect>
          <rect x="100" y="45" width="26" height="104" fill="#111827"></rect>
          <path d="M125 104 L236 95" stroke="#6b7280" stroke-width="7"></path>
          <path d="M228 95 Q246 83 244 63" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="244,63 235,71 247,76" fill="#111827"></polygon>
          <path d="M253 48 L329 48" stroke="#9ca3af" stroke-width="6"></path>
          <polygon points="329,48 347,42 342,48 347,54" fill="#111827"></polygon>
          <text x="357" y="53" font-size="18">A</text>
          <path d="M253 82 L343 82" stroke="#9ca3af" stroke-width="6"></path>
          <polygon points="343,82 361,76 356,82 361,88" fill="#111827"></polygon>
          <text x="371" y="87" font-size="18">B</text>
          <path d="M253 116 L357 116" stroke="#9ca3af" stroke-width="6"></path>
          <polygon points="357,116 375,110 370,116 375,122" fill="#111827"></polygon>
          <text x="385" y="121" font-size="18">C</text>
          <path d="M253 150 L371 150" stroke="#9ca3af" stroke-width="6"></path>
          <polygon points="371,150 389,144 384,150 389,156" fill="#111827"></polygon>
          <text x="399" y="155" font-size="18">D</text>
        </svg>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: 'The longest handle gives the greatest lever arm, so it needs the least force to produce the same turning moment on the door.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Moment = force x lever arm.</div>
        <div class="formula-line">A longer halligan handle means a longer lever arm.</div>
        <div class="formula-line">For the same required turning moment, a longer lever arm needs less input force.</div>
        <div class="formula-line">So tool D requires the least effort.</div>
      </div>
    `,
    pattern: 'For prying tools, the longest effective handle gives the greatest mechanical advantage.'
  }
}


function mechanicalGearLoop(difficulty) {
  const gearCount = pick(difficulty === 'hard' ? [6, 7, 8] : [6, 7])
  const labels = Array.from({ length: gearCount }, (_, index) => index + 1)
  const sameDirection = labels.filter(label => label !== 1 && label % 2 === 1)
  const oppositeDirectionGears = labels.filter(label => label % 2 === 0)
  const positions = labels.map((label, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / gearCount
    return {
      label,
      x: 205 + 88 * Math.cos(angle),
      y: 112 + 82 * Math.sin(angle),
      r: label === 3 ? 30 : label % 2 === 0 ? 20 : 22,
    }
  })

  let answer = ''
  let explanation = ''
  let explanationHtml = ''
  let pattern = ''
  let options = []

  if (gearCount % 2 === 1) {
    answer = 'The gears do not turn at all'
    options = shuffle([
      answer,
      gearPairText(sameDirection.slice(0, 2)),
      gearPairText(oppositeDirectionGears.slice(0, 2)),
      gearPairText([oppositeDirectionGears[0], sameDirection[0]]),
    ].filter(Boolean))
    explanation = 'An odd closed loop of meshing gears creates a contradiction in rotation direction, so the system locks and none of the gears can turn.'
    explanationHtml = `
      <div class="formula-block">
        <div class="formula-line">Each meshing gear reverses direction.</div>
        <div class="formula-line">This loop contains ${gearCount} gears, which is an odd number.</div>
        <div class="formula-line">Following the loop all the way around would require Gear 1 to rotate both clockwise and counterclockwise.</div>
        <div class="formula-line">That contradiction means the gear train jams, so the gears do not turn at all.</div>
      </div>
    `
    pattern = 'A closed gear loop with an odd number of gears locks up because the reversals are inconsistent.'
  } else {
    const correctPair = sameDirection.length >= 2 ? sameDirection.slice(0, 2) : [sameDirection[0], labels[labels.length - 1]]
    answer = gearPairText(correctPair)
    options = shuffle([
      answer,
      gearPairText(oppositeDirectionGears.slice(0, 2)),
      gearPairText([oppositeDirectionGears[0], sameDirection[0]]),
      'The gears do not turn at all',
    ].filter(Boolean))
    explanation = `Every gear contact reverses direction once, so the gears in positions ${answer} rotate in the same direction as Gear 1.`
    explanationHtml = `
      <div class="formula-block">
        <div class="formula-line">Each gear mesh reverses direction.</div>
        <div class="formula-line">This loop contains ${gearCount} gears, which is an even number, so it can rotate freely.</div>
        <div class="formula-line">Starting from Gear 1, gears 3, 5${gearCount >= 8 ? ', 7' : ''} match Gear 1 because they are an even number of reversals away.</div>
        <div class="formula-line">Therefore the correct pair is ${answer}.</div>
      </div>
    `
    pattern = 'In a gear loop, even-number loops can rotate. Gears an even number of contacts away turn in the same direction.'
  }

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-gear-loop-${gearCount}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which of the gears turn in the same direction as gear 1?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Gear loop</strong></div>
        <svg viewBox="0 0 410 235" width="100%" height="235" style="display:block;margin-top:10px;">
          ${positions.map(position => gearCogSvg(position.x, position.y, position.r, String(position.label))).join('')}
        </svg>
        <div class="small center mt8">Adjacent gears reverse direction. First check whether the closed loop can rotate at all.</div>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation,
    explanationHtml,
    pattern,
  }
}

function mechanicalBeltShaftSpeed(difficulty) {
  const scenarios = [
    { shaft1: 20, shaft2Driven: 40, shaft2Driver: 18, shaft3: 36 },
    { shaft1: 36, shaft2Driven: 18, shaft2Driver: 16, shaft3: 32 },
    { shaft1: 30, shaft2Driven: 15, shaft2Driver: 30, shaft3: 15 },
  ]
  const setup = pick(scenarios)
  const speed1 = 1
  const speed2 = setup.shaft1 / setup.shaft2Driven
  const speed3 = speed2 * (setup.shaft2Driver / setup.shaft3)
  const speeds = [speed1, speed2, speed3]
  const fastestIndex = speeds.indexOf(Math.max(...speeds))
  const answer = String(fastestIndex + 1)

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-belt-shaft-speed-${answer}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which shaft turns fastest?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Belt and pulley system</strong></div>
        <svg viewBox="0 0 420 230" width="100%" height="230" style="display:block;margin-top:10px;">
          <line x1="42" y1="136" x2="144" y2="136" stroke="#9ca3af" stroke-width="4"></line>
          <line x1="170" y1="64" x2="302" y2="64" stroke="#9ca3af" stroke-width="4"></line>
          <line x1="165" y1="178" x2="278" y2="178" stroke="#9ca3af" stroke-width="4"></line>
          ${beltPulleySvg(95, 136, setup.shaft1, '1')}
          ${beltPulleySvg(200, 64, setup.shaft2Driven, '')}
          ${beltPulleySvg(278, 64, setup.shaft2Driver, '2')}
          ${beltPulleySvg(226, 178, setup.shaft3, '3')}
          <line x1="95" y1="${136 - setup.shaft1}" x2="200" y2="${64 - setup.shaft2Driven}" stroke="#111827" stroke-width="4"></line>
          <line x1="95" y1="${136 + setup.shaft1}" x2="200" y2="${64 + setup.shaft2Driven}" stroke="#111827" stroke-width="4"></line>
          <line x1="278" y1="${64 + setup.shaft2Driver}" x2="226" y2="${178 - setup.shaft3}" stroke="#111827" stroke-width="4"></line>
          <line x1="278" y1="${64 - setup.shaft2Driver}" x2="226" y2="${178 + setup.shaft3}" stroke="#111827" stroke-width="4"></line>
        </svg>
        <div class="small center mt8">The belt speed is the same along each belt. Smaller driven pulleys rotate faster than larger ones.</div>
      </div>
    `,
    options: ['1', '2', '3'].map(value => ({ text: value, plain: value })),
    correctIndex: ['1', '2', '3'].indexOf(answer),
    explanation: `Shaft ${answer} has the greatest rotational speed once the pulley ratios are applied through the belt train.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Take Shaft 1 speed as 1.00x.</div>
        <div class="formula-line">Shaft 2 speed = ${setup.shaft1} / ${setup.shaft2Driven} = ${speed2.toFixed(2)}x</div>
        <div class="formula-line">Shaft 3 speed = ${speed2.toFixed(2)} x (${setup.shaft2Driver} / ${setup.shaft3}) = ${speed3.toFixed(2)}x</div>
        <div class="formula-line">The largest speed is on Shaft ${answer}.</div>
      </div>
    `,
    pattern: 'For belt drives, rotational speed changes inversely with pulley size. Multiply the ratios stage by stage.'
  }
}

function mechanicalRopeSlip(difficulty) {
  const answer = pick(['A', 'B'])
  const wrapsA = answer === 'A' ? 2.3 : 1.2
  const wrapsB = answer === 'B' ? 2.3 : 1.2

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-rope-slip-${answer}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which rope is less likely to slip?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Rope friction</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${ropeSlipSvg(130, 'A', wrapsA)}
          ${ropeSlipSvg(290, 'B', wrapsB)}
        </svg>
      </div>
    `,
    options: ['A', 'B', 'No difference'].map(value => ({ text: value, plain: value })),
    correctIndex: ['A', 'B', 'No difference'].indexOf(answer),
    explanation: `Rope ${answer} wraps around the support more, so it has a larger contact angle and more friction resisting slip.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">More rope contact with the support means more friction.</div>
        <div class="formula-line">Rope A wrap amount = ${wrapsA.toFixed(1)} turns</div>
        <div class="formula-line">Rope B wrap amount = ${wrapsB.toFixed(1)} turns</div>
        <div class="formula-line">So rope ${answer} is less likely to slip.</div>
      </div>
    `,
    pattern: 'For ropes around hooks or posts, more wrap angle gives greater friction and less slipping.'
  }
}

function mechanicalBulbCircuit(difficulty) {
  const correctLabel = pick(['A', 'B', 'C'])
  const layouts = {
    A: correctLabel === 'A' ? 'correct' : correctLabel === 'B' ? 'same-contact' : 'open',
    B: correctLabel === 'B' ? 'correct' : correctLabel === 'C' ? 'same-contact' : 'open',
    C: correctLabel === 'C' ? 'correct' : correctLabel === 'A' ? 'same-contact' : 'open',
  }

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bulb-circuit-${correctLabel}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which picture shows how the bulb should be connected to the battery for the bulb to light?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Simple electrical circuit</strong></div>
        <svg viewBox="0 0 450 240" width="100%" height="240" style="display:block;margin-top:10px;">
          ${bulbCircuitOptionSvg(85, 'A', layouts.A)}
          ${bulbCircuitOptionSvg(225, 'B', layouts.B)}
          ${bulbCircuitOptionSvg(365, 'C', layouts.C)}
        </svg>
      </div>
    `,
    options: ['A', 'B', 'C'].map(value => ({ text: value, plain: value })),
    correctIndex: ['A', 'B', 'C'].indexOf(correctLabel),
    explanation: `Only picture ${correctLabel} makes a complete circuit by connecting one battery terminal to the bulb tip and the other terminal to the metal side of the bulb.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">A bulb lights only if current can pass through the filament in a closed loop.</div>
        <div class="formula-line">That requires one battery terminal to contact the bulb tip and the other to contact the bulb's metal casing.</div>
        <div class="formula-line">Only option ${correctLabel} creates that complete circuit.</div>
      </div>
    `,
    pattern: 'A bulb needs a closed circuit with two different bulb contacts: the bottom tip and the metal side.'
  }
}

function mechanicalBarLock(difficulty) {
  const answer = pick(['1', '2', '3'])
  const shoulderText = answer === '1'
    ? 'the front upper shoulder near the frame'
    : answer === '2'
    ? 'the rear upper shoulder on the bar'
    : 'the lower shoulder under the bar'

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bar-lock-${answer}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which block wedge 1, 2 or 3 has to be removed so that you can pull bar A and open door B? (C is the door frame)',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Door bar lock</strong></div>
        <svg viewBox="0 0 460 240" width="100%" height="240" style="display:block;margin-top:10px;">
          ${barLockDiagramSvg(answer)}
        </svg>
        <div class="small center mt8">Bar A must slide to the right. Remove the wedge that actually sits in the path of a locking shoulder.</div>
      </div>
    `,
    options: ['1', '2', '3'].map(value => ({ text: value, plain: value })),
    correctIndex: ['1', '2', '3'].indexOf(answer),
    explanation: `When bar A is pulled to the right, ${shoulderText} hits wedge ${answer} first. Removing wedge ${answer} frees the bar; removing either of the others still leaves the blocking contact in place.`,
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">First identify the direction of motion: bar A has to slide to the right.</div>
        <div class="formula-line">Then follow the shoulders on the bar and see which wedge lies directly in that path.</div>
        <div class="formula-line">Here ${shoulderText} is blocked by wedge ${answer}.</div>
        <div class="formula-line">So wedge ${answer} must be removed.</div>
      </div>
    `,
    pattern: 'In lock diagrams, follow the moving part in its actual direction of travel and identify the first piece that physically blocks that motion.'
  }
}

function mechanicalBulbCount(difficulty) {
  const scenarios = [
    {
      key: 'open-series',
      answer: 'none',
      explanation: 'Bulb 1 is in series with the supply path into the rest of the circuit. Removing it opens the circuit before current can reach any other bulb.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">A removed bulb acts like an open switch.</div>
          <div class="formula-line">Here bulb 1 lies in series with the rest of the circuit.</div>
          <div class="formula-line">Once bulb 1 is removed, the loop is broken before any branch is reached.</div>
          <div class="formula-line">So no bulbs light.</div>
        </div>
      `,
      pattern: 'If a removed bulb opens the only supply path, the entire circuit goes dead.'
    },
    {
      key: 'two-live',
      answer: '2',
      explanation: 'Bulb 1 is on a separate branch, so removing it does not break the main loop. Bulb 3 is on an incomplete side branch, so only bulbs 2 and 4 still light.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Treat bulb 1 as an open branch after removal.</div>
          <div class="formula-line">There is still one complete loop through bulb 2 and bulb 4.</div>
          <div class="formula-line">Bulb 3 sits on a dead-end branch and has no complete return path.</div>
          <div class="formula-line">So exactly 2 bulbs light.</div>
        </div>
      `,
      pattern: 'Count only bulbs that remain on a complete closed path from one battery terminal back to the other.'
    },
    {
      key: 'three-live',
      answer: '3',
      explanation: 'Bulb 1 is on a separate spur and can be removed without affecting the main loop. Bulbs 2, 3 and 4 remain on the closed circuit, so all three light.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">After removing bulb 1, ignore that dead side branch.</div>
          <div class="formula-line">The main circuit still forms a complete loop.</div>
          <div class="formula-line">Bulbs 2, 3 and 4 are all still on that loop.</div>
          <div class="formula-line">So 3 bulbs light.</div>
        </div>
      `,
      pattern: 'A bulb on a side spur can be removed without killing the main loop if the rest of the circuit still closes.'
    }
  ]
  const scenario = pick(scenarios)
  const options = ['2', '3', 'none']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bulb-count-${scenario.key}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'If bulb 1 is removed, how many bulbs will light up when the switch is closed?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Electrical circuit</strong></div>
        <svg viewBox="0 0 430 235" width="100%" height="235" style="display:block;margin-top:10px;">
          ${bulbCountCircuitSvg(scenario.key)}
        </svg>
        <div class="small center mt8">Treat the removed bulb as an open circuit at that position, then count the bulbs that still lie on a closed loop.</div>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: scenario.pattern,
  }
}

function mechanicalLogicGate(difficulty) {
  const answer = 'Only if A, B and C are active, D is active.'
  const options = shuffle([
    'If B and C are active, D is active.',
    'If A and C are active, D is active.',
    'If A and B are active, D is active.',
    answer,
    'None of the answers is correct.'
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-logic-gate',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'A logic gate uses two AND blocks as shown. Which input states make output D active?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 420 170" width="100%" height="170" style="display:block;margin-top:8px;">
          <circle cx="48" cy="42" r="16" fill="#e5e7eb" stroke="#475569" stroke-width="2"></circle>
          <circle cx="48" cy="84" r="16" fill="#e5e7eb" stroke="#475569" stroke-width="2"></circle>
          <circle cx="48" cy="126" r="16" fill="#e5e7eb" stroke="#475569" stroke-width="2"></circle>
          <text x="48" y="47" text-anchor="middle" font-size="14" font-weight="700" fill="#111827">A</text>
          <text x="48" y="89" text-anchor="middle" font-size="14" font-weight="700" fill="#111827">B</text>
          <text x="48" y="131" text-anchor="middle" font-size="14" font-weight="700" fill="#111827">C</text>
          <line x1="64" y1="42" x2="132" y2="42" stroke="#475569" stroke-width="4"></line>
          <line x1="64" y1="84" x2="132" y2="84" stroke="#475569" stroke-width="4"></line>
          <line x1="64" y1="126" x2="220" y2="126" stroke="#475569" stroke-width="4"></line>
          <rect x="132" y="22" width="74" height="82" rx="6" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"></rect>
          <text x="169" y="72" text-anchor="middle" font-size="32" font-weight="700" fill="#0f172a">&amp;</text>
          <line x1="206" y1="63" x2="256" y2="63" stroke="#475569" stroke-width="4"></line>
          <line x1="220" y1="126" x2="256" y2="126" stroke="#475569" stroke-width="4"></line>
          <rect x="256" y="78" width="74" height="82" rx="6" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"></rect>
          <text x="293" y="128" text-anchor="middle" font-size="32" font-weight="700" fill="#0f172a">&amp;</text>
          <line x1="330" y1="119" x2="372" y2="119" stroke="#475569" stroke-width="4"></line>
          <circle cx="388" cy="119" r="16" fill="#dcfce7" stroke="#16a34a" stroke-width="2"></circle>
          <text x="388" y="124" text-anchor="middle" font-size="14" font-weight="700" fill="#111827">D</text>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'The first AND gate needs A and B to be active. Its output then feeds a second AND gate together with C. Therefore D is active only when A, B and C are all active.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">First gate output = A AND B</div>
        <div class="formula-line">Final output D = (A AND B) AND C</div>
        <div class="formula-line">So D is active only if all three inputs are active.</div>
      </div>
    `,
    pattern: 'For logic-gate diagrams, resolve the gates stage by stage and use the first output as the next input.'
  }
}

function mechanicalGearRemoval(difficulty) {
  const answer = 'Gear 3'
  const options = shuffle(['Gear 1', 'Gear 2', 'Gear 3', 'Gear 4', 'None of the answers is correct.'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-gear-removal',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Gear A is the drive gear. Which gear must be removed so that all remaining gears can rotate?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 410 250" width="100%" height="230" style="display:block;margin-top:8px;">
          ${simpleGearSvg('A', 88, 176, 54, '#dbeafe')}
          ${simpleGearSvg('1', 158, 122, 30, '#e5e7eb')}
          ${simpleGearSvg('2', 248, 146, 56, '#e5e7eb')}
          ${simpleGearSvg('3', 230, 64, 36, '#e5e7eb')}
          ${simpleGearSvg('4', 340, 146, 28, '#e5e7eb')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Gears 1, 2 and 3 form an odd closed loop. That locks the train because the required directions conflict. Removing Gear 3 breaks that loop and leaves the chain A -> 1 -> 2 -> 4, so the remaining gears can rotate.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Odd closed gear loops lock because the direction reversals cannot be satisfied consistently.</div>
        <div class="formula-line">Gears 1, 2 and 3 create that locking loop.</div>
        <div class="formula-line">Remove Gear 3 and the remaining gears form one open train.</div>
      </div>
    `,
    pattern: 'If a gear layout contains an odd closed loop, the loop locks. Remove the gear that breaks the odd loop while keeping the rest connected.'
  }
}

function mechanicalParallelResistance(difficulty) {
  const scenarios = [
    {
      key: 'four-by-five',
      count: 4,
      resistance: 5,
      options: ['20 ohms', '15 ohms', '10 ohms', '5 ohms', 'None of the answers is correct.'],
      answer: 'None of the answers is correct.',
      explanation: 'Four identical 5-ohm resistors in parallel give 5 / 4 = 1.25 ohms, so none of the listed values is correct.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">For n identical resistors in parallel: R_total = R / n</div>
          <div class="formula-line">R_total = 5 / 4 = 1.25 ohms</div>
        </div>
      `,
    },
    {
      key: 'two-by-ten',
      count: 2,
      resistance: 10,
      options: ['20 ohms', '15 ohms', '10 ohms', '5 ohms', 'None of the answers is correct.'],
      answer: '5 ohms',
      explanation: 'Two identical 10-ohm resistors in parallel halve the resistance, so the total resistance is 5 ohms.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">R_total = 10 / 2 = 5 ohms</div>
        </div>
      `,
    },
    {
      key: 'three-by-six',
      count: 3,
      resistance: 6,
      options: ['18 ohms', '12 ohms', '6 ohms', '2 ohms', 'None of the answers is correct.'],
      answer: '2 ohms',
      explanation: 'Three identical 6-ohm resistors in parallel give 6 / 3 = 2 ohms.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">R_total = 6 / 3 = 2 ohms</div>
        </div>
      `,
    }
  ]
  const scenario = pick(scenarios)

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-parallel-resistance-${scenario.key}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'What is the total resistance of the circuit shown?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 420 230" width="100%" height="220" style="display:block;margin-top:8px;">
          ${parallelResistanceSvg(scenario.count, scenario.resistance)}
        </svg>
      </div>
    `,
    options: scenario.options.map(value => ({ text: value, plain: value })),
    correctIndex: scenario.options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'For identical resistors in parallel, the total resistance is the single resistance divided by the number of parallel branches.'
  }
}

function mechanicalBulbFailure(difficulty) {
  const scenarios = [
    {
      key: 'bulb-2-fails',
      prompt: 'In the circuit shown, bulbs 1, 2, 3 and 4 are lit. What happens if bulb 2 fails and goes out?',
      answer: 'Bulbs 3 and 4 also go out.',
      options: [
        'Bulbs 1, 3 and 4 also go out.',
        'Bulbs 3 and 4 glow brighter than before.',
        'Bulbs 1, 3 and 4 continue to glow unchanged.',
        'Bulbs 3 and 4 also go out.',
        'None of the answers is correct.'
      ],
      visualHtml: `
        <div class="chart">
          <svg viewBox="0 0 430 240" width="100%" height="225" style="display:block;margin-top:8px;">
            ${bulbFailureSeriesSvg()}
          </svg>
        </div>
      `,
      explanation: 'Bulb 2 sits in the top supply path feeding the branches for bulbs 3 and 4. When bulb 2 fails, that part of the circuit opens, so bulbs 3 and 4 lose power. Bulb 1 is still connected across the supply and remains lit.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Bulb 2 is on the supply path to bulbs 3 and 4.</div>
          <div class="formula-line">If bulb 2 fails, the top rail is broken beyond that point.</div>
          <div class="formula-line">Bulbs 3 and 4 no longer lie on a closed loop, so they go out.</div>
        </div>
      `,
    },
    {
      key: 'bulb-1-fails',
      prompt: 'In the circuit shown, bulbs are lit. What happens if bulb 1 fails and goes out?',
      answer: 'Only bulb 4 also goes out.',
      options: [
        'Only bulb 4 also goes out.',
        'Bulbs 4, 5 and 6 glow especially brightly.',
        'All the other lit bulbs continue glowing.',
        'All the lit bulbs go out.',
        'None of the answers is correct.'
      ],
      visualHtml: `
        <div class="chart">
          <svg viewBox="0 0 430 255" width="100%" height="235" style="display:block;margin-top:8px;">
            ${bulbFailureBranchSvg()}
          </svg>
        </div>
      `,
      explanation: 'Bulb 1 and bulb 4 share the same left branch. If bulb 1 fails, that branch opens and bulb 4 also loses its path. The branches for bulbs 2, 3, 5 and 6 still have complete loops and stay lit.',
      explanationHtml: `
        <div class="formula-block">
          <div class="formula-line">Bulbs 1 and 4 are on the same branch segment.</div>
          <div class="formula-line">An open bulb breaks that branch only.</div>
          <div class="formula-line">The other branches still connect top to bottom, so only bulb 4 also goes out.</div>
        </div>
      `,
    }
  ]
  const scenario = pick(scenarios)

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bulb-failure-${scenario.key}`,
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: scenario.prompt,
    visualHtml: scenario.visualHtml,
    options: scenario.options.map(value => ({ text: value, plain: value })),
    correctIndex: scenario.options.indexOf(scenario.answer),
    explanation: scenario.explanation,
    explanationHtml: scenario.explanationHtml,
    pattern: 'Treat a failed bulb as an open circuit. Then identify which branches still form a closed electrical loop.'
  }
}

function mechanicalDynamoBrightness(difficulty) {
  const answer = 'Max Meyer\'s lamp shines brightest.'
  const options = shuffle([
    'Mr Meyer\'s lamp shines brightest.',
    'Mrs Meyer\'s lamp shines brightest.',
    answer,
    'At the same riding speed, all lamps shine equally brightly.',
    'None of the answers is correct.'
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-dynamo-brightness',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'The Meyer family are cycling home. It is getting dark and everyone switches on a bottle dynamo. Whose lamp shines brightest if all ride at the same speed and their lighting systems are identical?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 520 220" width="100%" height="210" style="display:block;margin-top:8px;">
          ${dynamoBikeSvg(90, 160, 0.72, 'Max')}
          ${dynamoBikeSvg(255, 160, 1.02, 'Mrs Meyer')}
          ${dynamoBikeSvg(420, 160, 0.92, 'Mr Meyer')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'At the same forward speed, the smaller wheel turns faster. A bottle dynamo driven by the faster-spinning wheel also turns faster, so the smallest bicycle wheel produces the brightest lamp.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Wheel angular speed increases when wheel radius gets smaller.</div>
        <div class="formula-line">The bottle dynamo is driven by wheel rotation.</div>
        <div class="formula-line">So the smallest bicycle wheel gives the brightest lamp.</div>
      </div>
    `,
    pattern: 'At the same travel speed, smaller wheels rotate faster. Any dynamo linked to wheel rotation will also run faster.'
  }
}

function mechanicalSpringLoad(difficulty) {
  const answer = 'The springs 1-5'
  const options = shuffle([
    'The springs 6-10',
    answer,
    'The springs 3, 4 and 5',
    'The springs 1 and 2',
    'None of the answers is correct.'
  ])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-spring-load',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'In a spring system identical metal balls are suspended. Which of the massless springs are stretched the most?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 520 285" width="100%" height="255" style="display:block;margin-top:8px;">
          ${springLoadDiagramSvg()}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Each top spring 1-5 supports its own ball and the full weight hanging below through the lower spring. Each lower spring 6-10 supports only one ball. Therefore springs 1-5 are stretched the most.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Springs 6-10 each carry one ball.</div>
        <div class="formula-line">Springs 1-5 each carry two-ball weight: their own ball plus the lower hanging section.</div>
        <div class="formula-line">Greater force means greater extension, so springs 1-5 stretch most.</div>
      </div>
    `,
    pattern: 'For identical springs, the spring carrying the greatest force stretches the most. Trace the total hanging load below each spring.'
  }
}

function mechanicalGearFaster(difficulty) {
  const answer = 'Gear 3'
  const options = shuffle(['Gear 2', 'Gear 3', 'Gear 4', 'Gear 5', 'None of the answers is correct.'])

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-gear-faster',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which gear turns faster than gear 1?',
    visualHtml: `
      <div class="chart">
        <svg viewBox="0 0 420 245" width="100%" height="225" style="display:block;margin-top:8px;">
          ${simpleGearSvg('1', 204, 126, 30, '#dbeafe')}
          ${simpleGearSvg('2', 76, 126, 44, '#e5e7eb')}
          ${simpleGearSvg('', 136, 126, 14, '#f3f4f6')}
          ${simpleGearSvg('3', 204, 48, 18, '#e5e7eb')}
          ${simpleGearSvg('', 204, 86, 12, '#f3f4f6')}
          ${simpleGearSvg('4', 322, 126, 42, '#e5e7eb')}
          ${simpleGearSvg('', 272, 126, 20, '#f3f4f6')}
          ${simpleGearSvg('5', 204, 212, 30, '#e5e7eb')}
          ${simpleGearSvg('', 204, 174, 12, '#f3f4f6')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Idler gears only transfer motion and change direction; they do not change the speed ratio. Gear 3 is smaller than gear 1, so it turns faster. Gears 2 and 4 are larger, and gear 5 is the same size.',
    explanationHtml: `
      <div class="formula-block">
        <div class="formula-line">Smaller driven gear -> higher rotational speed.</div>
        <div class="formula-line">Equal-sized gears -> equal speed.</div>
        <div class="formula-line">Larger driven gear -> lower speed.</div>
      </div>
    `,
    pattern: 'Compare the size of the target gear with gear 1. Idlers change direction only; they do not change the speed ratio.'
  }
}

function simpleGearSvg(label, x, y, r, fill) {
  return `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#4b5563" stroke-width="3"></circle>
    <circle cx="${x}" cy="${y}" r="${Math.max(5, Math.round(r * 0.18))}" fill="#f8fafc" stroke="#6b7280" stroke-width="2"></circle>
    ${label ? `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="${Math.max(16, Math.round(r * 0.5))}" font-weight="700" fill="#111827">${label}</text>` : ''}
  `
}

function parallelResistanceSvg(count, resistance) {
  const branches = Array.from({ length: count }, (_, index) => {
    const y = 40 + index * 46
    return `
      <line x1="52" y1="${y}" x2="150" y2="${y}" stroke="#374151" stroke-width="4"></line>
      <rect x="150" y="${y - 14}" width="72" height="28" rx="14" fill="#f8fafc" stroke="#374151" stroke-width="3"></rect>
      <text x="186" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="700" fill="#111827">${resistance} O</text>
      <line x1="222" y1="${y}" x2="334" y2="${y}" stroke="#374151" stroke-width="4"></line>
    `
  }).join('')

  return `
    <line x1="52" y1="26" x2="52" y2="${40 + (count - 1) * 46 + 14}" stroke="#374151" stroke-width="4"></line>
    <line x1="334" y1="26" x2="334" y2="${40 + (count - 1) * 46 + 14}" stroke="#374151" stroke-width="4"></line>
    ${branches}
    <circle cx="52" cy="113" r="5" fill="#111827"></circle>
    <circle cx="334" cy="113" r="5" fill="#111827"></circle>
  `
}

function bulbFailureSeriesSvg() {
  const bulb = (cx, cy, label) => `
    <circle cx="${cx}" cy="${cy}" r="18" fill="#fef3c7" stroke="#92400e" stroke-width="3"></circle>
    <text x="${cx - 28}" y="${cy - 16}" text-anchor="middle" font-size="16" font-weight="700" fill="#111827">${label}</text>
  `

  return `
    <line x1="50" y1="36" x2="340" y2="36" stroke="#374151" stroke-width="4"></line>
    <line x1="50" y1="184" x2="340" y2="184" stroke="#374151" stroke-width="4"></line>
    <line x1="50" y1="36" x2="50" y2="184" stroke="#374151" stroke-width="4"></line>
    <line x1="120" y1="36" x2="120" y2="184" stroke="#374151" stroke-width="4"></line>
    <line x1="210" y1="36" x2="210" y2="184" stroke="#374151" stroke-width="4"></line>
    <line x1="300" y1="36" x2="300" y2="184" stroke="#374151" stroke-width="4"></line>
    <line x1="50" y1="20" x2="50" y2="36" stroke="#111827" stroke-width="4"></line>
    <line x1="62" y1="18" x2="62" y2="38" stroke="#111827" stroke-width="2"></line>
    <rect x="156" y="18" width="48" height="36" rx="18" fill="#fef3c7" stroke="#92400e" stroke-width="3"></rect>
    <text x="180" y="42" text-anchor="middle" font-size="16" font-weight="700" fill="#111827">2</text>
    ${bulb(120, 104, '1')}
    ${bulb(210, 104, '3')}
    ${bulb(300, 104, '4')}
  `
}

function bulbFailureBranchSvg() {
  const bulb = (cx, cy, label) => `
    <circle cx="${cx}" cy="${cy}" r="17" fill="#fef3c7" stroke="#92400e" stroke-width="3"></circle>
    <text x="${cx - 25}" y="${cy - 16}" text-anchor="middle" font-size="15" font-weight="700" fill="#111827">${label}</text>
  `

  return `
    <line x1="42" y1="38" x2="360" y2="38" stroke="#374151" stroke-width="4"></line>
    <line x1="42" y1="210" x2="360" y2="210" stroke="#374151" stroke-width="4"></line>
    <line x1="42" y1="38" x2="42" y2="210" stroke="#374151" stroke-width="4"></line>
    <line x1="42" y1="22" x2="42" y2="38" stroke="#111827" stroke-width="4"></line>
    <line x1="54" y1="20" x2="54" y2="40" stroke="#111827" stroke-width="2"></line>
    <line x1="120" y1="38" x2="120" y2="130" stroke="#374151" stroke-width="4"></line>
    <line x1="210" y1="38" x2="210" y2="130" stroke="#374151" stroke-width="4"></line>
    <line x1="300" y1="38" x2="300" y2="130" stroke="#374151" stroke-width="4"></line>
    <line x1="120" y1="130" x2="300" y2="130" stroke="#374151" stroke-width="4"></line>
    <line x1="120" y1="130" x2="120" y2="210" stroke="#374151" stroke-width="4"></line>
    <line x1="210" y1="130" x2="210" y2="210" stroke="#374151" stroke-width="4"></line>
    <line x1="300" y1="130" x2="300" y2="210" stroke="#374151" stroke-width="4"></line>
    ${bulb(120, 86, '1')}
    ${bulb(210, 86, '2')}
    ${bulb(300, 86, '3')}
    ${bulb(120, 170, '4')}
    ${bulb(210, 170, '5')}
    ${bulb(300, 170, '6')}
  `
}

function dynamoBikeSvg(cx, baselineY, scale, label) {
  const rearR = Math.round(28 * scale)
  const frontR = Math.round(26 * scale)
  const wheelY = baselineY - rearR
  const frameY = wheelY - Math.round(24 * scale)
  return `
    <circle cx="${cx - 30 * scale}" cy="${wheelY}" r="${rearR}" fill="none" stroke="#374151" stroke-width="3"></circle>
    <circle cx="${cx + 34 * scale}" cy="${wheelY}" r="${frontR}" fill="none" stroke="#374151" stroke-width="3"></circle>
    <line x1="${cx - 30 * scale}" y1="${wheelY}" x2="${cx}" y2="${frameY}" stroke="#111827" stroke-width="3"></line>
    <line x1="${cx}" y1="${frameY}" x2="${cx + 18 * scale}" y2="${wheelY - 8 * scale}" stroke="#111827" stroke-width="3"></line>
    <line x1="${cx + 18 * scale}" y1="${wheelY - 8 * scale}" x2="${cx - 6 * scale}" y2="${wheelY - 2 * scale}" stroke="#111827" stroke-width="3"></line>
    <line x1="${cx - 6 * scale}" y1="${wheelY - 2 * scale}" x2="${cx - 30 * scale}" y2="${wheelY}" stroke="#111827" stroke-width="3"></line>
    <line x1="${cx}" y1="${frameY}" x2="${cx + 40 * scale}" y2="${frameY - 12 * scale}" stroke="#111827" stroke-width="3"></line>
    <line x1="${cx + 38 * scale}" y1="${frameY - 12 * scale}" x2="${cx + 52 * scale}" y2="${frameY - 18 * scale}" stroke="#111827" stroke-width="3"></line>
    <circle cx="${cx + 22 * scale}" cy="${wheelY - 18 * scale}" r="${Math.max(4, Math.round(4 * scale))}" fill="#111827"></circle>
    <line x1="${cx + 22 * scale}" y1="${wheelY - 18 * scale}" x2="${cx + 26 * scale}" y2="${wheelY - frontR}" stroke="#111827" stroke-width="3"></line>
    <circle cx="${cx + 52 * scale}" cy="${frameY - 18 * scale}" r="${Math.max(5, Math.round(5 * scale))}" fill="#fef3c7" stroke="#92400e" stroke-width="2"></circle>
    <text x="${cx}" y="${baselineY + 24}" text-anchor="middle" font-size="14" font-weight="600" fill="#111827">${label}</text>
  `
}

function springElementSvg(cx, topY, bottomY, label, drawBall) {
  const segments = 7
  const step = (bottomY - topY - 20) / segments
  let d = `M ${cx} ${topY}`
  for (let index = 0; index < segments; index += 1) {
    const y = topY + 10 + index * step
    const x = cx + (index % 2 === 0 ? -8 : 8)
    d += ` L ${x} ${y}`
  }
  d += ` L ${cx} ${bottomY - 10}`
  return `
    <text x="${cx - 18}" y="${topY + 16}" text-anchor="middle" font-size="15" font-weight="700" fill="#111827">${label}</text>
    <line x1="${cx}" y1="${topY - 10}" x2="${cx}" y2="${topY}" stroke="#374151" stroke-width="3"></line>
    <path d="${d}" fill="none" stroke="#64748b" stroke-width="3"></path>
    <line x1="${cx}" y1="${bottomY - 10}" x2="${cx}" y2="${bottomY}" stroke="#374151" stroke-width="3"></line>
    ${drawBall ? `<circle cx="${cx}" cy="${bottomY + 22}" r="18" fill="#111827"></circle>` : ''}
  `
}

function springLoadDiagramSvg() {
  const top = [90, 170, 250, 330, 410].map((x, index) => springElementSvg(x, 28, 88, String(index + 1), true)).join('')
  const bottom = [90, 170, 250, 330, 410].map((x, index) => springElementSvg(x, 136, 196, String(index + 6), true)).join('')
  return `
    <line x1="48" y1="18" x2="452" y2="18" stroke="#374151" stroke-width="4"></line>
    ${top}
    ${bottom}
  `
}
function barLockDiagramSvg(blockingLabel) {
  const wedges = {
    1: { x: blockingLabel === '1' ? 270 : 244, y: 58 },
    2: { x: blockingLabel === '2' ? 164 : 136, y: 58 },
    3: { x: blockingLabel === '3' ? 218 : 248, y: 126 },
  }

  return `
    <rect x="46" y="84" width="28" height="36" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"></rect>
    <rect x="74" y="92" width="238" height="20" rx="3" fill="#d1d5db" stroke="#374151" stroke-width="3"></rect>
    <rect x="156" y="82" width="16" height="10" fill="#9ca3af" stroke="#111827" stroke-width="2"></rect>
    <rect x="262" y="82" width="16" height="10" fill="#9ca3af" stroke="#111827" stroke-width="2"></rect>
    <rect x="212" y="112" width="16" height="10" fill="#9ca3af" stroke="#111827" stroke-width="2"></rect>
    <circle cx="180" cy="102" r="5" fill="#f8fafc" stroke="#6b7280" stroke-width="2"></circle>
    <circle cx="236" cy="102" r="5" fill="#f8fafc" stroke="#6b7280" stroke-width="2"></circle>
    <rect x="314" y="60" width="10" height="104" fill="#111827"></rect>
    <rect x="346" y="48" width="8" height="128" fill="#6b7280"></rect>
    <rect x="324" y="86" width="22" height="24" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"></rect>
    <rect x="324" y="114" width="22" height="24" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"></rect>
    <rect x="360" y="88" width="16" height="40" fill="#111827"></rect>
    <rect x="${wedges[1].x}" y="${wedges[1].y}" width="16" height="26" fill="#111827"></rect>
    <rect x="${wedges[2].x}" y="${wedges[2].y}" width="16" height="26" fill="#111827"></rect>
    <rect x="${wedges[3].x}" y="${wedges[3].y}" width="16" height="26" fill="#111827"></rect>
    <text x="172" y="52" text-anchor="middle" font-size="17" font-weight="700">2</text>
    <text x="278" y="52" text-anchor="middle" font-size="17" font-weight="700">1</text>
    <text x="226" y="162" text-anchor="middle" font-size="17" font-weight="700">3</text>
    <text x="190" y="140" text-anchor="middle" font-size="18" font-weight="700">A</text>
    <text x="319" y="182" text-anchor="middle" font-size="18" font-weight="700">B</text>
    <text x="350" y="182" text-anchor="middle" font-size="18" font-weight="700">C</text>
    <path d="M 120 154 L 94 154 L 102 148 M 94 154 L 102 160" fill="none" stroke="#111827" stroke-width="3"></path>
    <path d="M 250 176 L 292 176 L 284 170 M 292 176 L 284 182" fill="none" stroke="#111827" stroke-width="3"></path>
  `
}

function bulbCountCircuitSvg(mode) {
  const bulbs = `
    ${countCircuitBulbSvg(96, 126, '1')}
    ${countCircuitBulbSvg(170, 70, '2')}
    ${countCircuitBulbSvg(266, 70, '3')}
    ${countCircuitBulbSvg(334, 126, '4')}
  `
  const base = `
    <line x1="94" y1="194" x2="156" y2="194" stroke="#111827" stroke-width="4"></line>
    <line x1="170" y1="184" x2="170" y2="204" stroke="#111827" stroke-width="3"></line>
    <line x1="182" y1="180" x2="182" y2="208" stroke="#111827" stroke-width="5"></line>
    <line x1="182" y1="194" x2="244" y2="194" stroke="#111827" stroke-width="4"></line>
    <line x1="244" y1="194" x2="270" y2="194" stroke="#111827" stroke-width="4"></line>
    <line x1="284" y1="188" x2="306" y2="194" stroke="#111827" stroke-width="4"></line>
    <line x1="306" y1="194" x2="336" y2="194" stroke="#111827" stroke-width="4"></line>
  `

  if (mode === 'open-series') {
    return `
      ${base}
      <line x1="96" y1="194" x2="96" y2="144" stroke="#111827" stroke-width="4"></line>
      <line x1="96" y1="108" x2="96" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="96" y1="76" x2="154" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="186" y1="76" x2="250" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="282" y1="76" x2="334" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="334" y1="76" x2="334" y2="108" stroke="#111827" stroke-width="4"></line>
      <line x1="334" y1="144" x2="334" y2="194" stroke="#111827" stroke-width="4"></line>
      <line x1="96" y1="194" x2="210" y2="118" stroke="#6b7280" stroke-width="3"></line>
      <line x1="334" y1="194" x2="210" y2="118" stroke="#6b7280" stroke-width="3"></line>
      <circle cx="210" cy="118" r="4" fill="#111827"></circle>
      ${bulbs}
    `
  }

  if (mode === 'two-live') {
    return `
      ${base}
      <line x1="96" y1="194" x2="96" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="96" y1="76" x2="154" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="186" y1="76" x2="238" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="238" y1="76" x2="334" y2="108" stroke="#111827" stroke-width="4"></line>
      <line x1="334" y1="144" x2="334" y2="194" stroke="#111827" stroke-width="4"></line>
      <line x1="96" y1="126" x2="150" y2="118" stroke="#6b7280" stroke-width="3"></line>
      <line x1="112" y1="126" x2="188" y2="126" stroke="#6b7280" stroke-width="3"></line>
      <line x1="250" y1="76" x2="250" y2="54" stroke="#111827" stroke-width="4"></line>
      <line x1="282" y1="76" x2="312" y2="76" stroke="#111827" stroke-width="4"></line>
      <line x1="312" y1="76" x2="312" y2="96" stroke="#111827" stroke-width="4"></line>
      ${bulbs}
    `
  }

  return `
    ${base}
    <line x1="96" y1="194" x2="96" y2="76" stroke="#111827" stroke-width="4"></line>
    <line x1="96" y1="76" x2="154" y2="76" stroke="#111827" stroke-width="4"></line>
    <line x1="186" y1="76" x2="250" y2="76" stroke="#111827" stroke-width="4"></line>
    <line x1="282" y1="76" x2="334" y2="76" stroke="#111827" stroke-width="4"></line>
    <line x1="334" y1="76" x2="334" y2="108" stroke="#111827" stroke-width="4"></line>
    <line x1="334" y1="144" x2="334" y2="194" stroke="#111827" stroke-width="4"></line>
    <line x1="96" y1="126" x2="140" y2="112" stroke="#6b7280" stroke-width="3"></line>
    <line x1="112" y1="126" x2="168" y2="126" stroke="#6b7280" stroke-width="3"></line>
    ${bulbs}
  `
}

function countCircuitBulbSvg(cx, cy, label) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="18" fill="#ffffff" stroke="#111827" stroke-width="3"></circle>
      <path d="M ${cx - 8} ${cy} Q ${cx} ${cy - 10} ${cx + 8} ${cy}" fill="none" stroke="#6b7280" stroke-width="2"></path>
      <text x="${cx}" y="${cy - 26}" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}
function gearPairText(pair) {
  return pair.filter(Boolean).map(value => String(value)).join(' and ')
}

function gearCogSvg(cx, cy, r, label) {
  const teeth = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * Math.PI * 2) / 12
    const x1 = cx + Math.cos(angle) * (r + 2)
    const y1 = cy + Math.sin(angle) * (r + 2)
    const x2 = cx + Math.cos(angle) * (r + 9)
    const y2 = cy + Math.sin(angle) * (r + 9)
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#a3a3a3" stroke-width="4"></line>`
  }).join('')

  return `
    <g>
      ${teeth}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#d4d4d8" stroke="#737373" stroke-width="3"></circle>
      <circle cx="${cx}" cy="${cy}" r="${Math.max(5, r / 4)}" fill="#94a3b8"></circle>
      <text x="${cx - r - 10}" y="${cy - r + 4}" font-size="16" font-weight="700" fill="#111827">${label}</text>
    </g>
  `
}

function beltPulleySvg(cx, cy, r, label) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f3f4f6" stroke="#111827" stroke-width="4"></circle>
      <circle cx="${cx}" cy="${cy}" r="${Math.max(4, r / 5)}" fill="#9ca3af"></circle>
      ${label ? `<text x="${cx + r + 10}" y="${cy - r + 6}" font-size="16" font-weight="700">${label}</text>` : ''}
    </g>
  `
}
function ropeSlipSvg(cx, label, wraps) {
  const loops = Math.round(wraps)
  const ropeLines = Array.from({ length: loops }, (_, index) => {
    const y = 56 + index * 18
    return `<path d="M ${cx - 34} ${y} C ${cx - 6} ${y - 16}, ${cx + 6} ${y - 16}, ${cx + 26} ${y} C ${cx + 8} ${y + 18}, ${cx - 8} ${y + 18}, ${cx - 24} ${y}" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round"></path>`
  }).join('')

  return `
    <g>
      <path d="M ${cx - 8} 20 Q ${cx} 6 ${cx + 12} 20" fill="none" stroke="#6b7280" stroke-width="8"></path>
      <line x1="${cx + 2}" y1="22" x2="${cx + 2}" y2="150" stroke="#6b7280" stroke-width="8"></line>
      ${ropeLines}
      <line x1="${cx + 2}" y1="142" x2="${cx + 2}" y2="182" stroke="#111827" stroke-width="6"></line>
      <rect x="${cx - 34}" y="182" width="72" height="22" fill="#d1d5db" stroke="#737373" stroke-width="2"></rect>
      <text x="${cx + 28}" y="42" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function bulbCircuitOptionSvg(cx, label, type) {
  const leftTerminal = cx - 18
  const rightTerminal = cx + 18
  const bulbBaseY = 92
  const bulbTipY = 126
  const wireA = type === 'correct'
    ? `<path d="M ${leftTerminal} 174 C ${leftTerminal - 22} 132, ${cx - 40} 112, ${cx - 18} 92" fill="none" stroke="#111827" stroke-width="5"></path>`
    : type === 'same-contact'
    ? `<path d="M ${leftTerminal} 174 C ${leftTerminal - 10} 146, ${cx - 10} 140, ${cx - 8} 112" fill="none" stroke="#111827" stroke-width="5"></path>`
    : `<path d="M ${leftTerminal} 174 C ${leftTerminal - 20} 144, ${cx - 52} 110, ${cx - 48} 78" fill="none" stroke="#111827" stroke-width="5"></path>`
  const wireB = type === 'correct'
    ? `<path d="M ${rightTerminal} 174 C ${rightTerminal + 8} 154, ${cx + 6} 142, ${cx} ${bulbTipY}" fill="none" stroke="#111827" stroke-width="5"></path>`
    : type === 'same-contact'
    ? `<path d="M ${rightTerminal} 174 C ${rightTerminal + 14} 146, ${cx + 24} 120, ${cx + 8} 108" fill="none" stroke="#111827" stroke-width="5"></path>`
    : `<path d="M ${rightTerminal} 174 C ${rightTerminal + 14} 154, ${cx + 30} 140, ${cx + 24} 110" fill="none" stroke="#111827" stroke-width="5"></path>`

  return `
    <g>
      <text x="${cx}" y="20" text-anchor="middle" font-size="18" font-weight="700">${label}</text>
      <rect x="${cx - 24}" y="150" width="48" height="56" fill="#d1d5db" stroke="#737373" stroke-width="3"></rect>
      <rect x="${leftTerminal - 5}" y="142" width="10" height="8" fill="#737373"></rect>
      <rect x="${rightTerminal - 5}" y="142" width="10" height="8" fill="#737373"></rect>
      <ellipse cx="${cx}" cy="56" rx="26" ry="30" fill="none" stroke="#111827" stroke-width="4"></ellipse>
      <rect x="${cx - 11}" y="84" width="22" height="16" rx="4" fill="#d1d5db" stroke="#111827" stroke-width="3"></rect>
      <circle cx="${cx}" cy="${bulbTipY}" r="4" fill="#111827"></circle>
      <path d="M ${cx - 12} 84 Q ${cx} 74 ${cx + 12} 84" fill="none" stroke="#111827" stroke-width="3"></path>
      ${wireA}
      ${wireB}
    </g>
  `
}
function carSvg(x, y, scale) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <path d="M0 20 Q12 4 32 4 L52 4 Q63 4 70 15 L74 22 L74 28 L0 28 Z" fill="#27272a"></path>
      <rect x="18" y="8" width="16" height="8" fill="#f8fafc"></rect>
      <rect x="38" y="8" width="16" height="8" fill="#f8fafc"></rect>
      <circle cx="18" cy="29" r="6" fill="#111827"></circle>
      <circle cx="56" cy="29" r="6" fill="#111827"></circle>
    </g>
  `
}

function jarSvg(cx, scale, hasHoles, label) {
  const w = 46 * scale
  const h = 86 * scale
  const x = cx - w / 2
  const y = 44
  return `
    <g>
      <ellipse cx="${cx}" cy="${y + h}" rx="${32 * scale}" ry="${10 * scale}" fill="#3f3f46"></ellipse>
      <path d="M${x} ${y + h} Q${cx} ${y + h - 6 * scale} ${x + w} ${y + h} L${x + w - 4 * scale} ${y + 18 * scale} Q${cx} ${y - 8 * scale} ${x + 4 * scale} ${y + 18 * scale} Z" fill="rgba(255,255,255,0.2)" stroke="#2f2f2f" stroke-width="3"></path>
      <rect x="${cx - 9 * scale}" y="${y + 34 * scale}" width="${18 * scale}" height="${34 * scale}" fill="#9ca3af"></rect>
      <path d="M${cx} ${y + 26 * scale} Q${cx - 4 * scale} ${y + 36 * scale} ${cx} ${y + 44 * scale} Q${cx + 4 * scale} ${y + 36 * scale} ${cx} ${y + 26 * scale}" fill="#f8fafc"></path>
      ${hasHoles ? `<circle cx="${cx - 13 * scale}" cy="${y + 18 * scale}" r="${3 * scale}" fill="#111827"></circle><circle cx="${cx + 13 * scale}" cy="${y + 18 * scale}" r="${3 * scale}" fill="#111827"></circle>` : ''}
      <text x="${cx}" y="${y + h + 22}" text-anchor="middle" font-size="16">${label}</text>
    </g>
  `
}

function simpleMechanicalBulbSvg(cx, cy, label) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy - 14}" r="16" fill="#ffffff" stroke="#111827" stroke-width="3"></circle>
      <rect x="${cx - 8}" y="${cy - 2}" width="16" height="10" rx="2" fill="#d1d5db" stroke="#111827" stroke-width="2"></rect>
      <path d="M ${cx - 8} ${cy - 14} Q ${cx} ${cy - 24} ${cx + 8} ${cy - 14}" fill="none" stroke="#6b7280" stroke-width="2"></path>
      <text x="${cx + 20}" y="${cy - 8}" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function drainSealSvg(cx, label, pressureSeals) {
  const tankY = 54
  const plugTop = pressureSeals ? 156 : 126
  const plugBottom = pressureSeals ? 126 : 156
  return `
    <g>
      <rect x="${cx - 60}" y="${tankY}" width="120" height="78" fill="#f8fafc" stroke="#475569" stroke-width="3"></rect>
      <line x1="${cx - 60}" y1="${tankY + 26}" x2="${cx + 60}" y2="${tankY + 26}" stroke="#cbd5e1" stroke-width="2"></line>
      <line x1="${cx}" y1="${tankY + 78}" x2="${cx}" y2="${tankY + 102}" stroke="#111827" stroke-width="4"></line>
      <polygon points="${cx - 12},${plugTop} ${cx + 12},${plugTop} ${cx + 7},${plugBottom} ${cx - 7},${plugBottom}" fill="#d4a514" stroke="#111827" stroke-width="2"></polygon>
      <text x="${cx}" y="${tankY + 118}" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function doorstopCompareSvg(cx, label, shallow) {
  const tipX = cx + 18
  const baseX = cx - (shallow ? 34 : 18)
  return `
    <g>
      <line x1="${cx - 54}" y1="158" x2="${cx + 54}" y2="158" stroke="#6b7280" stroke-width="4"></line>
      <rect x="${cx + 12}" y="82" width="36" height="76" fill="#f8fafc" stroke="#111827" stroke-width="3"></rect>
      <polygon points="${baseX},158 ${tipX},158 ${tipX},140" fill="#d1d5db" stroke="#111827" stroke-width="2"></polygon>
      <path d="M ${tipX} 140 L ${baseX} 158" stroke="#111827" stroke-width="2"></path>
      <text x="${cx}" y="186" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function reflectorLampSvg(cx, label, width) {
  const half = width / 2
  return `
    <g>
      <path d="M ${cx - half} 72 Q ${cx + 8} 104 ${cx - half} 136" fill="none" stroke="#6b7280" stroke-width="4"></path>
      <line x1="${cx - half}" y1="72" x2="${cx - half}" y2="136" stroke="#6b7280" stroke-width="4"></line>
      <circle cx="${cx - half + 28}" cy="104" r="8" fill="#111827"></circle>
      <path d="M ${cx - half + 28} 104 C ${cx - half + 58} 94 ${cx - half + 80} 94 ${cx - half + 102} 104" fill="none" stroke="#cbd5e1" stroke-width="3" opacity="0.8"></path>
      <path d="M ${cx - half + 28} 104 C ${cx - half + 56} 84 ${cx - half + 84} 74 ${cx - half + width} 64" fill="none" stroke="#e2e8f0" stroke-width="3" opacity="0.7"></path>
      <path d="M ${cx - half + 28} 104 C ${cx - half + 56} 124 ${cx - half + 84} 134 ${cx - half + width} 144" fill="none" stroke="#e2e8f0" stroke-width="3" opacity="0.7"></path>
      <text x="${cx - half + 18}" y="52" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function drumSvg(cx, cy, radius, label) {
  return `
    <g>
      <ellipse cx="${cx}" cy="${cy - 30}" rx="${radius}" ry="10" fill="#f8fafc" stroke="#111827" stroke-width="3"></ellipse>
      <line x1="${cx - radius}" y1="${cy - 30}" x2="${cx - radius}" y2="${cy + 18}" stroke="#111827" stroke-width="3"></line>
      <line x1="${cx + radius}" y1="${cy - 30}" x2="${cx + radius}" y2="${cy + 18}" stroke="#111827" stroke-width="3"></line>
      <ellipse cx="${cx}" cy="${cy + 18}" rx="${radius}" ry="10" fill="#ffffff" stroke="#111827" stroke-width="3"></ellipse>
      ${Array.from({ length: 5 }, (_, index) => {
        const x = cx - radius + 10 + index * ((radius * 2 - 20) / 4)
        return `<line x1="${x}" y1="${cy - 24}" x2="${x + 10}" y2="${cy + 10}" stroke="#6b7280" stroke-width="2"></line>`
      }).join('')}
      <text x="${cx + radius + 8}" y="${cy - 24}" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function shelfBracketSvg(cx, label, height) {
  return `
    <g>
      <line x1="${cx - 36}" y1="54" x2="${cx - 36}" y2="150" stroke="#111827" stroke-width="4"></line>
      <line x1="${cx - 36}" y1="110" x2="${cx + 24}" y2="110" stroke="#111827" stroke-width="4"></line>
      <line x1="${cx - 36}" y1="${110 - height}" x2="${cx + 20}" y2="110" stroke="#6b7280" stroke-width="4"></line>
      <line x1="${cx - 36}" y1="150" x2="${cx + 10}" y2="110" stroke="#9ca3af" stroke-width="3"></line>
      <text x="${cx - 8}" y="174" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function fanBladeSvg(cx, cy) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="16" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>
      <path d="M ${cx} ${cy - 12} C ${cx + 18} ${cy - 26} ${cx + 28} ${cy - 6} ${cx + 8} ${cy - 2} Z" fill="#d1d5db" stroke="#111827" stroke-width="2"></path>
      <path d="M ${cx + 12} ${cy} C ${cx + 28} ${cy + 16} ${cx + 10} ${cy + 30} ${cx + 2} ${cy + 10} Z" fill="#d1d5db" stroke="#111827" stroke-width="2"></path>
      <path d="M ${cx - 8} ${cy + 8} C ${cx - 24} ${cy + 22} ${cx - 34} ${cy + 4} ${cx - 10} ${cy} Z" fill="#d1d5db" stroke="#111827" stroke-width="2"></path>
    </g>
  `
}

function wattBulbSvg(cx, cy, size, label, watts) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy - size * 0.6}" r="${size * 0.55}" fill="#e5e7eb" stroke="#111827" stroke-width="3"></circle>
      <rect x="${cx - size * 0.22}" y="${cy - size * 0.15}" width="${size * 0.44}" height="${size * 0.26}" rx="3" fill="#d1d5db" stroke="#111827" stroke-width="2"></rect>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" font-weight="700">${watts} WATT</text>
      ${label ? `<text x="${cx + size * 0.6}" y="${cy - size * 0.9}" font-size="16" font-weight="700">${label}</text>` : ''}
    </g>
  `
}

function stepLadderSvg(cx, width, label) {
  return `
    <g>
      <line x1="${cx}" y1="52" x2="${cx - width / 2}" y2="162" stroke="#111827" stroke-width="4"></line>
      <line x1="${cx}" y1="52" x2="${cx + width / 2}" y2="162" stroke="#111827" stroke-width="4"></line>
      <line x1="${cx - 12}" y1="58" x2="${cx - width / 2 + 12}" y2="162" stroke="#6b7280" stroke-width="4"></line>
      ${Array.from({ length: 5 }, (_, index) => {
        const y = 76 + index * 18
        const left = cx - 8 - index * (width / 12)
        const right = cx - width / 2 + 16 + index * (width / 18)
        return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y + 8}" stroke="#9ca3af" stroke-width="2"></line>`
      }).join('')}
      <text x="${cx}" y="188" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function rankPulleySvg(cx, label, segments) {
  const x = cx
  return `
    <g>
      <line x1="${x - 42}" y1="28" x2="${x + 42}" y2="28" stroke="#111827" stroke-width="6"></line>
      <circle cx="${x}" cy="54" r="12" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>
      ${segments > 2 ? `<circle cx="${x}" cy="98" r="12" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>` : ''}
      ${Array.from({ length: segments }, (_, index) => {
        const lineX = x - (segments - 1) * 8 + index * 16
        const endY = segments > 2 ? 136 : 128
        return `<line x1="${lineX}" y1="66" x2="${lineX}" y2="${endY}" stroke="#111827" stroke-width="3"></line>`
      }).join('')}
      <rect x="${x - 16}" y="${segments > 2 ? 136 : 128}" width="32" height="22" fill="#d1d5db" stroke="#111827" stroke-width="2"></rect>
      <path d="M ${x - 30} ${segments > 2 ? 82 : 72} L ${x - 48} ${segments > 2 ? 122 : 112}" stroke="#111827" stroke-width="3"></path>
      <polygon points="${x - 48},${segments > 2 ? 122 : 112} ${x - 58},${segments > 2 ? 116 : 106} ${x - 48},${segments > 2 ? 132 : 122}" fill="#111827"></polygon>
      <text x="${x}" y="190" text-anchor="middle" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function balanceScaleSvg(cx, label, sliderOffset) {
  return `
    <g>
      <rect x="${cx - 26}" y="22" width="52" height="8" fill="#111827"></rect>
      <line x1="${cx}" y1="30" x2="${cx}" y2="56" stroke="#6b7280" stroke-width="3"></line>
      <line x1="${cx - 26}" y1="56" x2="${cx + 36}" y2="56" stroke="#111827" stroke-width="4"></line>
      <rect x="${cx - 8 + sliderOffset / 4}" y="50" width="12" height="12" fill="#111827"></rect>
      <line x1="${cx - 10}" y1="56" x2="${cx - 10}" y2="92" stroke="#6b7280" stroke-width="3"></line>
      <line x1="${cx - 10}" y1="92" x2="${cx - 22}" y2="116" stroke="#6b7280" stroke-width="2"></line>
      <line x1="${cx - 10}" y1="92" x2="${cx + 2}" y2="116" stroke="#6b7280" stroke-width="2"></line>
      <line x1="${cx - 22}" y1="116" x2="${cx + 2}" y2="116" stroke="#6b7280" stroke-width="2"></line>
      <rect x="${cx - 22}" y="116" width="24" height="24" fill="#d1d5db" stroke="#111827" stroke-width="2"></rect>
      ${Array.from({ length: 2 }, (_, r) => Array.from({ length: 2 }, (_, c) => `<rect x="${cx - 18 + c * 10}" y="${120 + r * 10}" width="6" height="6" fill="#9ca3af"></rect>`).join('')).join('')}
      <text x="${cx + 34}" y="64" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function chainLoadSvg(cx, label, topY) {
  return `
    <g>
      <rect x="${cx - 34}" y="46" width="10" height="112" fill="#111827"></rect>
      <line x1="${cx - 24}" y1="${topY}" x2="${cx + 26}" y2="112" stroke="#9ca3af" stroke-width="3" stroke-dasharray="4 4"></line>
      <line x1="${cx - 24}" y1="112" x2="${cx + 26}" y2="112" stroke="#111827" stroke-width="3"></line>
      <line x1="${cx - 24}" y1="158" x2="${cx + 26}" y2="112" stroke="#111827" stroke-width="3"></line>
      <text x="${cx - 2}" y="102" font-size="16" font-weight="700">${label}</text>
    </g>
  `
}

function mechanicalBulbBypass(difficulty) {
  const switchedBranch = pick(['A', 'B'])
  const answer = switchedBranch === 'A' ? 'B' : 'A'
  const options = ['A', 'B', 'neither']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bulb-bypass-${switchedBranch}`,
    familyKey: 'mechanical-bulb-bypass',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which bulb can continue to glow when the switch is opened?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Bulb and switch circuit</strong></div>
        <svg viewBox="0 0 420 210" width="100%" height="210" style="display:block;margin-top:10px;">
          <line x1="80" y1="165" x2="154" y2="165" stroke="#111827" stroke-width="4"></line>
          <line x1="168" y1="156" x2="168" y2="174" stroke="#111827" stroke-width="3"></line>
          <line x1="180" y1="150" x2="180" y2="180" stroke="#111827" stroke-width="5"></line>
          <line x1="180" y1="165" x2="338" y2="165" stroke="#111827" stroke-width="4"></line>
          <line x1="80" y1="165" x2="80" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="338" y1="165" x2="338" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="80" y1="70" x2="130" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="288" y1="70" x2="338" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="210" y1="70" x2="210" y2="165" stroke="#111827" stroke-width="4"></line>
          <line x1="130" y1="70" x2="154" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="184" y1="70" x2="210" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="236" y1="70" x2="262" y2="70" stroke="#111827" stroke-width="4"></line>
          <line x1="292" y1="70" x2="338" y2="70" stroke="#111827" stroke-width="4"></line>
          ${switchedBranch === 'A'
            ? `<line x1="154" y1="70" x2="172" y2="62" stroke="#111827" stroke-width="4"></line><line x1="184" y1="70" x2="172" y2="62" stroke="#111827" stroke-width="4"></line>`
            : `<line x1="262" y1="70" x2="280" y2="62" stroke="#111827" stroke-width="4"></line><line x1="292" y1="70" x2="280" y2="62" stroke="#111827" stroke-width="4"></line>`
          }
          ${simpleMechanicalBulbSvg(170, 70, 'A')}
          ${simpleMechanicalBulbSvg(276, 70, 'B')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Opening the switch breaks only bulb ${switchedBranch}'s branch. Bulb ${answer} still has a complete closed path through the battery, so it can stay lit.`,
    pattern: 'In parallel circuits, opening one branch does not kill another branch that still has a complete loop.',
  }
}

function mechanicalDrainSeal(difficulty) {
  const answer = pick(['A', 'B'])
  const options = ['A', 'B', 'No difference']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-drain-seal-${answer}`,
    familyKey: 'mechanical-drain-seal',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which drain is less likely to leak?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Drain stopper comparison</strong></div>
        <svg viewBox="0 0 420 210" width="100%" height="210" style="display:block;margin-top:10px;">
          ${drainSealSvg(120, 'A', answer === 'A')}
          ${drainSealSvg(300, 'B', answer === 'B')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Drain ${answer} is less likely to leak because the water pressure pushes its tapered stopper more firmly into the opening rather than tending to lift it away.`,
    pattern: 'If fluid pressure pushes a stopper deeper into its seat, the seal is usually stronger.',
  }
}

function mechanicalWinchDirection(difficulty) {
  const answer = pick(['A', 'B'])
  const options = ['A', 'B', 'either']
  const wrapOverTop = answer === 'A'

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-winch-direction-${answer}`,
    familyKey: 'mechanical-winch-direction',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'In which direction should the handle be turned in order to pull the boat onto the trailer?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Boat winch</strong></div>
        <svg viewBox="0 0 430 200" width="100%" height="200" style="display:block;margin-top:10px;">
          <path d="M40 62 C82 48 118 58 166 42" fill="none" stroke="#94a3b8" stroke-width="4"></path>
          <polygon points="166,42 154,38 157,50" fill="#94a3b8"></polygon>
          <rect x="120" y="120" width="170" height="10" fill="#6b7280"></rect>
          <rect x="182" y="72" width="66" height="40" rx="8" fill="#d1d5db" stroke="#475569" stroke-width="3"></rect>
          <circle cx="215" cy="92" r="18" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>
          <circle cx="250" cy="92" r="6" fill="#111827"></circle>
          <line x1="250" y1="92" x2="274" y2="76" stroke="#111827" stroke-width="4"></line>
          <circle cx="278" cy="74" r="7" fill="#111827"></circle>
          <path d="M 215 ${wrapOverTop ? 74 : 110} C 164 ${wrapOverTop ? 62 : 120}, 124 ${wrapOverTop ? 58 : 132}, 90 ${wrapOverTop ? 50 : 136}" fill="none" stroke="#334155" stroke-width="4"></path>
          <path d="M 221 48 C 202 62 202 88 220 102" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="218,42 207,49 219,55" fill="#111827"></polygon>
          <text x="202" y="112" font-size="16" font-weight="700">A</text>
          <path d="M 280 44 C 300 58 300 88 282 102" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="283,42 294,49 282,55" fill="#111827"></polygon>
          <text x="294" y="112" font-size="16" font-weight="700">B</text>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `The rope leaves the drum on the ${wrapOverTop ? 'top' : 'bottom'} side. Turning the handle in direction ${answer} winds the rope onto the drum and pulls the boat inward.`,
    pattern: 'For winches, look at which way the rope must wind onto the drum, not just which way the handle seems to move.',
  }
}

function mechanicalDoorstopSlipCompare(difficulty) {
  const answer = pick(['A', 'B'])
  const options = ['A', 'B', 'No difference']
  const shallowA = answer === 'A'

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-doorstop-slip-compare-${answer}`,
    familyKey: 'mechanical-doorstop-slip-compare',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which doorstop is more likely to slip?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Doorstop comparison</strong></div>
        <svg viewBox="0 0 420 200" width="100%" height="200" style="display:block;margin-top:10px;">
          ${doorstopCompareSvg(125, 'A', shallowA)}
          ${doorstopCompareSvg(295, 'B', !shallowA)}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Doorstop ${answer} has the shallower wedge angle. A shallower wedge is pushed outward more easily, so it is more likely to slip.`,
    pattern: 'A shallow wedge converts more of the door force into sideways sliding force.',
  }
}

function mechanicalReflectorLightArea(difficulty) {
  const answer = pick(['A', 'B'])
  const options = ['A', 'B', 'No difference']
  const narrowA = answer === 'A'

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-reflector-light-area-${answer}`,
    familyKey: 'mechanical-reflector-light-area',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which will create the smaller area of light?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Reflector lamps</strong></div>
        <svg viewBox="0 0 420 210" width="100%" height="210" style="display:block;margin-top:10px;">
          ${reflectorLampSvg(125, 'A', narrowA ? 74 : 104)}
          ${reflectorLampSvg(295, 'B', narrowA ? 104 : 74)}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Lamp ${answer} has the narrower reflector, so its beam spreads less and produces the smaller illuminated area.`,
    pattern: 'A narrower beam gives a smaller light patch; a wider beam spreads the same light over a larger area.',
  }
}

function mechanicalDrumPitch(difficulty) {
  const answer = pick(['A', 'B'])
  const options = ['A', 'B', 'No difference']
  const radiusA = answer === 'A' ? 34 : 48
  const radiusB = answer === 'A' ? 48 : 34

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-drum-pitch-${answer}`,
    familyKey: 'mechanical-drum-pitch',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'When struck, which drum will make a higher-pitched sound?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Drum comparison</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${drumSvg(125, 120, radiusA, 'A')}
          ${drumSvg(295, 120, radiusB, 'B')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Drum ${answer} is smaller. Smaller vibrating surfaces generally produce a higher pitch than larger ones when the material and tension are otherwise similar.`,
    pattern: 'For simple sound questions, smaller vibrating bodies usually give higher pitch.',
  }
}

function mechanicalPressurePointer(difficulty) {
  const answer = 'direction A'
  const options = ['direction A', 'direction B', 'neither']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-pressure-pointer',
    familyKey: 'mechanical-pressure-pointer',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'If pressure P is raised, in which direction will the pointer turn?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Pressure and pointer</strong></div>
        <svg viewBox="0 0 420 240" width="100%" height="240" style="display:block;margin-top:10px;">
          <circle cx="248" cy="108" r="72" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>
          <path d="M248 108 L248 48" stroke="#111827" stroke-width="6"></path>
          <circle cx="248" cy="108" r="8" fill="#111827"></circle>
          <path d="M186 60 C166 80 166 122 184 142" fill="none" stroke="#111827" stroke-width="3"></path>
          <polygon points="182,58 172,68 184,72" fill="#111827"></polygon>
          <text x="168" y="56" font-size="16" font-weight="700">A</text>
          <path d="M310 60 C330 80 330 122 312 142" fill="none" stroke="#111827" stroke-width="3"></path>
          <polygon points="314,58 324,68 312,72" fill="#111827"></polygon>
          <text x="324" y="56" font-size="16" font-weight="700">B</text>
          <circle cx="176" cy="132" r="18" fill="#d4d4d8" stroke="#52525b" stroke-width="3"></circle>
          <circle cx="176" cy="132" r="5" fill="#9ca3af"></circle>
          <path d="M120 176 L120 124 L158 124" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M120 176 L120 196" stroke="#111827" stroke-width="4"></path>
          <polygon points="120,110 112,124 128,124" fill="#111827"></polygon>
          <text x="110" y="210" font-size="18" font-weight="700">P</text>
          <line x1="194" y1="122" x2="216" y2="122" stroke="#111827" stroke-width="4"></line>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Raising pressure pushes the rack upward. That makes the small gear rotate clockwise, which makes the large pointer wheel rotate counterclockwise, matching direction A.',
    pattern: 'For rack-and-gear systems, first decide the gear direction at the point of contact, then reverse the direction again for each meshing gear.',
  }
}

function mechanicalShelfBracket(difficulty) {
  const answer = pick(['A', 'B', 'C'])
  const heights = {
    A: answer === 'A' ? 72 : answer === 'B' ? 56 : 46,
    B: answer === 'B' ? 72 : answer === 'A' ? 56 : 46,
    C: answer === 'C' ? 72 : 46,
  }
  const options = ['A', 'B', 'C']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-shelf-bracket-${answer}`,
    familyKey: 'mechanical-shelf-bracket',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which of the three shelves could carry the heaviest weight?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Shelf support</strong></div>
        <svg viewBox="0 0 430 210" width="100%" height="210" style="display:block;margin-top:10px;">
          ${shelfBracketSvg(105, 'A', heights.A)}
          ${shelfBracketSvg(215, 'B', heights.B)}
          ${shelfBracketSvg(325, 'C', heights.C)}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Shelf ${answer} has the largest, stiffest triangular support. A deeper triangle spreads the load better and resists bending more effectively.`,
    pattern: 'Triangulated supports become stronger when the brace gives a larger, deeper triangle.',
  }
}

function mechanicalCurveSkid(difficulty) {
  const answer = 'B'
  const options = ['A', 'B', 'No difference']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-curve-skid',
    familyKey: 'mechanical-curve-skid',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'If both cars travel at the same speed, which car is more likely to skid?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Cars on a bend</strong></div>
        <svg viewBox="0 0 420 210" width="100%" height="210" style="display:block;margin-top:10px;">
          <path d="M60 165 Q150 65 350 80" fill="none" stroke="#9ca3af" stroke-width="16"></path>
          <path d="M95 182 Q168 95 335 106" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="10 8"></path>
          <path d="M44 145 Q136 35 366 50" fill="none" stroke="#cbd5e1" stroke-width="3"></path>
          ${carSvg(132, 118, 0.9)}
          ${carSvg(195, 126, 0.9)}
          <text x="130" y="112" font-size="16" font-weight="700">A</text>
          <text x="193" y="120" font-size="16" font-weight="700">B</text>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Car B is on the tighter inside radius. At the same speed, the tighter curve needs more centripetal force, so B is more likely to skid.',
    pattern: 'At equal speed, a smaller turning radius needs more sideways grip and is more likely to skid first.',
  }
}

function mechanicalFanDriveDirection(difficulty) {
  const crossed = Math.random() < 0.5
  const answer = crossed ? 'B' : 'A'
  const options = ['A', 'B', 'either']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-fan-drive-direction-${crossed ? 'crossed' : 'open'}`,
    familyKey: 'mechanical-fan-drive-direction',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'When shaft X turns in the direction shown, which way will the fan blades turn?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Belt and gear drive</strong></div>
        <svg viewBox="0 0 430 240" width="100%" height="240" style="display:block;margin-top:10px;">
          ${beltPulleySvg(318, 80, 30, 'X')}
          ${beltPulleySvg(238, 162, 22, '')}
          <path d="${crossed ? 'M 296 58 C 280 86 264 112 248 140 M 340 58 C 322 86 304 112 228 178' : 'M 296 58 C 276 86 260 114 246 140 M 340 58 C 322 92 308 126 264 184'}" fill="none" stroke="#111827" stroke-width="4"></path>
          ${gearCogSvg(174, 162, 22, '')}
          ${fanBladeSvg(106, 162)}
          <line x1="216" y1="162" x2="196" y2="162" stroke="#111827" stroke-width="2"></line>
          <line x1="128" y1="162" x2="152" y2="162" stroke="#111827" stroke-width="5"></line>
          <path d="M 318 40 C 338 52 338 94 320 112" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="320,38 330,46 318,51" fill="#111827"></polygon>
          <path d="M 84 122 C 62 140 62 184 84 202" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="82,120 72,129 84,133" fill="#111827"></polygon>
          <text x="60" y="178" font-size="16" font-weight="700">A</text>
          <path d="M 126 122 C 148 140 148 184 126 202" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="128,120 138,129 126,133" fill="#111827"></polygon>
          <text x="152" y="178" font-size="16" font-weight="700">B</text>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `The belt is ${crossed ? 'crossed, so it reverses' : 'open, so it keeps'} the rotation between X and the lower shaft. The final gear mesh reverses the direction once more, so the fan turns in direction ${answer}.`,
    pattern: 'Open belts keep direction, crossed belts reverse it, and each gear mesh reverses it again.',
  }
}

function mechanicalBulbPower(difficulty) {
  const scenario = pick([
    { pair: [30, 30], single: 60, answer: 'the same electricity is spent' },
    { pair: [20, 20], single: 60, answer: 'in bulb 2' },
    { pair: [40, 40], single: 60, answer: 'in the two bulbs 1' },
  ])
  const options = ['in the two bulbs 1', 'in bulb 2', 'the same electricity is spent']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-bulb-power-${scenario.pair.join('-')}-${scenario.single}`,
    familyKey: 'mechanical-bulb-power',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Where is the most electricity spent?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Power use</strong></div>
        <svg viewBox="0 0 420 210" width="100%" height="210" style="display:block;margin-top:10px;">
          ${wattBulbSvg(120, 115, 36, '1', scenario.pair[0])}
          ${wattBulbSvg(178, 126, 28, '', scenario.pair[1])}
          ${wattBulbSvg(300, 108, 48, '2', scenario.single)}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(scenario.answer),
    explanation: scenario.answer === 'the same electricity is spent'
      ? `The two bulbs marked 1 use ${scenario.pair[0]} + ${scenario.pair[1]} = ${scenario.single} watts in total, which is the same as bulb 2.`
      : scenario.answer === 'in the two bulbs 1'
        ? `The pair of bulbs 1 use ${scenario.pair[0]} + ${scenario.pair[1]} = ${scenario.pair[0] + scenario.pair[1]} watts, which is more than bulb 2 at ${scenario.single} watts.`
        : `Bulb 2 uses ${scenario.single} watts, which is more than the two bulbs 1 together at ${scenario.pair[0] + scenario.pair[1]} watts.`,
    pattern: 'For power questions, add the wattages on one side and compare the totals directly.',
  }
}

function mechanicalLadderStability(difficulty) {
  const answer = pick(['1', '2', '3'])
  const widths = {
    1: answer === '1' ? 58 : answer === '2' ? 42 : 48,
    2: answer === '2' ? 58 : answer === '3' ? 42 : 48,
    3: answer === '3' ? 58 : 42,
  }
  const options = ['1', '2', '3']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-ladder-stability-${answer}`,
    familyKey: 'mechanical-ladder-stability',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which stepladder stands most solidly?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Stepladder stability</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${stepLadderSvg(110, widths[1], '1')}
          ${stepLadderSvg(210, widths[2], '2')}
          ${stepLadderSvg(310, widths[3], '3')}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Ladder ${answer} has the widest base, so its center of support is larger and it stands most solidly.`,
    pattern: 'A wider base usually gives better stability because it keeps the center of mass inside the support area more easily.',
  }
}

function mechanicalPulleyRank(difficulty) {
  const answer = pick(['1', '2', '3'])
  const segments = {
    1: answer === '1' ? 4 : answer === '2' ? 2 : 1,
    2: answer === '2' ? 4 : answer === '3' ? 2 : 1,
    3: answer === '3' ? 4 : 1,
  }
  const options = ['1', '2', '3']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-pulley-rank-${answer}`,
    familyKey: 'mechanical-pulley-rank',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which of the three weights can be lifted with the lowest effort?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Pulley systems</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${rankPulleySvg(100, '1', segments[1])}
          ${rankPulleySvg(210, '2', segments[2])}
          ${rankPulleySvg(320, '3', segments[3])}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `System ${answer} has the most supporting rope segments, so it gives the greatest mechanical advantage and needs the least effort.`,
    pattern: 'Count how many rope segments support the load: more support segments means less force is needed.',
  }
}

function mechanicalBalanceHeaviest(difficulty) {
  const answer = pick(['1', '2', '3'])
  const positions = {
    1: answer === '1' ? 78 : answer === '2' ? 58 : 42,
    2: answer === '2' ? 78 : answer === '3' ? 58 : 42,
    3: answer === '3' ? 78 : 42,
  }
  const options = ['1', '2', '3']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-balance-heaviest-${answer}`,
    familyKey: 'mechanical-balance-heaviest',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which box is the heaviest?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Balance scales</strong></div>
        <svg viewBox="0 0 420 230" width="100%" height="230" style="display:block;margin-top:10px;">
          ${balanceScaleSvg(110, '1', positions[1])}
          ${balanceScaleSvg(210, '2', positions[2])}
          ${balanceScaleSvg(310, '3', positions[3])}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `On each balance the same sliding counterweight is used. The heaviest box needs that counterweight farthest from the pivot, so box ${answer} is the heaviest.`,
    pattern: 'With the same counterweight, the heavier load needs the counterweight farther from the pivot to balance.',
  }
}

function mechanicalChainLoad(difficulty) {
  const answer = pick(['1', '2', '3'])
  const topHeights = {
    1: answer === '1' ? 34 : answer === '2' ? 58 : 82,
    2: answer === '2' ? 34 : answer === '3' ? 58 : 82,
    3: answer === '3' ? 34 : 82,
  }
  const options = ['1', '2', '3']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-chain-load-${answer}`,
    familyKey: 'mechanical-chain-load',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which chain is exposed to the highest load?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Chain support load</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          ${chainLoadSvg(105, '1', topHeights[1])}
          ${chainLoadSvg(210, '2', topHeights[2])}
          ${chainLoadSvg(315, '3', topHeights[3])}
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `Chain ${answer} is the flattest. A flatter supporting chain must carry more tension to hold the same downward load.`,
    pattern: 'For the same load, the more horizontal the chain or cable, the higher the tension in it.',
  }
}

function mechanicalWaterOverflowLevel(difficulty) {
  const answer = pick(['A', 'B', 'C'])
  const yMap = { A: 92, B: 122, C: 152 }
  const options = ['A', 'B', 'C']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: `mechanical-water-overflow-level-${answer}`,
    familyKey: 'mechanical-water-overflow-level',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'What level in the can must the water reach in order to start pouring out of the tube?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Can and overflow tube</strong></div>
        <svg viewBox="0 0 420 220" width="100%" height="220" style="display:block;margin-top:10px;">
          <rect x="152" y="46" width="90" height="126" rx="6" fill="#f8fafc" stroke="#111827" stroke-width="3"></rect>
          <line x1="152" y1="92" x2="242" y2="92" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 6"></line>
          <line x1="152" y1="122" x2="242" y2="122" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 6"></line>
          <line x1="152" y1="152" x2="242" y2="152" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 6"></line>
          <text x="140" y="96" font-size="16" font-weight="700">A</text>
          <text x="140" y="126" font-size="16" font-weight="700">B</text>
          <text x="140" y="156" font-size="16" font-weight="700">C</text>
          <path d="M242 ${yMap[answer]} L270 ${yMap[answer]} C292 ${yMap[answer]} 292 ${yMap[answer] - 18} 292 ${yMap[answer] - 18} C292 ${yMap[answer] - 18} 302 ${yMap[answer] - 18} 302 ${yMap[answer] + 4} C302 ${yMap[answer] + 26} 320 ${yMap[answer] + 26} 330 ${yMap[answer] + 10}" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M80 54 L128 54" stroke="#475569" stroke-width="5"></path>
          <path d="M145 54 L145 74" stroke="#475569" stroke-width="5"></path>
          <path d="M145 74 L174 74" stroke="#475569" stroke-width="5"></path>
          <circle cx="136" cy="54" r="7" fill="#f8fafc" stroke="#111827" stroke-width="3"></circle>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: `The water must rise to the height of the tube opening inside the can. In this picture that opening is at level ${answer}, so flow starts there.`,
    pattern: 'Water starts leaving once the level reaches the inlet height of the outlet path inside the container.',
  }
}

function mechanicalWheelDirectionPair(difficulty) {
  const answer = '4 and 5'
  const options = ['4 and 5', '1 and 2', '3 and 5']

  return {
    topic: 'mechanical',
    topicLabel: 'Mechanical reasoning',
    variantKey: 'mechanical-wheel-direction-pair',
    familyKey: 'mechanical-wheel-direction-pair',
    timer: getTimerSeconds('mechanical', difficulty),
    prompt: 'Which two wheels turn in the same direction as drive wheel A?',
    visualHtml: `
      <div class="chart">
        <div class="center"><strong>Wheel and belt system</strong></div>
        <svg viewBox="0 0 430 230" width="100%" height="230" style="display:block;margin-top:10px;">
          ${beltPulleySvg(340, 126, 22, 'A')}
          ${beltPulleySvg(278, 94, 22, '5')}
          ${beltPulleySvg(244, 156, 18, '4')}
          ${beltPulleySvg(172, 156, 18, '3')}
          ${beltPulleySvg(138, 94, 22, '2')}
          ${beltPulleySvg(172, 48, 18, '1')}
          <path d="M 320 111 C 306 102 294 100 290 104 M 358 111 C 342 102 320 96 296 86" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M 264 94 C 250 116 246 128 246 138 M 292 94 C 282 120 272 140 262 156" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M 226 156 L 190 156 M 262 156 L 190 156" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M 156 94 C 162 116 166 130 168 138 M 120 94 C 128 116 138 134 150 156" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M 154 82 C 164 74 168 68 170 62 M 122 82 C 132 70 142 60 158 54" fill="none" stroke="#111827" stroke-width="4"></path>
          <path d="M 358 126 C 374 138 374 154 358 168" fill="none" stroke="#111827" stroke-width="4"></path>
          <polygon points="358,124 368,132 356,137" fill="#111827"></polygon>
        </svg>
      </div>
    `,
    options: options.map(value => ({ text: value, plain: value })),
    correctIndex: options.indexOf(answer),
    explanation: 'Wheel A drives 5 with an open belt, so 5 turns the same way. Wheel 5 drives 4 with another open belt, so 4 also turns the same way. The later links reverse the direction for the other wheels.',
    pattern: 'Track direction stage by stage. Open belts keep direction, while reversing links flip it.',
  }
}
function oppositeDirection(direction) {
  return direction === 'Clockwise' ? 'Counterclockwise' : 'Clockwise'
}








