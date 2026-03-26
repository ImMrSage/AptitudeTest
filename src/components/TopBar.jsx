export default function TopBar({ currentIndex, currentQuestion, inSession, lastView, mode, progressPct, questionCount, timerText, onBack, onSkip }) {
  return (
    <div className="topbar">
      <div className="toprow">
        <button className="icon-btn" id="backBtn" onClick={onBack} style={{ visibility: inSession ? 'visible' : 'hidden' }}>&larr;</button>
        <div className="title-center" id="headerTitle">
          {lastView === 'home' && 'Aptitude Trainer'}
          {lastView === 'stats' && 'Stats'}
          {lastView === 'summary' && 'Summary'}
          {(lastView === 'question' || lastView === 'explanation') && currentQuestion ? `${currentIndex + 1} / ${questionCount}` : null}
        </div>
        <div className="title-center" id="timerLabel" style={{ visibility: inSession && mode !== 'training' ? 'visible' : 'hidden' }}>{timerText}</div>
        <button
          className="icon-btn"
          id="skipBtn"
          onClick={onSkip}
          style={{ visibility: inSession && !['summary', 'stats'].includes(lastView) ? 'visible' : 'hidden' }}
        >
          &rarr;
        </button>
      </div>
      <div className="progress-wrap"><div className="progress" style={{ width: `${progressPct}%` }} /></div>
    </div>
  )
}
