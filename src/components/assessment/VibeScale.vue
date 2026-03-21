<script setup lang="ts">
import type { ResponseValue } from '@/lib/personality'

const props = defineProps<{
  modelValue?: ResponseValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ResponseValue]
}>()

const options: Array<{ value: ResponseValue; label: string; shortLabel: string }> = [
  { value: 1, label: 'Strongly disagree', shortLabel: '1' },
  { value: 2, label: 'Disagree', shortLabel: '2' },
  { value: 3, label: 'Neutral', shortLabel: '3' },
  { value: 4, label: 'Agree', shortLabel: '4' },
  { value: 5, label: 'Strongly agree', shortLabel: '5' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      <span>Not like me</span>
      <span>Very like me</span>
    </div>

    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :aria-label="option.label"
        :aria-pressed="modelValue === option.value"
        class="flex min-h-16 items-center justify-center rounded-2xl border bg-card text-lg font-semibold text-card-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :class="
          modelValue === option.value
            ? 'scale-105 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'border-border'
        "
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.shortLabel }}
      </button>
    </div>

    <p class="text-center text-sm text-muted-foreground">
      {{ options.find((option) => option.value === props.modelValue)?.label ?? 'Choose the segment that feels closest to you.' }}
    </p>
  </div>
</template>
