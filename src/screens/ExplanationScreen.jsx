import { renderHtml } from '../utils/renderHtml'

export default function ExplanationScreen({ answer, explanationHtml, isReview, isLastQuestion, onContinue, onMainMenu, question }) {
  return (
    <div className="setup-grid">
      <div className="card">
        <div className="explain-head">Explanation</div>
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
          <div><strong>Correct answer:</strong> {question.options[question.correctIndex].plain}</div>
          {answer && answer.answerIndex >= 0
            ? <div className="mt8"><strong>Your answer:</strong> {question.options[answer.answerIndex].plain}</div>
            : <div className="mt8"><strong>Your answer:</strong> Time out</div>}
          <div className="statement mt12" dangerouslySetInnerHTML={renderHtml(explanationHtml)} />
          <div className="mt12"><strong>What to remember:</strong> {question.pattern}</div>
          <button className="cta" onClick={onContinue}>
            {isReview ? 'Back to review' : (isLastQuestion ? 'Finish session' : 'Next question')}
          </button>
        </div>
      </div>
      <button className="cta" onClick={onMainMenu}>Main menu</button>
    </div>
  )
}
