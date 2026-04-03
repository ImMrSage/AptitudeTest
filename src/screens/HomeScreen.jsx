import { DIFFICULTIES } from '../engine'
import { getDifficultyLabel, getLanguageOptions, getModeOptions, getTopicOptions, translateUi } from '../utils/i18n'

export default function HomeScreen({ count, difficulty, language, mode, topic, onChangeField, onStart }) {
  const topics = getTopicOptions(language)
  const modes = getModeOptions(language)
  const languages = getLanguageOptions(language)

  return (
    <div className="setup-grid">
      <div className="setup-card">
        <div style={{ fontSize: 26, fontWeight: 800 }}>{translateUi(language, 'appTitle')}</div>

        <div className="mt12">
          {topics.filter(item => item.value !== 'mixed').map(item => <span key={item.value} className="pill">{item.label}</span>)}
        </div>
      </div>

      <div className="setup-card">
        <div className="row-2">
          <div>
            <label htmlFor="modeSelect">{translateUi(language, 'mode')}</label>
            <select id="modeSelect" value={mode} onChange={event => onChangeField('mode', event.target.value)}>
              {modes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="topicSelect">{translateUi(language, 'topic')}</label>
            <select id="topicSelect" value={topic} onChange={event => onChangeField('topic', event.target.value)}>
              {topics.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        <div className="row-2 mt12">
          <div>
            <label htmlFor="difficultySelect">{translateUi(language, 'difficulty')}</label>
            <select id="difficultySelect" value={difficulty} onChange={event => onChangeField('difficulty', event.target.value)}>
              {DIFFICULTIES.map(item => <option key={item} value={item}>{getDifficultyLabel(language, item)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="countInput">{translateUi(language, 'questions')}</label>
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

        <div className="row-2 mt12">
          <div>
            <label htmlFor="languageSelect">{translateUi(language, 'language')}</label>
            <select id="languageSelect" value={language} onChange={event => onChangeField('language', event.target.value)}>
              {languages.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div />
        </div>

        <button className="cta" id="startBtn" onClick={onStart}>{translateUi(language, 'startSession')}</button>
      </div>

      <div className="setup-card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>{translateUi(language, 'timerInfoTitle')}</div>
        <div className="small mt8">{translateUi(language, 'timerInfo1')}</div>
        <div className="small mt8">{translateUi(language, 'timerInfo2')}</div>
      </div>
    </div>
  )
}