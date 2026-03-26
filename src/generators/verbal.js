import { getTimerSeconds, pick } from '../engine-core'

const NAMES = ['Nadia', 'Omar', 'Lena', 'Mateo', 'Sara', 'Ivan']
const TEAMS = ['Team Blue', 'Team North', 'Team Delta', 'Unit A']
const PRODUCTS = ['Product X', 'Order 417', 'Package M', 'Batch 72']
const ROOMS = ['Room A', 'Room B', 'Lab 2', 'Station C']

export function generateVerbal(difficulty) {
  const family = pick(['all-some', 'badge', 'only-room', 'every-team', 'some-orders', 'unless'])
  if (family === 'all-some') return verbalAllSome(difficulty)
  if (family === 'badge') return verbalBadge(difficulty)
  if (family === 'only-room') return verbalOnlyRoom(difficulty)
  if (family === 'every-team') return verbalEveryTeam(difficulty)
  if (family === 'some-orders') return verbalSomeOrders(difficulty)
  return verbalUnless(difficulty)
}

function verbalAllSome(difficulty) {
  const group = pick(['trainees', 'apprentices', 'operators'])
  const basic = pick(['safety training', 'induction training', 'equipment briefing'])
  const advanced = pick(['advanced technical training', 'quality-control training', 'machine calibration training'])
  return buildQuestion({
    variantKey: 'verbal-all-some',
    text: `All ${group} must complete ${basic}. Some ${group} also complete ${advanced}.`,
    statement: `Some ${group} who completed ${basic} also completed ${advanced}.`,
    answer: 'True',
    explanation: `All ${group} completed ${basic}, and some of them also completed ${advanced}. Therefore at least some completed both.`
  }, difficulty)
}

function verbalBadge(difficulty) {
  const place = pick(['the lab', 'the testing room', 'the secure archive'])
  const visitors = pick(['visitors', 'contractors', 'guests'])
  return buildQuestion({
    variantKey: 'verbal-badge',
    text: `No employee may enter ${place} without a badge. Some ${visitors} were given temporary badges.`,
    statement: `Some ${visitors} may enter ${place}.`,
    answer: 'Cannot say',
    explanation: `A badge is necessary for entry, but the text does not say that any ${visitors} with temporary badges were actually permitted to enter ${place}.`
  }, difficulty)
}

function verbalOnlyRoom(difficulty) {
  const room = pick(ROOMS)
  const item = pick(PRODUCTS)
  return buildQuestion({
    variantKey: 'verbal-only-room',
    text: `Only products tested in ${room} were shipped on Monday. ${item} was shipped on Monday.`,
    statement: `${item} was tested in ${room}.`,
    answer: 'True',
    explanation: `If only products tested in ${room} were shipped on Monday, then any item shipped on Monday must have been tested in ${room}.`
  }, difficulty)
}

function verbalEveryTeam(difficulty) {
  const name = pick(NAMES)
  const team = pick(TEAMS)
  const task = pick(['passed the safety briefing', 'completed the audit drill', 'signed the compliance form'])
  return buildQuestion({
    variantKey: 'verbal-every-team',
    text: `Every apprentice in ${team} ${task}. ${name} is in ${team}.`,
    statement: `${name} ${task}.`,
    answer: 'True',
    explanation: `${name} belongs to ${team}, and every apprentice in ${team} ${task}. So the statement must be true.`
  }, difficulty)
}

function verbalSomeOrders(difficulty) {
  const item = pick(PRODUCTS)
  return buildQuestion({
    variantKey: 'verbal-some-orders',
    text: `Some orders placed before noon were dispatched on Tuesday. ${item} was placed before noon.`,
    statement: `${item} was dispatched on Tuesday.`,
    answer: 'Cannot say',
    explanation: `The text says only some orders placed before noon were dispatched on Tuesday. It does not tell us whether ${item} was one of them.`
  }, difficulty)
}

function verbalUnless(difficulty) {
  const machine = pick(['Machine R', 'Machine K', 'Unit 5', 'Press 3'])
  const guard = pick(['the guard', 'the safety cover', 'the protective gate'])
  return buildQuestion({
    variantKey: 'verbal-unless',
    text: `No machine can be started unless ${guard} is closed. ${machine} started successfully.`,
    statement: `${guard.charAt(0).toUpperCase() + guard.slice(1)} on ${machine} was closed.`,
    answer: 'True',
    explanation: `A closed ${guard} is required for a successful start. Since ${machine} started successfully, its ${guard} must have been closed.`
  }, difficulty)
}

function buildQuestion(item, difficulty) {
  const options = ['True', 'False', 'Cannot say']
  const correctIndex = options.indexOf(item.answer)
  return {
    topic: 'verbal',
    topicLabel: 'Verbal reasoning',
    variantKey: item.variantKey,
    timer: getTimerSeconds('verbal', difficulty),
    prompt: 'Is the statement True, False, or Cannot say?',
    visualHtml: `<div class="chart"><div><strong>Text</strong></div><div class="mt8">${item.text}</div><div class="statement"><strong>Statement:</strong> ${item.statement}</div></div>`,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex,
    explanation: item.explanation,
    pattern: 'Do not use real-world assumptions. Use only the text. Distinguish False from Cannot say.'
  }
}
