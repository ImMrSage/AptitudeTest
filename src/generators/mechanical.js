import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

const DIRECTIONS = ['Clockwise', 'Counterclockwise']

export function generateMechanical(difficulty) {
  const families = [
    'gear',
    'ramp',
    'lever',
    'pulley',
    'thermal',
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
  if (family === 'ramp') return mechanicalRamp(difficulty)
  if (family === 'lever') return mechanicalLever(difficulty)
  if (family === 'pulley') return mechanicalPulley(difficulty)
  if (family === 'thermal') return mechanicalThermal(difficulty)
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
        <div class="formula-line">Moment = force × distance from the pivot</div>
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
        <div class="formula-line">Moment = force × distance from the pivot.</div>
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
        <div class="formula-line">Moment = force × lever arm.</div>
        <div class="formula-line">A longer halligan handle means a longer lever arm.</div>
        <div class="formula-line">For the same required turning moment, a longer lever arm needs less input force.</div>
        <div class="formula-line">So tool D requires the least effort.</div>
      </div>
    `,
    pattern: 'For prying tools, the longest effective handle gives the greatest mechanical advantage.'
  }
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



