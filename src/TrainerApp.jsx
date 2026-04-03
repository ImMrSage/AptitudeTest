import { useMemo } from 'react'
import BottomTabs from './components/BottomTabs'
import TopBar from './components/TopBar'
import { useTrainerSession } from './hooks/useTrainerSession'
import ExplanationScreen from './screens/ExplanationScreen'
import HomeScreen from './screens/HomeScreen'
import QuestionScreen from './screens/QuestionScreen'
import StatsScreen from './screens/StatsScreen'
import SummaryScreen from './screens/SummaryScreen'
import { localizeQuestion } from './utils/i18n'

function TrainerApp() {
  const {
    state,
    currentIndex,
    currentQuestion,
    currentAnswer,
    inSession,
    progressPct,
    timerText,
    detailedExplanationHtml,
    summaryScore,
    summaryAccuracy,
    weakTopic,
    actions,
  } = useTrainerSession()
  const showExplain = state.lastView === 'question' || state.lastView === 'explanation'
  const localizedCurrentQuestion = useMemo(
    () => (currentQuestion ? localizeQuestion(currentQuestion, state.language) : null),
    [currentQuestion, state.language],
  )
  const localizedQuestions = useMemo(
    () => (state.lastView === 'summary'
      ? state.questions.map(question => localizeQuestion(question, state.language))
      : []),
    [state.lastView, state.questions, state.language],
  )

  return (
    <div className="app">
      <TopBar
        currentIndex={currentIndex}
        currentQuestion={localizedCurrentQuestion}
        inSession={inSession}
        language={state.language}
        lastView={state.lastView}
        mode={state.mode}
        progressPct={progressPct}
        questionCount={state.questions.length}
        timerText={timerText}
        onBack={actions.goBack}
        onSkip={actions.skipQuestion}
      />

      <div className="screen" id="screen">
        {state.lastView === 'home' && (
          <HomeScreen
            count={state.count}
            difficulty={state.difficulty}
            language={state.language}
            mode={state.mode}
            topic={state.topic}
            onChangeField={actions.updateSetupField}
            onStart={actions.startSession}
          />
        )}

        {state.lastView === 'question' && localizedCurrentQuestion && (
          <QuestionScreen
            answer={state.answers[currentIndex]}
            language={state.language}
            question={localizedCurrentQuestion}
            onAnswer={actions.handleAnswer}
            onMainMenu={actions.resetToHome}
          />
        )}

        {state.lastView === 'explanation' && localizedCurrentQuestion && (
          <ExplanationScreen
            answer={currentAnswer}
            explanationHtml={detailedExplanationHtml}
            isLastQuestion={state.questionIndex === state.questions.length - 1}
            isReview={state.reviewIndex != null}
            language={state.language}
            onContinue={() => {
              if (state.reviewIndex != null) {
                actions.closeReview()
                return
              }
              actions.nextQuestion(false)
            }}
            onMainMenu={actions.resetToHome}
            question={localizedCurrentQuestion}
          />
        )}

        {state.lastView === 'summary' && (
          <SummaryScreen
            answers={state.answers}
            questions={localizedQuestions}
            score={summaryScore}
            accuracy={summaryAccuracy}
            language={state.language}
            weakTopic={weakTopic}
            onMainMenu={actions.resetToHome}
            onOpenReview={actions.openReviewItem}
          />
        )}

        {state.lastView === 'stats' && (
          <StatsScreen
            stats={state.stats}
            language={state.language}
            onMainMenu={actions.resetToHome}
          />
        )}
      </div>

      <BottomTabs
        language={state.language}
        showExplain={showExplain}
        onExplain={actions.openExplanation}
        onReset={actions.resetToHome}
        onStats={actions.openStats}
      />
    </div>
  )
}

export default TrainerApp




