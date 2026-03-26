import TrainerApp from './TrainerApp'

function App() {
  return (
    <div className="app-shell-react">
      <TrainerApp />
      <div className="react-shell-note">
        React migration in progress. The original standalone snapshot remains
        available at{' '}
        <a
          className="inline-link"
          href="/legacy/aptitude_trainer_v_1.html"
          target="_blank"
          rel="noreferrer"
        >
          /legacy/aptitude_trainer_v_1.html
        </a>
        .
      </div>
    </div>
  )
}

export default App
