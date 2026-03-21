<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import QuestionCard from '@/components/assessment/QuestionCard.vue'
import { Button } from '@/components/ui/button'
import type { ResponseValue } from '@/lib/personality'
import { usePersonalityStore } from '@/stores/personality'

const router = useRouter()
const personalityStore = usePersonalityStore()

const currentQuestion = computed(() => personalityStore.currentQuestion)
const progressWidth = computed(() => `${personalityStore.progress.percent}%`)
const currentAnswer = computed(() =>
  currentQuestion.value == null ? undefined : personalityStore.getResponse(currentQuestion.value.id),
)

const handleAnswer = (value: ResponseValue) => {
  personalityStore.answerCurrent(value)

  if (personalityStore.isComplete) {
    void router.push('/results')
    return
  }

  personalityStore.nextQuestion()
}

const restart = () => {
  personalityStore.restartAssessment()
}
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-12">
    <header class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {{ personalityStore.mode === 'snapshot' ? 'Snapshot mode' : 'Go deeper mode' }}
          </p>
          <h1 class="text-3xl font-semibold tracking-tight">Answer instinctively.</h1>
        </div>

        <Button variant="ghost" @click="restart">
          Start over
        </Button>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <span>{{ personalityStore.progress.answered }} answered</span>
          <span>{{ personalityStore.progress.total }} total</span>
        </div>
        <div class="h-3 rounded-full bg-muted">
          <div class="h-3 rounded-full bg-primary transition-all duration-300" :style="{ width: progressWidth }" />
        </div>
      </div>
    </header>

    <QuestionCard
      v-if="currentQuestion"
      :question="currentQuestion"
      :answer="currentAnswer"
      :current="personalityStore.progress.current"
      :total="personalityStore.progress.total"
      :can-go-back="personalityStore.currentQuestionIndex > 0"
      @select="handleAnswer"
      @previous="personalityStore.previousQuestion()"
    />

    <section v-else class="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Ready when you are.</h2>
        <p class="text-muted-foreground">
          Start a snapshot from the landing page to begin collecting your profile.
        </p>
        <Button @click="$router.push('/')">
          Back to start
        </Button>
      </div>
    </section>
  </main>
</template>
