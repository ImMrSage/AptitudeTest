import { topicLabel, translateUi } from '../utils/i18n'

export default function StatsScreen({ stats, language, onMainMenu }) {
  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 22, fontWeight: 800 }}>{translateUi(language, 'overall')}</div>
        <div className="stat-grid">
          <div className="stat"><div className="small">{translateUi(language, 'sessions')}</div><div className="big">{stats.totalSessions}</div></div>
          <div className="stat"><div className="small">{translateUi(language, 'accuracy')}</div><div className="big">{stats.totalQuestions ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0}%</div></div>
        </div>
      </div>
      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>{translateUi(language, 'byTopic')}</div>
        <div className="review-list">
          {Object.entries(stats.byTopic).map(([key, value]) => {
            const pct = value.total ? Math.round((value.correct / value.total) * 100) : 0
            return <div key={key} className="review-item">{topicLabel(key, language)} - {value.correct}/{value.total} - {pct}%</div>
          })}
        </div>
      </div>
      <button className="cta" onClick={onMainMenu}>{translateUi(language, 'mainMenu')}</button>
    </div>
  )
}