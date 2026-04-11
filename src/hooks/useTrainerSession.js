import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildDetailedExplanationHtml,
  createInitialState,
  formatTime,
  generateSession,
  questionTemplateSignature,
} from '../engine'
import { topicLabel, translateGeneratedText } from '../utils/i18n'

export function useTrainerSession() {
  const [state, setState] = useState(() => createInitialState())
  const activeTimedQuestionIdRef = useRef(null)

  const currentIndex = state.reviewIndex ?? state.questionIndex
  const currentQuestion = state.questions[currentIndex] || null
  const currentAnswer = state.answers[currentIndex] || null
  const inSession = state.questions.length > 0 || state.sessionDone
  const progressPct = state.questions.length
    ? (((state.reviewIndex != null ? state.reviewIndex + 1 : Math.min(state.questionIndex + (state.sessionDone ? 1 : 0), state.questions.length)) / state.questions.length) * 100)
    : 0

  useEffect(() => {
    if (
      !currentQuestion ||
      state.lastView !== 'question' ||
      state.sessionDone ||
      state.reviewIndex != null ||
      state.mode === 'training' ||
      state.showExplanation ||
      currentAnswer !== null
    ) {
      return undefined
    }

    if (activeTimedQuestionIdRef.current !== currentQuestion.id) {
      activeTimedQuestionIdRef.current = currentQuestion.id
      if (state.secondsLeft <= 0) {
        setState(prev => ({ ...prev, secondsLeft: currentQuestion.timer, startedAt: Date.now() }))
      } else {
        setState(prev => ({ ...prev, startedAt: Date.now() }))
      }
    }

    const id = window.setInterval(() => {
      setState(prev => {
        if (prev.sessionDone || prev.reviewIndex != null || prev.mode === 'training' || prev.showExplanation || prev.lastView !== 'question' || prev.answers[prev.questionIndex] !== null) {
          window.clearInterval(id)
          return prev
        }

        const nextSeconds = prev.secondsLeft - 1
        if (nextSeconds > 0) {
          return { ...prev, secondsLeft: nextSeconds }
        }

        window.clearInterval(id)
        const question = prev.questions[prev.questionIndex]
        if (!question) return prev

        const nextAnswers = [...prev.answers]
        nextAnswers[prev.questionIndex] = { answerIndex: -1, timedOut: true }
        const nextStats = {
          ...prev.stats,
          totalQuestions: prev.stats.totalQuestions + 1,
          byTopic: {
            ...prev.stats.byTopic,
            [question.topic]: {
              ...prev.stats.byTopic[question.topic],
              total: prev.stats.byTopic[question.topic].total + 1,
            },
          },
        }

        if (prev.mode === 'training' || prev.mode === 'drill') {
          return {
            ...prev,
            answers: nextAnswers,
            stats: nextStats,
            showExplanation: true,
            lastView: 'explanation',
            secondsLeft: 0,
          }
        }

        if (prev.questionIndex >= prev.questions.length - 1) {
          return {
            ...prev,
            answers: nextAnswers,
            stats: { ...nextStats, totalSessions: nextStats.totalSessions + 1 },
            secondsLeft: 0,
            sessionDone: true,
            lastView: 'summary',
            showExplanation: false,
          }
        }

        return {
          ...prev,
          answers: nextAnswers,
          stats: nextStats,
          questionIndex: prev.questionIndex + 1,
          secondsLeft: prev.questions[prev.questionIndex + 1].timer,
          lastQuestionTemplateSignature: questionTemplateSignature(prev.questions[prev.questionIndex + 1]),
          lastView: 'question',
          showExplanation: false,
        }
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [currentAnswer, currentQuestion, state.lastView, state.mode, state.reviewIndex, state.secondsLeft, state.sessionDone, state.showExplanation])

  const timerText = !inSession || state.mode === 'training' || state.lastView !== 'question' || currentAnswer !== null
    ? '--:--'
    : formatTime(state.secondsLeft)

  const detailedExplanationHtml = useMemo(() => {
    if (!currentQuestion) return ''
    const builtExplanation = buildDetailedExplanationHtml(currentQuestion)
    if (builtExplanation) {
      return state.language === 'en' ? builtExplanation : translateGeneratedText(builtExplanation, state.language)
    }
    const directExplanation = currentQuestion.translations && currentQuestion.translations[state.language]
      ? currentQuestion.translations[state.language].explanation
      : null
    const explanation = directExplanation || currentQuestion.explanation
    return state.language === 'en' ? explanation : translateGeneratedText(explanation, state.language)
  }, [currentQuestion, state.language])

  const summaryScore = state.answers.filter((answer, index) => answer && answer.answerIndex === state.questions[index].correctIndex).length
  const summaryAccuracy = state.answers.length ? Math.round((summaryScore / state.answers.length) * 100) : 0

  let weakTopic = state.language === 'de' ? 'Noch keine Daten' : 'No data yet'
  let worstPct = Infinity
  for (const [topic, stats] of Object.entries(state.stats.byTopic)) {
    if (stats.total === 0) continue
    const pct = stats.correct / stats.total
    if (pct < worstPct) {
      worstPct = pct
      weakTopic = topicLabel(topic, state.language)
    }
  }

  function startSession() {
    activeTimedQuestionIdRef.current = null
    setState(prev => {
      const count = Math.max(1, Number(prev.count) || 1)
      const questions = generateSession(prev.topic, prev.difficulty, count, prev.mode, prev.lastQuestionTemplateSignature, prev.language)
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

  function saveAnswer(answerIndex, timedOut = false, targetIndex = state.questionIndex) {
    setState(prev => {
      const question = prev.questions[targetIndex]
      if (!question || prev.answers[targetIndex] !== null) return prev

      const nextAnswers = [...prev.answers]
      nextAnswers[targetIndex] = { answerIndex, timedOut: !!timedOut }
      const nextStats = {
        ...prev.stats,
        totalQuestions: prev.stats.totalQuestions + 1,
        correct: prev.stats.correct + (answerIndex === question.correctIndex ? 1 : 0),
        byTopic: {
          ...prev.stats.byTopic,
          [question.topic]: {
            total: prev.stats.byTopic[question.topic].total + 1,
            correct: prev.stats.byTopic[question.topic].correct + (answerIndex === question.correctIndex ? 1 : 0),
          },
        },
      }

      return { ...prev, answers: nextAnswers, stats: nextStats }
    })
  }

  function goToQuestion(index) {
    activeTimedQuestionIdRef.current = null
    setState(prev => ({
      ...prev,
      questionIndex: index,
      reviewIndex: null,
      lastView: 'question',
      showExplanation: false,
      secondsLeft: prev.answers[index] === null ? (prev.questions[index]?.timer || 0) : prev.secondsLeft,
      startedAt: Date.now(),
    }))
  }

  function nextQuestion() {
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

      activeTimedQuestionIdRef.current = null
      return {
        ...prev,
        questionIndex: nextIndex,
        showExplanation: false,
        reviewIndex: null,
        lastView: 'question',
        secondsLeft: prev.questions[nextIndex]?.timer || 0,
        startedAt: Date.now(),
        lastQuestionTemplateSignature: prev.questions[nextIndex] ? questionTemplateSignature(prev.questions[nextIndex]) : prev.lastQuestionTemplateSignature,
      }
    })
  }

  function resetToHome() {
    activeTimedQuestionIdRef.current = null
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
        if (prev.questions.length > 0) return { ...prev, lastView: prev.showExplanation ? 'explanation' : 'question', reviewIndex: null }
        return { ...prev, lastView: 'home' }
      }
      if (prev.lastView === 'summary') {
        activeTimedQuestionIdRef.current = null
        return {
          ...prev,
          questions: [],
          answers: [],
          questionIndex: 0,
          reviewIndex: null,
          showExplanation: false,
          sessionDone: false,
          lastView: 'home',
          secondsLeft: 0,
        }
      }
      if (prev.lastView === 'explanation') {
        if (prev.reviewIndex != null) return { ...prev, reviewIndex: null, lastView: 'summary', showExplanation: false }
        return { ...prev, showExplanation: false, lastView: 'question' }
      }
      if (prev.lastView === 'question') {
        if (prev.questionIndex > 0) {
          activeTimedQuestionIdRef.current = null
          const previousIndex = prev.questionIndex - 1
          return {
            ...prev,
            questionIndex: previousIndex,
            reviewIndex: null,
            showExplanation: false,
            lastView: 'question',
            secondsLeft: prev.answers[previousIndex] === null ? (prev.questions[previousIndex]?.timer || 0) : prev.secondsLeft,
            startedAt: Date.now(),
          }
        }

        activeTimedQuestionIdRef.current = null
        return {
          ...prev,
          questions: [],
          answers: [],
          questionIndex: 0,
          reviewIndex: null,
          showExplanation: false,
          sessionDone: false,
          lastView: 'home',
          secondsLeft: 0,
        }
      }
      return prev
    })
  }

  function handleAnswer(answerIndex) {
    if (state.reviewIndex != null || state.answers[state.questionIndex] !== null) return
    saveAnswer(answerIndex, false)
    if (state.mode === 'training' || state.mode === 'drill') {
      setState(prev => ({ ...prev, showExplanation: true, lastView: 'explanation' }))
      return
    }
    nextQuestion()
  }

  function skipQuestion() {
    if (!state.questions.length || state.reviewIndex != null || state.sessionDone) return

    if (state.lastView === 'explanation') {
      nextQuestion()
      return
    }

    setState(prev => ({ ...prev, showExplanation: true, lastView: 'explanation', secondsLeft: prev.secondsLeft }))
  }

  function openExplanation() {
    if (!state.questions.length || state.sessionDone || state.reviewIndex != null) return

    if (state.lastView === 'explanation') {
      setState(prev => ({ ...prev, lastView: 'question', showExplanation: false }))
      return
    }

    setState(prev => ({ ...prev, lastView: 'explanation', showExplanation: true }))
  }

  function openStats() {
    setState(prev => ({ ...prev, lastView: 'stats' }))
  }

  function openReviewItem(index) {
    setState(prev => ({ ...prev, reviewIndex: index, questionIndex: index, lastView: 'explanation', showExplanation: true }))
  }

  function closeReview() {
    setState(prev => ({ ...prev, reviewIndex: null, lastView: 'summary', showExplanation: false }))
  }

  function updateSetupField(field, value) {
    setState(prev => ({ ...prev, [field]: value }))
  }

  return {
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
    actions: {
      goBack,
      goToQuestion,
      handleAnswer,
      nextQuestion,
      openExplanation,
      openReviewItem,
      closeReview,
      openStats,
      resetToHome,
      skipQuestion,
      startSession,
      updateSetupField,
    },
  }
}
