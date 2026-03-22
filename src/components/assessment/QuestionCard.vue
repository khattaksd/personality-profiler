<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { PersonalityQuestion, ResponseValue } from '@/lib/personality'

import VibeScale from './VibeScale.vue'

defineProps<{
  question: PersonalityQuestion
  answer?: ResponseValue
  current: number
  total: number
  canGoBack: boolean
}>()

const emit = defineEmits<{
  select: [value: ResponseValue]
  previous: []
}>()
</script>

<template>
  <article class="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
    <div class="space-y-6">
      <div class="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{{ current }} / {{ total }}</span>
        <span>{{ question.trait }}</span>
      </div>

      <div class="space-y-3">
        <h1 class="min-h-20 text-2xl font-semibold leading-tight sm:text-3xl sm:min-h-24">
          {{ question.prompt }}
        </h1>
      </div>

      <VibeScale :model-value="answer" @update:model-value="emit('select', $event)" />

      <div class="flex justify-between gap-3">
        <Button v-if="canGoBack" variant="ghost" @click="emit('previous')">
          Previous
        </Button>
        <div v-else />

        <p class="text-right text-sm text-muted-foreground">
          Tap once to answer and move forward.
        </p>
      </div>
    </div>
  </article>
</template>
