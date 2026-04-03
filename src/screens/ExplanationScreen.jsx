import { decodeHtmlText, renderHtml } from '../utils/renderHtml'
import { translateUi } from '../utils/i18n'

function getAnswerLabel(option) {
  if (!option) return translateUi('en', 'unavailable')
  return decodeHtmlText(option.plain || option.text || '')
}

export default function ExplanationScreen({ answer, explanationHtml, isReview, isLastQuestion, language, onContinue, onMainMenu, question }) {
  const correctOption = question.options[question.correctIndex] || null
  const selectedOption = answer && answer.answerIndex >= 0 ? (question.options[answer.answerIndex] || null) : null

  return (
    <div className="setup-grid">
      <div className="card">
        <div className="explain-head">{translateUi(language, 'explanation')}</div>
        <div className="explain-body">
          <div dangerouslySetInnerHTML={renderHtml(question.visualHtml)} />
          <div className="question-text">{question.prompt}</div>
          {question.subtext ? <div className="subtle center">{question.subtext}</div> : null}
          <div className="options">
            {question.options.map((option, index) => {
              const className = [
                'option',
                index === question.correctIndex ? 'correct' : '',
                answer && answer.answerIndex >= 0 && index === answer.answerIndex && index !== question.correctIndex ? 'wrong' : '',
                index !== question.correctIndex && (!answer || index !== answer.answerIndex) ? 'dim' : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={index}
                  className={className}
                  disabled
                  dangerouslySetInnerHTML={renderHtml(option.html || option.text)}
                />
              )
            })}
          </div>
          <div className="mt12" />
          <div><strong>{translateUi('en', 'correctAnswer')}</strong> {getAnswerLabel(correctOption)}</div>
          {selectedOption
            ? <div className="mt8"><strong>{translateUi('en', 'yourAnswer')}</strong> {getAnswerLabel(selectedOption)}</div>
            : answer?.timedOut
              ? <div className="mt8"><strong>{translateUi('en', 'yourAnswer')}</strong> {translateUi('en', 'timeout')}</div>
              : <div className="mt8"><strong>{translateUi('en', 'yourAnswer')}</strong> {translateUi('en', 'notAnsweredYet')}</div>}
          <div className="statement mt12" dangerouslySetInnerHTML={renderHtml(explanationHtml)} />
          <div className="mt12"><strong>{translateUi('en', 'whatToRemember')}</strong> {question.pattern}</div>
          <button className="cta" onClick={onContinue}>
            {isReview ? translateUi(language, 'backToReview') : (isLastQuestion ? translateUi(language, 'finishSession') : translateUi(language, 'nextQuestion'))}
          </button>
        </div>
      </div>
      <button className="cta" onClick={onMainMenu}>{translateUi(language, 'mainMenu')}</button>
    </div>
  )
}
