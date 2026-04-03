import { translateUi } from '../utils/i18n'

export default function SummaryScreen({ answers, questions, score, accuracy, language, weakTopic, onMainMenu, onOpenReview }) {
  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 24, fontWeight: 800 }}>{translateUi(language, 'sessionComplete')}</div>
        <div className="stat-grid">
          <div className="stat"><div className="small">Score</div><div className="big">{score} / {answers.length}</div></div>
          <div className="stat"><div className="small">{translateUi(language, 'accuracy')}</div><div className="big">{accuracy}%</div></div>
        </div>
        <div className="mt12 small">{translateUi(language, 'weakAreaHint')}: {weakTopic}</div>
        <button className="cta" onClick={onMainMenu}>{translateUi(language, 'newSession')}</button>
      </div>
      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>{translateUi(language, 'reviewExplanations')}</div>
        <div className="review-list">
          {questions.map((question, index) => {
            const answer = answers[index]
            const ok = answer && answer.answerIndex === question.correctIndex
            return (
              <div key={question.id} className="review-item" onClick={() => onOpenReview(index)}>
                Q{index + 1} - {question.topicLabel} - {ok ? translateUi(language, 'correct') : translateUi(language, 'incorrectTimeout')}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}