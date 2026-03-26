import { getTimerSeconds, pick, randInt, shuffle } from '../engine-core'

const ROW_LABELS = ['A', 'B', 'C', 'D']

export function generateErrorCheck(difficulty) {
  const family = pick(['product-code', 'invoice-number', 'date', 'serial'])
  if (family === 'product-code') return codeMismatch(difficulty)
  if (family === 'invoice-number') return numericMismatch(difficulty)
  if (family === 'date') return dateMismatch(difficulty)
  return serialMismatch(difficulty)
}

function codeMismatch(difficulty) {
  const rows = buildRows(() => `${letters(2)}-${randInt(1000, 9999)}`, mutateAlphaNumeric)
  return buildQuestion('errorcheck-product-code', difficulty, rows, 'Which line contains an error?')
}

function numericMismatch(difficulty) {
  const rows = buildRows(() => `${randInt(10, 99)},${randInt(100, 999)}`, mutateDigit)
  return buildQuestion('errorcheck-invoice-number', difficulty, rows, 'Which line contains an error?')
}

function dateMismatch(difficulty) {
  const rows = buildRows(() => `${String(randInt(1, 28)).padStart(2, '0')}/${String(randInt(1, 12)).padStart(2, '0')}/2026`, mutateDate)
  return buildQuestion('errorcheck-date', difficulty, rows, 'Which line contains an error?')
}

function serialMismatch(difficulty) {
  const rows = buildRows(() => `${letters(2)}-${randInt(10, 99)}${letters(1)}-${randInt(100, 999)}`, mutateAlphaNumeric)
  return buildQuestion('errorcheck-serial', difficulty, rows, 'Which line contains an error?')
}

function buildRows(makeBase, mutate) {
  const errorIndex = randInt(0, ROW_LABELS.length - 1)
  return ROW_LABELS.map((label, index) => {
    const left = makeBase()
    const right = index === errorIndex ? mutate(left) : left
    return { label, left, right, isError: index === errorIndex }
  })
}

function buildQuestion(variantKey, difficulty, rows, prompt) {
  const answer = rows.find(row => row.isError)?.label || 'A'
  const options = difficulty === 'easy' ? [...ROW_LABELS] : shuffle([...ROW_LABELS])
  return {
    topic: 'errorcheck',
    topicLabel: 'Error checking',
    variantKey,
    timer: getTimerSeconds('errorcheck', difficulty),
    prompt,
    visualHtml: `
      <div class="chart">
        <div class="review-list">
          ${rows.map(row => `<div class="review-item">${row.label}. ${row.left} | ${row.right}</div>`).join('')}
        </div>
      </div>
    `,
    options: options.map(v => ({ text: v, plain: v })),
    correctIndex: options.indexOf(answer),
    explanation: `Compare the two entries in each row from left to right. The mismatch appears on line ${answer}.`,
    pattern: 'Scan in a fixed order: prefix, digits, suffix. Do not rely on overall shape.'
  }
}

function mutateAlphaNumeric(value) {
  const chars = value.split('')
  const indexes = chars.map((char, index) => ({ char, index })).filter(item => /[A-Z0-9]/.test(item.char))
  const target = pick(indexes)
  if (!target) return value
  chars[target.index] = /\d/.test(target.char) ? String((Number(target.char) + randInt(1, 8)) % 10) : letters(1)
  return chars.join('')
}

function mutateDigit(value) {
  const chars = value.split('')
  const indexes = chars.map((char, index) => ({ char, index })).filter(item => /\d/.test(item.char))
  const target = pick(indexes)
  if (!target) return value
  chars[target.index] = String((Number(target.char) + randInt(1, 8)) % 10)
  return chars.join('')
}

function mutateDate(value) {
  const [day, month, year] = value.split('/')
  const family = pick(['day', 'month', 'year'])
  if (family === 'day') return `${String(Math.min(28, Number(day) + randInt(1, 3))).padStart(2, '0')}/${month}/${year}`
  if (family === 'month') return `${day}/${String(((Number(month) + randInt(1, 4) - 1) % 12) + 1).padStart(2, '0')}/${year}`
  return `${day}/${month}/${Number(year) + 1}`
}

function letters(length) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length }, () => alphabet[randInt(0, alphabet.length - 1)]).join('')
}
