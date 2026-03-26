import { useEffect, useMemo, useState } from 'react'
import {
  TOPICS,
  DIFFICULTIES,
  MODES,
  buildDetailedExplanationHtml,
  createInitialState,
  formatTime,
  generateSession,
  getUniqueQuestionLimit,
  questionTemplateSignature,
  topicLabel,
} from './engine'

function renderHtml(html) {
  return { __html: html || '' }
}

function TrainerApp() {
  const [state, setState] = useState(() => createInitialState())

  const currentIndex = state.reviewIndex ?? state.questionIndex
  const currentQuestion = state.questions[currentIndex] || null
  const inSession = state.questions.length > 0 || state.sessionDone
  const progressPct = state.questions.length
    ? (((state.reviewIndex != null ? state.reviewIndex + 1 : Math.min(state.questionIndex + (state.sessionDone ? 1 : 0), state.questions.length)) / state.questions.length) * 100)
    : 0

  useEffect(() => {
    if (!currentQuestion || state.sessionDone || state.reviewIndex != null || state.mode === 'training' || state.showExplanation) {
      return undefined
    }

    setState(prev => ({ ...prev, secondsLeft: currentQuestion.timer, startedAt: Date.now() }))

    const id = window.setInterval(() => {
      setState(prev => {
        if (prev.sessionDone || prev.reviewIndex != null || prev.mode === 'training' || prev.showExplanation) {
          window.clearInterval(id)
          return prev
        }

        const nextSeconds = prev.secondsLeft - 1
        if (nextSeconds > 0) {
          return { ...prev, secondsLeft: nextSeconds }
        }

        window.clearInterval(id)
        const q = prev.questions[prev.questionIndex]
        if (!q) return prev
        const nextAnswers = [...prev.answers]
        nextAnswers[prev.questionIndex] = { answerIndex: -1, timedOut: true }
        const nextStats = {
          ...prev.stats,
          totalQuestions: prev.stats.totalQuestions + 1,
          byTopic: {
            ...prev.stats.byTopic,
            [q.topic]: {
              ...prev.stats.byTopic[q.topic],
              total: prev.stats.byTopic[q.topic].total + 1,
            },
          },
        }

        if (prev.mode === 'training' || prev.mode === 'drill') {
          return { ...prev, answers: nextAnswers, stats: nextStats, showExplanation: true, secondsLeft: 0 }
        }

        if (prev.questionIndex >= prev.questions.length - 1) {
          return {
            ...prev,
            answers: nextAnswers,
            stats: { ...nextStats, totalSessions: nextStats.totalSessions + 1 },
            secondsLeft: 0,
            sessionDone: true,
          }
        }

        return {
          ...prev,
          answers: nextAnswers,
          stats: nextStats,
          secondsLeft: prev.questions[prev.questionIndex + 1].timer,
          questionIndex: prev.questionIndex + 1,
          lastQuestionTemplateSignature: questionTemplateSignature(prev.questions[prev.questionIndex + 1]),
        }
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [currentQuestion, state.mode, state.reviewIndex, state.sessionDone, state.showExplanation])

  const timerText = !inSession || state.mode === 'training'
    ? '--:--'
    : state.showExplanation && state.answers[currentIndex]?.timedOut
      ? '00:00'
      : formatTime(state.secondsLeft)

  const detailedExplanationHtml = useMemo(
    () => (currentQuestion ? buildDetailedExplanationHtml(currentQuestion) || currentQuestion.explanation : ''),
    [currentQuestion],
  )

  function startSession() {
    setState(prev => {
      const count = Math.min(prev.count, getUniqueQuestionLimit(prev.topic))
      const questions = generateSession(prev.topic, prev.difficulty, count, prev.mode, prev.lastQuestionTemplateSignature)
      return {
        ...prev,
        count,
        questions,
        answers: new Array(questions.length).fill(null),
        questionIndex: 0,
        reviewIndex: null,
        showExplanation: false,
        sessionDone: false,
        lastView: 'question',
        lastQuestionTemplateSignature: questions[0] ? questionTemplateSignature(questions[0]) : prev.lastQuestionTemplateSignature,
        secondsLeft: questions[0]?.timer || 0,
        startedAt: Date.now(),
      }
    })
  }

  function saveAnswer(answerIndex, timedOut = false) {
    setState(prev => {
      const idx = prev.questionIndex
      const q = prev.questions[idx]
      if (!q || prev.answers[idx] !== null) return prev
      const nextAnswers = [...prev.answers]
      nextAnswers[idx] = { answerIndex, timedOut: !!timedOut }
      const nextStats = {
        ...prev.stats,
        totalQuestions: prev.stats.totalQuestions + 1,
        correct: prev.stats.correct + (answerIndex === q.correctIndex ? 1 : 0),
        byTopic: {
          ...prev.stats.byTopic,
          [q.topic]: {
            total: prev.stats.byTopic[q.topic].total + 1,
            correct: prev.stats.byTopic[q.topic].correct + (answerIndex === q.correctIndex ? 1 : 0),
          },
        },
      }
      return { ...prev, answers: nextAnswers, stats: nextStats }
    })
  }

  function handleAnswer(idx) {
    if (state.reviewIndex != null || state.answers[state.questionIndex] !== null) return
    saveAnswer(idx, false)
    if (state.mode === 'training' || state.mode === 'drill') {
      setState(prev => ({ ...prev, showExplanation: true, lastView: 'explanation' }))
      return
    }
    nextQuestion(true)
  }

  function nextQuestion(skipExplanation = false) {
    setState(prev => {
      const nextIndex = prev.questionIndex + 1
      if (prev.questionIndex >= prev.questions.length - 1) {
        return {
          ...prev,
          showExplanation: false,
          reviewIndex: null,
          sessionDone: true,
          lastView: 'summary',
          stats: { ...prev.stats, totalSessions: prev.stats.totalSessions + 1 },
        }
      }
      return {
        ...prev,
        questionIndex: nextIndex,
        showExplanation: false,
        reviewIndex: null,
        lastView: skipExplanation ? 'question' : prev.lastView,
        secondsLeft: prev.questions[nextIndex]?.timer || 0,
        startedAt: Date.now(),
        lastQuestionTemplateSignature: prev.questions[nextIndex] ? questionTemplateSignature(prev.questions[nextIndex]) : prev.lastQuestionTemplateSignature,
      }
    })
  }

  function resetToHome() {
    setState(prev => ({
      ...prev,
      questions: [],
      answers: [],
      questionIndex: 0,
      reviewIndex: null,
      showExplanation: false,
      sessionDone: false,
      lastView: 'home',
      secondsLeft: 0,
    }))
  }

  function goBack() {
    setState(prev => {
      if (prev.lastView === 'home') return prev
      if (prev.lastView === 'stats') {
        if (prev.sessionDone) return { ...prev, lastView: 'summary' }
        if (prev.questions.length > 0) return { ...prev, lastView: 'question', reviewIndex: null, showExplanation: false }
        return { ...prev, lastView: 'home' }
      }
      if (prev.lastView === 'summary') {
        return { ...prev, questions: [], answers: [], questionIndex: 0, reviewIndex: null, showExplanation: false, sessionDone: false, lastView: 'home', secondsLeft: 0 }
      }
      if (prev.lastView === 'explanation') {
        if (prev.reviewIndex != null) return { ...prev, reviewIndex: null, lastView: 'summary' }
        return { ...prev, showExplanation: false, lastView: 'question' }
      }
      if (prev.lastView === 'question') {
        return { ...prev, questions: [], answers: [], questionIndex: 0, reviewIndex: null, showExplanation: false, sessionDone: false, lastView: 'home', secondsLeft: 0 }
      }
      return prev
    })
  }

  const currentAnswer = state.answers[currentIndex]
  const weakTopic = (() => {
    let worst = 'No data yet'
    let worstPct = Infinity
    for (const [k, v] of Object.entries(state.stats.byTopic)) {
      if (v.total === 0) continue
      const pct = v.correct / v.total
      if (pct < worstPct) {
        worstPct = pct
        worst = topicLabel(k)
      }
    }
    return worst
  })()

  return (
    <div className="app">
      <div className="topbar">
        <div className="toprow">
          <button className="icon-btn" id="backBtn" onClick={goBack} style={{ visibility: inSession ? 'visible' : 'hidden' }}>&larr;</button>
          <div className="title-center" id="headerTitle">
            {state.lastView === 'home' && 'Aptitude Trainer'}
            {state.lastView === 'stats' && 'Stats'}
            {state.lastView === 'summary' && 'Summary'}
            {(state.lastView === 'question' || state.lastView === 'explanation') && currentQuestion ? `${currentIndex + 1} / ${state.questions.length}` : null}
          </div>
          <div className="title-center" id="timerLabel" style={{ visibility: inSession && state.mode !== 'training' ? 'visible' : 'hidden' }}>{timerText}</div>
          <button
            className="icon-btn"
            id="skipBtn"
            onClick={() => {
              if (state.sessionDone || !state.questions.length || state.showExplanation || state.reviewIndex != null) return
              saveAnswer(-1, true)
              if (state.mode === 'training' || state.mode === 'drill') {
                setState(prev => ({ ...prev, showExplanation: true, lastView: 'explanation' }))
              } else {
                nextQuestion(true)
              }
            }}
            style={{ visibility: inSession && !state.sessionDone ? 'visible' : 'hidden' }}
          >
            &rarr;
          </button>
        </div>
        <div className="progress-wrap"><div className="progress" style={{ width: `${progressPct}%` }} /></div></div>

      <div className="screen" id="screen">
        {state.lastView === 'home' && (
          <div className="setup-grid">
            <div className="setup-card">
              <div style={{ fontSize: 26, fontWeight: 800 }}>Assessment Trainer v1</div>
              <div className="small mt8">One question at a time. Real timer. Generated questions. English tasks + RU explanations.</div>
              <div className="mt12">
                {TOPICS.filter(t => t.value !== 'mixed').map(t => <span key={t.value} className="pill">{t.label}</span>)}
              </div>
            </div>

            <div className="setup-card">
              <div className="row-2">
                <div>
                  <label htmlFor="modeSelect">Mode</label>
                  <select id="modeSelect" value={state.mode} onChange={e => setState(prev => ({ ...prev, mode: e.target.value }))}>
                    {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="topicSelect">Topic</label>
                  <select id="topicSelect" value={state.topic} onChange={e => setState(prev => ({ ...prev, topic: e.target.value }))}>
                    {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="row-2 mt12">
                <div>
                  <label htmlFor="difficultySelect">Difficulty</label>
                  <select id="difficultySelect" value={state.difficulty} onChange={e => setState(prev => ({ ...prev, difficulty: e.target.value }))}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="countInput">Questions</label>
                  <input id="countInput" type="number" min="3" max="20" value={state.count} onChange={e => setState(prev => ({ ...prev, count: Math.max(3, Math.min(20, Number(e.target.value) || 8)) }))} />
                </div>
              </div>

              <button className="cta" id="startBtn" onClick={startSession}>Start session</button>
            </div>

            <div className="setup-card">
              <div style={{ fontSize: 18, fontWeight: 700 }}>How timer works</div>
              <div className="small mt8">It changes automatically by section and difficulty. AP Quantitative gets more time. Concentration gets less.</div>
              <div className="small mt8">Training/Drill: explanation after each question. Timed Test: explanations at the end by question number.</div>
            </div>
          </div>
        )}

        {state.lastView === 'question' && currentQuestion && (
          <div className="setup-grid">
            <div className="card">
              <div className="question-head">{currentQuestion.topicLabel}</div>
              <div className="question-body">
                <div dangerouslySetInnerHTML={renderHtml(currentQuestion.visualHtml)} />
                <div className="question-text">{currentQuestion.prompt}</div>
                {currentQuestion.subtext ? <div className="subtle center">{currentQuestion.subtext}</div> : null}
                <div className="options">
                  {currentQuestion.options.map((opt, idx) => {
                    const answered = state.answers[currentIndex] !== null
                    const answeredObj = state.answers[currentIndex]
                    const className = [
                      'option',
                      answered && idx === currentQuestion.correctIndex ? 'correct' : '',
                      answered && answeredObj && idx === answeredObj.answerIndex && idx !== currentQuestion.correctIndex ? 'wrong' : '',
                      answered && idx !== currentQuestion.correctIndex && (!answeredObj || idx !== answeredObj.answerIndex) ? 'dim' : '',
                    ].filter(Boolean).join(' ')
                    return <button key={idx} className={className} disabled={answered} onClick={() => handleAnswer(idx)} dangerouslySetInnerHTML={renderHtml(opt.html || opt.text)} />
                  })}
                </div>
              </div>
            </div>
            <button className="cta" onClick={resetToHome}>Main menu</button>
          </div>
        )}

        {state.lastView === 'explanation' && currentQuestion && (
          <div className="setup-grid">
            <div className="card">
              <div className="explain-head">Explanation</div>
              <div className="explain-body">
                <div dangerouslySetInnerHTML={renderHtml(currentQuestion.visualHtml)} />
                <div className="question-text">{currentQuestion.prompt}</div>
                {currentQuestion.subtext ? <div className="subtle center">{currentQuestion.subtext}</div> : null}
                <div className="options">
                  {currentQuestion.options.map((opt, idx) => {
                    const className = [
                      'option',
                      idx === currentQuestion.correctIndex ? 'correct' : '',
                      currentAnswer && currentAnswer.answerIndex >= 0 && idx === currentAnswer.answerIndex && idx !== currentQuestion.correctIndex ? 'wrong' : '',
                      idx !== currentQuestion.correctIndex && (!currentAnswer || idx !== currentAnswer.answerIndex) ? 'dim' : '',
                    ].filter(Boolean).join(' ')
                    return <button key={idx} className={className} disabled dangerouslySetInnerHTML={renderHtml(opt.html || opt.text)} />
                  })}
                </div>
                <div className="mt12" />
                <div><strong>Correct answer:</strong> {currentQuestion.options[currentQuestion.correctIndex].plain}</div>
                {currentAnswer && currentAnswer.answerIndex >= 0 ? <div className="mt8"><strong>Your answer:</strong> {currentQuestion.options[currentAnswer.answerIndex].plain}</div> : <div className="mt8"><strong>Your answer:</strong> Time out</div>}
                <div className="statement mt12" dangerouslySetInnerHTML={renderHtml(detailedExplanationHtml)} />
                <div className="mt12"><strong>What to remember:</strong> {currentQuestion.pattern}</div>
                <button className="cta" onClick={() => {
                  if (state.reviewIndex != null) {
                    setState(prev => ({ ...prev, reviewIndex: null, lastView: 'summary' }))
                    return
                  }
                  nextQuestion(false)
                }}>{state.reviewIndex != null ? 'Back to review' : (state.questionIndex === state.questions.length - 1 ? 'Finish session' : 'Next question')}</button>
              </div>
            </div>
            <button className="cta" onClick={resetToHome}>Main menu</button>
          </div>
        )}

        {state.lastView === 'summary' && (
          <div className="setup-grid">
            <div className="setup-card">
              <div style={{ fontSize: 24, fontWeight: 800 }}>Session complete</div>
              <div className="stat-grid">
                <div className="stat"><div className="small">Score</div><div className="big">{state.answers.filter((a, i) => a && a.answerIndex === state.questions[i].correctIndex).length} / {state.answers.length}</div></div>
                <div className="stat"><div className="small">Accuracy</div><div className="big">{state.answers.length ? Math.round((state.answers.filter((a, i) => a && a.answerIndex === state.questions[i].correctIndex).length / state.answers.length) * 100) : 0}%</div></div>
              </div>
              <div className="mt12 small">Weak area hint: {weakTopic}</div>
              <button className="cta" onClick={resetToHome}>New session</button>
            </div>
            <div className="setup-card">
              <div style={{ fontSize: 18, fontWeight: 700 }}>Review explanations</div>
              <div className="review-list">
                {state.questions.map((q, i) => {
                  const a = state.answers[i]
                  const ok = a && a.answerIndex === q.correctIndex
                  return <div key={q.id} className="review-item" onClick={() => setState(prev => ({ ...prev, reviewIndex: i, lastView: 'explanation' }))}>Q{i + 1} - {q.topicLabel} - {ok ? 'Correct' : 'Incorrect / timeout'}</div>
                })}
              </div>
            </div>
          </div>
        )}

        {state.lastView === 'stats' && (
          <div className="setup-grid">
            <div className="setup-card">
              <div style={{ fontSize: 22, fontWeight: 800 }}>Overall</div>
              <div className="stat-grid">
                <div className="stat"><div className="small">Sessions</div><div className="big">{state.stats.totalSessions}</div></div>
                <div className="stat"><div className="small">Accuracy</div><div className="big">{state.stats.totalQuestions ? Math.round((state.stats.correct / state.stats.totalQuestions) * 100) : 0}%</div></div>
              </div>
            </div>
            <div className="setup-card">
              <div style={{ fontSize: 18, fontWeight: 700 }}>By topic</div>
              <div className="review-list">
                {Object.entries(state.stats.byTopic).map(([k, v]) => {
                  const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0
                  return <div key={k} className="review-item">{topicLabel(k)} - {v.correct}/{v.total} - {pct}%</div>
                })}
              </div>
            </div>
            <button className="cta" onClick={resetToHome}>Main menu</button>
          </div>
        )}
      </div>

      <div className="bottom-tabs">
        <button className="tab green" onClick={() => {
          if (!state.questions.length) return
          const hasAnswer = state.answers[state.questionIndex] !== null
          if (state.showExplanation || state.reviewIndex != null || hasAnswer) {
            setState(prev => ({ ...prev, lastView: 'explanation', showExplanation: true }))
          }
        }}>? Explain</button>
        <button className="tab blue" onClick={() => setState(prev => ({ ...prev, lastView: 'stats' }))}>Stats</button>
        <button className="tab red" onClick={resetToHome}>Reset</button>
      </div>
    </div>
  )
}

export default TrainerApp
