import { renderHtml } from '../utils/renderHtml'

export default function QuestionScreen({ answer, question, onAnswer, onMainMenu }) {
  return (
    <div className="setup-grid">
      <div className="card">
        <div className="question-head">{question.topicLabel}</div>
        <div className="question-body">
          <div dangerouslySetInnerHTML={renderHtml(question.visualHtml)} />
          <div className="question-text">{question.prompt}</div>
          {question.subtext ? <div className="subtle center">{question.subtext}</div> : null}
          <div className="options">
            {question.options.map((option, index) => {
              const answered = answer !== null
              const className = [
                'option',
                answered && index === question.correctIndex ? 'correct' : '',
                answered && answer && index === answer.answerIndex && index !== question.correctIndex ? 'wrong' : '',
                answered && index !== question.correctIndex && (!answer || index !== answer.answerIndex) ? 'dim' : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={index}
                  className={className}
                  disabled={answered}
                  onClick={() => onAnswer(index)}
                  dangerouslySetInnerHTML={renderHtml(option.html || option.text)}
                />
              )
            })}
          </div>
        </div>
      </div>
      <button className="cta" onClick={onMainMenu}>Main menu</button>
    </div>
  )
}
