function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">React + Vite Shell</p>
          <h1>Aptitude Trainer</h1>
          <p className="app-copy">
            The current assessment engine is preserved as a legacy module while
            the project migrates from a single HTML file into a React
            codebase.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="app-panel">
          <div className="panel-head">
            <div>
              <h2>Legacy Trainer</h2>
              <p>
                Functional baseline preserved during the migration. Next step
                is to replace this progressively with React components.
              </p>
            </div>
            <a
              className="panel-link"
              href="/legacy/aptitude_trainer_v_1.html"
              target="_blank"
              rel="noreferrer"
            >
              Open standalone
            </a>
          </div>

          <div className="trainer-frame-wrap">
            <iframe
              className="trainer-frame"
              src="/legacy/aptitude_trainer_v_1.html"
              title="Aptitude Trainer Legacy Module"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
