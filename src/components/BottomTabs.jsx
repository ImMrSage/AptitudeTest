export default function BottomTabs({ showExplain, onExplain, onReset, onStats }) {
  return (
    <div className="bottom-tabs">
      {showExplain ? <button className="tab green" onClick={onExplain}>? Explain</button> : null}
      <button className="tab blue" onClick={onStats}>Stats</button>
      <button className="tab red" onClick={onReset}>Reset</button>
    </div>
  )
}
