import { translateUi } from '../utils/i18n'

export default function BottomTabs({ language, showExplain, onExplain, onReset, onStats }) {
  return (
    <div className="bottom-tabs">
      {showExplain ? <button className="tab green" onClick={onExplain}>{translateUi(language, 'explainTab')}</button> : null}
      <button className="tab blue" onClick={onStats}>{translateUi(language, 'statsTab')}</button>
      <button className="tab red" onClick={onReset}>{translateUi(language, 'resetTab')}</button>
    </div>
  )
}