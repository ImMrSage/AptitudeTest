import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

const DIRECTIONS = ['Clockwise', 'Counterclockwise']

export function generateMechanical(difficulty) {
  const families = [
    'gear',
    'gear-loop',
    'gear-loop',
    'bar-lock',
    'bar-lock',
    'ramp',
    'lever',
    'pulley',
    'belt-shaft-speed',
    'belt-shaft-speed',
    'thermal',
    'rope-slip',
    'rope-slip',
    'bulb-circuit',
    'bulb-circuit',
    'bulb-count',
    'bulb-count',
    'buoyancy-tank',
    'bridge-deflection',
    'convex-mirror',
    'cold-air-door',
    'bucket-leak',
    'candle-jars',
    'door-spring',
    'bolt-cutter',
    'relative-speed',
    'halligan'
  ]
  const family = pick(families)
  if (family === 'gear') return mechanicalGear(difficulty)
  if (family === 'gear-loop') return mechanicalGearLoop(difficulty)
  if (family === 'bar-lock') return mechanicalBarLock(difficulty)
  if (family === 'ramp') return mechanicalRamp(difficulty)
  if (family === 'lever') return mechanicalLever(difficulty)
  if (family === 'pulley') return mechanicalPulley(difficulty)
  if (family === 'belt-shaft-speed') return mechanicalBeltShaftSpeed(difficulty)
  if (family === 'thermal') return mechanicalThermal(difficulty)
  if (family === 'rope-slip') return mechanicalRopeSlip(difficulty)
  if (family === 'bulb-circuit') return mechanicalBulbCircuit(difficulty)
  if (family === 'bulb-count') return mechanicalBulbCount(difficulty)
  if (family === 'buoyancy-tank') return mechanicalBuoyancyTank(difficulty)
  if (family === 'bridge-deflection') return mechanicalBridgeDeflection(difficulty)
  if (family === 'convex-mirror') return mechanicalConvexMirror(difficulty)
  if (family === 'cold-air-door') return mechanicalColdAirDoor(difficulty)
  if (family === 'bucket-leak') return mechanicalBucketLeak(difficulty)
  if (family === 'candle-jars') return mechanicalCandleJars(difficulty)
  if (family === 'door-spring') return mechanicalDoorSpring(difficulty)
  if (family === 'bolt-cutter') return mechanicalBoltCutter(difficulty)
  if (family === 'relative-speed') return mechanicalRelativeSpeed(difficulty)
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
function oppositeDirection(direction) {
  return direction === 'Clockwise' ? 'Counterclockwise' : 'Clockwise'
}







