import { decodeQuestions } from './questions-obfuscated'

import {
  ASSESSMENT_MODES,
  TRAIT_ORDER,
  type AssessmentMode,
  type PersonalityQuestion,
  type TraitId,
} from '@/lib/personality'

const isTraitId = (value: string): value is TraitId =>
  TRAIT_ORDER.includes(value as TraitId)

const isAssessmentMode = (value: string): value is AssessmentMode =>
  ASSESSMENT_MODES.includes(value as AssessmentMode)

const questionBankCandidate: unknown[] = decodeQuestions()

export const questionBank: PersonalityQuestion[] = questionBankCandidate.map((question) => {
  if (
    typeof question !== 'object' ||
    question == null ||
    !('id' in question) ||
    !('prompt' in question) ||
    !('trait' in question) ||
    !('reverse' in question) ||
    !('modes' in question)
  ) {
    throw new Error('Invalid question shape in src/data/questions.json')
  }

  const { id, prompt, trait, reverse, modes } = question

  if (typeof id !== 'string' || typeof prompt !== 'string' || typeof reverse !== 'boolean') {
    throw new Error(`Invalid primitive field in question ${String(id)}`)
  }

  if (typeof trait !== 'string' || !isTraitId(trait)) {
    throw new Error(`Invalid trait "${String(trait)}" in question ${id}`)
  }

  if (
    !Array.isArray(modes) ||
    !modes.every((mode) => typeof mode === 'string' && isAssessmentMode(mode))
  ) {
    throw new Error(`Invalid modes in question ${id}`)
  }

  return {
    id,
    prompt,
    trait,
    reverse,
    modes,
  }
})
