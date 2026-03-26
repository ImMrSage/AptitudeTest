import { topicLabel } from '../engine'

export default function StatsScreen({ stats, onMainMenu }) {
  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 22, fontWeight: 800 }}>Overall</div>
        <div className="stat-grid">
          <div className="stat"><div className="small">Sessions</div><div className="big">{stats.totalSessions}</div></div>
          <div className="stat"><div className="small">Accuracy</div><div className="big">{stats.totalQuestions ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0}%</div></div>
        </div>
      </div>
      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>By topic</div>
        <div className="review-list">
          {Object.entries(stats.byTopic).map(([key, value]) => {
            const pct = value.total ? Math.round((value.correct / value.total) * 100) : 0
            return <div key={key} className="review-item">{topicLabel(key)} - {value.correct}/{value.total} - {pct}%</div>
          })}
        </div>
      </div>
      <button className="cta" onClick={onMainMenu}>Main menu</button>
    </div>
  )
}
