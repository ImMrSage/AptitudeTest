export function renderHtml(html) {
  return { __html: html || '' }
}

export function decodeHtmlText(value) {
  const input = value || ''
  if (typeof document === 'undefined') return input

  const textarea = document.createElement('textarea')
  textarea.innerHTML = input
  return textarea.value
}
