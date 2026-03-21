export const TRAIT_ORDER = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
] as const

export const ASSESSMENT_MODES = ['snapshot', 'deep'] as const
export const THEMES = ['lab', 'wild', 'nebula'] as const
export const RESPONSE_OPTIONS = [1, 2, 3, 4, 5] as const

export type TraitId = (typeof TRAIT_ORDER)[number]
export type AssessmentMode = (typeof ASSESSMENT_MODES)[number]
export type ThemeId = (typeof THEMES)[number]
export type ResponseValue = (typeof RESPONSE_OPTIONS)[number]

export interface PersonalityQuestion {
  id: string
  prompt: string
  trait: TraitId
  reverse: boolean
  modes: AssessmentMode[]
}

export interface TraitMeta {
  name: string
  friendlyLabel: string
  friendlyDescription: string
  lowInsight: string
  balancedInsight: string
  highInsight: string
}

export interface TraitScore {
  trait: TraitId
  meta: TraitMeta
  answered: number
  total: number
  rawAverage: number | null
  simpleScore: number | null
  percentile: number | null
  intensity: 'unknown' | 'emerging' | 'balanced' | 'pronounced'
  summary: string
}

export interface MbtiProjection {
  code: string
  breakdown: {
    energy: 'E' | 'I'
    perception: 'S' | 'N'
    decision: 'T' | 'F'
    structure: 'J' | 'P'
  }
  summary: string
}

export interface EnneagramProjection {
  type: number
  label: string
  summary: string
}

export interface ArchetypeSummary {
  name: string
  summary: string
}

export const TRAIT_META: Record<TraitId, TraitMeta> = {
  openness: {
    name: 'Openness',
    friendlyLabel: 'The Horizon',
    friendlyDescription: 'Exploring new ideas',
    lowInsight: 'You prefer proven paths, practical ideas, and grounded experimentation.',
    balancedInsight: 'You balance curiosity with realism and adapt without losing your footing.',
    highInsight: 'You are energized by novelty, imagination, and wide-angle thinking.',
  },
  conscientiousness: {
    name: 'Conscientiousness',
    friendlyLabel: 'The Blueprint',
    friendlyDescription: 'Structure and planning',
    lowInsight: 'You stay flexible and spontaneous, but structure can feel easy to postpone.',
    balancedInsight: 'You can organize when needed while still keeping room for improvisation.',
    highInsight: 'You thrive on clarity, follow-through, and building reliable systems.',
  },
  extraversion: {
    name: 'Extraversion',
    friendlyLabel: 'The Spark',
    friendlyDescription: 'Social energy',
    lowInsight: 'You recharge inwardly and usually prefer depth, calm, and quieter settings.',
    balancedInsight: 'You can move between solitude and social momentum with ease.',
    highInsight: 'You gain energy from interaction, visibility, and shared momentum.',
  },
  agreeableness: {
    name: 'Agreeableness',
    friendlyLabel: 'The Anchor',
    friendlyDescription: 'Trust and cooperation',
    lowInsight: 'You are direct and independent, sometimes prioritizing candor over harmony.',
    balancedInsight: 'You can be empathetic without losing your ability to challenge and decide.',
    highInsight: 'You lead with empathy, cooperation, and a strong instinct for connection.',
  },
  neuroticism: {
    name: 'Neuroticism',
    friendlyLabel: 'The Pulse',
    friendlyDescription: 'Emotional sensitivity',
    lowInsight: 'You are usually steady under pressure and recover quickly from disruption.',
    balancedInsight: 'You notice emotional shifts without being fully ruled by them.',
    highInsight: 'You feel life intensely and can be highly responsive to stress and uncertainty.',
  },
}

export const POPULATION_MEANS: Record<TraitId, number> = {
  openness: 3.5,
  conscientiousness: 3.4,
  extraversion: 3.2,
  agreeableness: 3.6,
  neuroticism: 3.0,
}

const THEME_LABELS: Record<ThemeId, string> = {
  lab: 'The Lab',
  wild: 'The Wild',
  nebula: 'The Nebula',
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const isThemeId = (value: string | null | undefined): value is ThemeId =>
  value != null && THEMES.includes(value as ThemeId)

export const getThemeLabel = (theme: ThemeId) => THEME_LABELS[theme]

export const getScoreIntensity = (
  score: number | null,
): TraitScore['intensity'] => {
  if (score == null) {
    return 'unknown'
  }

  if (score < 34) {
    return 'emerging'
  }

  if (score < 67) {
    return 'balanced'
  }

  return 'pronounced'
}

export const getTraitInsight = (trait: TraitId, score: number | null) => {
  const meta = TRAIT_META[trait]
  const intensity = getScoreIntensity(score)

  switch (intensity) {
    case 'emerging':
      return meta.lowInsight
    case 'balanced':
      return meta.balancedInsight
    case 'pronounced':
      return meta.highInsight
    default:
      return `Answer more ${meta.friendlyLabel.toLowerCase()} questions to unlock this insight.`
  }
}

export const applyReverseScoring = (value: ResponseValue, reverse: boolean) =>
  reverse ? ((6 - value) as ResponseValue) : value

export const normalizeSimpleScore = (rawAverage: number) =>
  Math.round(((rawAverage - 1) / 4) * 100)

export const calculatePopulationPercentile = (trait: TraitId, rawAverage: number) => {
  const mean = POPULATION_MEANS[trait]

  return Math.round(clamp(50 + ((rawAverage - mean) / 2) * 50, 1, 99))
}

const getTraitValue = (scores: TraitScore[], trait: TraitId) =>
  scores.find((score) => score.trait === trait)?.simpleScore ?? 50

export const computeTraitScores = (
  questions: PersonalityQuestion[],
  responses: Partial<Record<string, ResponseValue>>,
) =>
  TRAIT_ORDER.map((trait) => {
    const traitQuestions = questions.filter((question) => question.trait === trait)
    const answeredValues = traitQuestions.flatMap((question) => {
      const response = responses[question.id]

      if (response == null) {
        return []
      }

      return [applyReverseScoring(response, question.reverse)]
    })

    if (answeredValues.length === 0) {
      return {
        trait,
        meta: TRAIT_META[trait],
        answered: 0,
        total: traitQuestions.length,
        rawAverage: null,
        simpleScore: null,
        percentile: null,
        intensity: 'unknown' as const,
        summary: getTraitInsight(trait, null),
      }
    }

    const rawAverage =
      answeredValues.reduce((sum, value) => sum + value, 0) / answeredValues.length
    const simpleScore = normalizeSimpleScore(rawAverage)

    return {
      trait,
      meta: TRAIT_META[trait],
      answered: answeredValues.length,
      total: traitQuestions.length,
      rawAverage: Number(rawAverage.toFixed(2)),
      simpleScore,
      percentile: calculatePopulationPercentile(trait, rawAverage),
      intensity: getScoreIntensity(simpleScore),
      summary: getTraitInsight(trait, simpleScore),
    }
  })

export const deriveMbtiProjection = (scores: TraitScore[]): MbtiProjection => {
  const energy = getTraitValue(scores, 'extraversion') >= 55 ? 'E' : 'I'
  const perception = getTraitValue(scores, 'openness') >= 55 ? 'N' : 'S'
  const decision = getTraitValue(scores, 'agreeableness') >= 55 ? 'F' : 'T'
  const structure = getTraitValue(scores, 'conscientiousness') >= 55 ? 'J' : 'P'
  const code = `${energy}${perception}${decision}${structure}`

  return {
    code,
    breakdown: { energy, perception, decision, structure },
    summary: `${code} suggests how your OCEAN profile currently leans when translated into a familiar four-letter shorthand.`,
  }
}

export const deriveEnneagramProjection = (scores: TraitScore[]): EnneagramProjection => {
  const openness = getTraitValue(scores, 'openness')
  const conscientiousness = getTraitValue(scores, 'conscientiousness')
  const extraversion = getTraitValue(scores, 'extraversion')
  const agreeableness = getTraitValue(scores, 'agreeableness')
  const neuroticism = getTraitValue(scores, 'neuroticism')

  if (conscientiousness >= 65 && neuroticism >= 55) {
    return {
      type: 1,
      label: 'The Idealist',
      summary: 'Order, standards, and internal pressure point toward a principled Type 1 flavor.',
    }
  }

  if (agreeableness >= 65 && neuroticism >= 55) {
    return {
      type: 2,
      label: 'The Advocate',
      summary: 'Connection, care, and emotional attunement create a helper-style Type 2 profile.',
    }
  }

  if (extraversion >= 65 && conscientiousness >= 60) {
    return {
      type: 3,
      label: 'The Achiever',
      summary: 'Drive, visibility, and forward momentum line up with an ambitious Type 3 pattern.',
    }
  }

  if (openness >= 65 && neuroticism >= 55) {
    return {
      type: 4,
      label: 'The Individualist',
      summary: 'Depth, originality, and emotional richness resemble a Type 4 orientation.',
    }
  }

  if (openness >= 65 && conscientiousness >= 55) {
    return {
      type: 5,
      label: 'The Investigator',
      summary: 'Curiosity paired with disciplined observation points toward a Type 5 style.',
    }
  }

  if (agreeableness >= 60 && conscientiousness >= 60) {
    return {
      type: 6,
      label: 'The Loyalist',
      summary: 'Steadiness, responsibility, and commitment suggest a dependable Type 6 profile.',
    }
  }

  if (extraversion >= 65 && openness >= 60) {
    return {
      type: 7,
      label: 'The Enthusiast',
      summary: 'High stimulation-seeking and idea energy align with a Type 7 flavor.',
    }
  }

  if (extraversion >= 60 && agreeableness < 50) {
    return {
      type: 8,
      label: 'The Challenger',
      summary: 'Assertive, forceful energy with lower accommodation echoes a Type 8 stance.',
    }
  }

  return {
    type: 9,
    label: 'The Peacemaker',
    summary: 'Calm, steadying energy with a cooperative center lands closest to Type 9.',
  }
}

export const deriveStrengthThemes = (scores: TraitScore[]) => {
  const strengths = [
    {
      score: getTraitValue(scores, 'conscientiousness'),
      labels: ['Discipline', 'Focus', 'Responsibility'],
    },
    {
      score: getTraitValue(scores, 'openness'),
      labels: ['Ideation', 'Strategy', 'Adaptability'],
    },
    {
      score: getTraitValue(scores, 'extraversion'),
      labels: ['Communication', 'Activator', 'Woo'],
    },
    {
      score: getTraitValue(scores, 'agreeableness'),
      labels: ['Empathy', 'Relator', 'Harmony'],
    },
    {
      score: 100 - getTraitValue(scores, 'neuroticism'),
      labels: ['Calm', 'Resilience', 'Grounded Presence'],
    },
  ]
    .sort((left, right) => right.score - left.score)
    .flatMap((entry) => entry.labels)

  return Array.from(new Set(strengths)).slice(0, 5)
}

export const deriveArchetype = (scores: TraitScore[]): ArchetypeSummary => {
  const openness = getTraitValue(scores, 'openness')
  const conscientiousness = getTraitValue(scores, 'conscientiousness')
  const extraversion = getTraitValue(scores, 'extraversion')
  const agreeableness = getTraitValue(scores, 'agreeableness')
  const neuroticism = getTraitValue(scores, 'neuroticism')

  if (openness >= 60 && conscientiousness >= 60) {
    return {
      name: 'The Architect',
      summary: 'You combine imagination with structure and like turning ideas into durable systems.',
    }
  }

  if (openness >= 60 && extraversion >= 60) {
    return {
      name: 'The Visionary',
      summary: 'You generate momentum by turning fresh ideas into contagious possibility.',
    }
  }

  if (conscientiousness >= 60 && agreeableness >= 60) {
    return {
      name: 'The Steward',
      summary: 'You are dependable, thoughtful, and motivated by helping things run well for others.',
    }
  }

  if (extraversion >= 60 && agreeableness >= 60) {
    return {
      name: 'The Catalyst',
      summary: 'You lift group energy quickly and often become the social spark in the room.',
    }
  }

  if (agreeableness >= 60 && neuroticism < 45) {
    return {
      name: 'The Anchor',
      summary: 'You bring steadiness, reassurance, and a calming presence when things get noisy.',
    }
  }

  if (conscientiousness >= 60 && neuroticism < 45) {
    return {
      name: 'The Strategist',
      summary: 'You stay composed, think ahead, and naturally build plans that others can trust.',
    }
  }

  if (extraversion >= 60 && neuroticism >= 55) {
    return {
      name: 'The Firestarter',
      summary: 'You feel and express intensity quickly, which can create both magnetism and urgency.',
    }
  }

  return {
    name: 'The Pathfinder',
    summary: 'You are learning your natural pattern and already show a flexible, exploratory core.',
  }
}
