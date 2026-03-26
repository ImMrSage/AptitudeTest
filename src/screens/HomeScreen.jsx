import { DIFFICULTIES, MODES, TOPICS } from '../engine'

export default function HomeScreen({ count, difficulty, mode, topic, onChangeField, onStart }) {
  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 26, fontWeight: 800 }}>Assessment Trainer v1</div>
        <div className="small mt8">One question at a time. Real timer. Generated questions. English tasks + RU explanations.</div>
        <div className="mt12">
          {TOPICS.filter(item => item.value !== 'mixed').map(item => <span key={item.value} className="pill">{item.label}</span>)}
        </div>
      </div>

      <div className="setup-card">
        <div className="row-2">
          <div>
            <label htmlFor="modeSelect">Mode</label>
            <select id="modeSelect" value={mode} onChange={event => onChangeField('mode', event.target.value)}>
              {MODES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="topicSelect">Topic</label>
            <select id="topicSelect" value={topic} onChange={event => onChangeField('topic', event.target.value)}>
              {TOPICS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        <div className="row-2 mt12">
          <div>
            <label htmlFor="difficultySelect">Difficulty</label>
            <select id="difficultySelect" value={difficulty} onChange={event => onChangeField('difficulty', event.target.value)}>
              {DIFFICULTIES.map(item => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="countInput">Questions</label>
            <input
              id="countInput"
              type="number"
              min="3"
              max="20"
              value={count}
              onChange={event => onChangeField('count', Math.max(3, Math.min(20, Number(event.target.value) || 8)))}
            />
          </div>
        </div>

        <button className="cta" id="startBtn" onClick={onStart}>Start session</button>
      </div>

      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>How timer works</div>
        <div className="small mt8">It changes automatically by section and difficulty. AP Quantitative gets more time. Concentration gets less.</div>
        <div className="small mt8">Training/Drill: explanation after each question. Timed Test: explanations at the end by question number.</div>
      </div>
    </div>
  )
}
