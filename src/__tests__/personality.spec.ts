import { describe, expect, it } from 'vitest'

import {
  calculatePopulationPercentile,
  computeTraitScores,
  deriveMbtiProjection,
  type PersonalityQuestion,
} from '@/lib/personality'

describe('personality scoring helpers', () => {
  it('applies reverse scoring before averaging', () => {
    const questions: PersonalityQuestion[] = [
      {
        id: 'q1',
        prompt: 'Forward scored openness question',
        trait: 'openness',
        reverse: false,
        modes: ['snapshot'],
      },
      {
        id: 'q2',
        prompt: 'Reverse scored openness question',
        trait: 'openness',
        reverse: true,
        modes: ['snapshot'],
      },
    ]

    const openness = computeTraitScores(questions, {
      q1: 5,
      q2: 1,
    }).find((score) => score.trait === 'openness')

    expect(openness).toBeDefined()
    expect(openness?.rawAverage).toBe(5)
    expect(openness?.simpleScore).toBe(100)
  })

  it('centers the population percentile around the configured mean', () => {
    expect(calculatePopulationPercentile('conscientiousness', 3.4)).toBe(50)
    expect(calculatePopulationPercentile('conscientiousness', 4.4)).toBeGreaterThan(50)
  })

  it('derives an MBTI-style shorthand from OCEAN scores', () => {
    const projection = deriveMbtiProjection([
      {
        trait: 'openness',
        meta: {
          name: 'Openness',
          friendlyLabel: 'The Horizon',
          friendlyDescription: 'Exploring new ideas',
          lowInsight: '',
          balancedInsight: '',
          highInsight: '',
        },
        answered: 2,
        total: 2,
        rawAverage: 4.5,
        simpleScore: 88,
        percentile: 75,
        intensity: 'pronounced',
        summary: '',
      },
      {
        trait: 'conscientiousness',
        meta: {
          name: 'Conscientiousness',
          friendlyLabel: 'The Blueprint',
          friendlyDescription: 'Structure and planning',
          lowInsight: '',
          balancedInsight: '',
          highInsight: '',
        },
        answered: 2,
        total: 2,
        rawAverage: 4.4,
        simpleScore: 85,
        percentile: 72,
        intensity: 'pronounced',
        summary: '',
      },
      {
        trait: 'extraversion',
        meta: {
          name: 'Extraversion',
          friendlyLabel: 'The Spark',
          friendlyDescription: 'Social energy',
          lowInsight: '',
          balancedInsight: '',
          highInsight: '',
        },
        answered: 2,
        total: 2,
        rawAverage: 4.3,
        simpleScore: 83,
        percentile: 77,
        intensity: 'pronounced',
        summary: '',
      },
      {
        trait: 'agreeableness',
        meta: {
          name: 'Agreeableness',
          friendlyLabel: 'The Anchor',
          friendlyDescription: 'Trust and cooperation',
          lowInsight: '',
          balancedInsight: '',
          highInsight: '',
        },
        answered: 2,
        total: 2,
        rawAverage: 4.2,
        simpleScore: 80,
        percentile: 65,
        intensity: 'pronounced',
        summary: '',
      },
      {
        trait: 'neuroticism',
        meta: {
          name: 'Neuroticism',
          friendlyLabel: 'The Pulse',
          friendlyDescription: 'Emotional sensitivity',
          lowInsight: '',
          balancedInsight: '',
          highInsight: '',
        },
        answered: 2,
        total: 2,
        rawAverage: 2.3,
        simpleScore: 33,
        percentile: 32,
        intensity: 'emerging',
        summary: '',
      },
    ])

    expect(projection.code).toBe('ENFJ')
  })
})
