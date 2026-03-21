import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { questionBank } from '@/data/questions'
import {
  type AssessmentMode,
  type ResponseValue,
  type ThemeId,
  THEMES,
  computeTraitScores,
  deriveArchetype,
  deriveEnneagramProjection,
  deriveMbtiProjection,
  deriveStrengthThemes,
  isThemeId,
} from '@/lib/personality'

const THEME_STORAGE_KEY = 'personality-profiler-theme'

const getStoredTheme = (): ThemeId => {
  if (typeof window === 'undefined') {
    return 'lab'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isThemeId(storedTheme) ? storedTheme : 'lab'
}

export const usePersonalityStore = defineStore('personality', () => {
  const mode = ref<AssessmentMode>('snapshot')
  const currentQuestionIndex = ref(0)
  const responses = ref<Partial<Record<string, ResponseValue>>>({})
  const theme = ref<ThemeId>(getStoredTheme())

  watch(
    theme,
    (nextTheme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      }
    },
    { immediate: true },
  )

  const activeQuestions = computed(() =>
    questionBank.filter((question) => question.modes.includes(mode.value)),
  )

  const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value] ?? null)

  const answeredQuestionCount = computed(
    () =>
      activeQuestions.value.filter((question) => responses.value[question.id] != null).length,
  )

  const progress = computed(() => {
    const total = activeQuestions.value.length

    return {
      current: total === 0 ? 0 : Math.min(currentQuestionIndex.value + 1, total),
      answered: answeredQuestionCount.value,
      total,
      percent: total === 0 ? 0 : Math.round((answeredQuestionCount.value / total) * 100),
    }
  })

  const isComplete = computed(
    () =>
      activeQuestions.value.length > 0 &&
      activeQuestions.value.every((question) => responses.value[question.id] != null),
  )

  const traitResults = computed(() => computeTraitScores(activeQuestions.value, responses.value))
  const mbtiProjection = computed(() => deriveMbtiProjection(traitResults.value))
  const enneagramProjection = computed(() => deriveEnneagramProjection(traitResults.value))
  const strengths = computed(() => deriveStrengthThemes(traitResults.value))
  const archetype = computed(() => deriveArchetype(traitResults.value))
  const canContinueToDeep = computed(() => mode.value === 'snapshot' && isComplete.value)

  const startAssessment = (nextMode: AssessmentMode) => {
    mode.value = nextMode
    currentQuestionIndex.value = 0
    responses.value = {}
  }

  const restartAssessment = () => {
    startAssessment('snapshot')
  }

  const setTheme = (nextTheme: ThemeId) => {
    if (THEMES.includes(nextTheme)) {
      theme.value = nextTheme
    }
  }

  const getResponse = (questionId: string) => responses.value[questionId]

  const setResponse = (questionId: string, value: ResponseValue) => {
    responses.value = {
      ...responses.value,
      [questionId]: value,
    }
  }

  const answerCurrent = (value: ResponseValue) => {
    if (currentQuestion.value == null) {
      return
    }

    setResponse(currentQuestion.value.id, value)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
      currentQuestionIndex.value += 1
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value -= 1
    }
  }

  const continueToDeep = () => {
    mode.value = 'deep'

    const firstUnansweredIndex = activeQuestions.value.findIndex(
      (question) => responses.value[question.id] == null,
    )

    currentQuestionIndex.value =
      firstUnansweredIndex === -1 ? activeQuestions.value.length - 1 : firstUnansweredIndex
  }

  return {
    mode,
    theme,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex,
    progress,
    isComplete,
    traitResults,
    mbtiProjection,
    enneagramProjection,
    strengths,
    archetype,
    canContinueToDeep,
    startAssessment,
    restartAssessment,
    continueToDeep,
    setTheme,
    getResponse,
    setResponse,
    answerCurrent,
    nextQuestion,
    previousQuestion,
  }
})
