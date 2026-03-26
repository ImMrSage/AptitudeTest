import BottomTabs from './components/BottomTabs'
import TopBar from './components/TopBar'
import { useTrainerSession } from './hooks/useTrainerSession'
import ExplanationScreen from './screens/ExplanationScreen'
import HomeScreen from './screens/HomeScreen'
import QuestionScreen from './screens/QuestionScreen'
import StatsScreen from './screens/StatsScreen'
import SummaryScreen from './screens/SummaryScreen'

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

  const hasVisibleExplanation = state.showExplanation || state.reviewIndex != null || state.answers[state.questionIndex] !== null

  return (
    <div className="app">
      <TopBar
        currentIndex={currentIndex}
        currentQuestion={currentQuestion}
        inSession={inSession}
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
            mode={state.mode}
            topic={state.topic}
            onChangeField={actions.updateSetupField}
            onStart={actions.startSession}
          />
        )}

        {state.lastView === 'question' && currentQuestion && (
          <QuestionScreen
            answer={state.answers[currentIndex]}
            question={currentQuestion}
            onAnswer={actions.handleAnswer}
            onMainMenu={actions.resetToHome}
          />
        )}

        {state.lastView === 'explanation' && currentQuestion && (
          <ExplanationScreen
            answer={currentAnswer}
            explanationHtml={detailedExplanationHtml}
            isLastQuestion={state.questionIndex === state.questions.length - 1}
            isReview={state.reviewIndex != null}
            onContinue={() => {
              if (state.reviewIndex != null) {
                actions.closeReview()
                return
              }
              actions.nextQuestion(false)
            }}
            onMainMenu={actions.resetToHome}
            question={currentQuestion}
          />
        )}

        {state.lastView === 'summary' && (
          <SummaryScreen
            answers={state.answers}
            questions={state.questions}
            score={summaryScore}
            accuracy={summaryAccuracy}
            weakTopic={weakTopic}
            onMainMenu={actions.resetToHome}
            onOpenReview={actions.openReviewItem}
          />
        )}

        {state.lastView === 'stats' && (
          <StatsScreen
            stats={state.stats}
            onMainMenu={actions.resetToHome}
          />
        )}
      </div>

      <BottomTabs
        hasQuestions={state.questions.length > 0}
        hasVisibleExplanation={hasVisibleExplanation}
        onExplain={actions.openExplanation}
        onReset={actions.resetToHome}
        onStats={actions.openStats}
      />
    </div>
  )
}

export default TrainerApp

