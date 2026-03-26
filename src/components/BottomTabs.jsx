export default function BottomTabs({ hasQuestions, hasVisibleExplanation, onExplain, onReset, onStats }) {
  return (
    <div className="bottom-tabs">
      <button className="tab green" onClick={onExplain} disabled={!hasQuestions || !hasVisibleExplanation}>? Explain</button>
      <button className="tab blue" onClick={onStats}>Stats</button>
      <button className="tab red" onClick={onReset}>Reset</button>
    </div>
  )
}
