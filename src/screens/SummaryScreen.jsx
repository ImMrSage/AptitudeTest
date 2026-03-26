export default function SummaryScreen({ answers, questions, score, accuracy, weakTopic, onMainMenu, onOpenReview }) {
  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 24, fontWeight: 800 }}>Session complete</div>
        <div className="stat-grid">
          <div className="stat"><div className="small">Score</div><div className="big">{score} / {answers.length}</div></div>
          <div className="stat"><div className="small">Accuracy</div><div className="big">{accuracy}%</div></div>
        </div>
        <div className="mt12 small">Weak area hint: {weakTopic}</div>
        <button className="cta" onClick={onMainMenu}>New session</button>
      </div>
      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>Review explanations</div>
        <div className="review-list">
          {questions.map((question, index) => {
            const answer = answers[index]
            const ok = answer && answer.answerIndex === question.correctIndex
            return (
              <div key={question.id} className="review-item" onClick={() => onOpenReview(index)}>
                Q{index + 1} - {question.topicLabel} - {ok ? 'Correct' : 'Incorrect / timeout'}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
