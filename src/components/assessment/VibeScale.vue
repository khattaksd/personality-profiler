<script setup lang="ts">
import { Circle } from 'lucide-vue-next'
import type { ResponseValue } from '@/lib/personality'

const props = defineProps<{
  modelValue?: ResponseValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ResponseValue]
}>()

const options: Array<{ value: ResponseValue; label: string }> = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
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
        class="flex min-h-16 items-center justify-center rounded-2xl border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :class="
          modelValue === option.value
            ? 'scale-105 border-primary bg-primary shadow-lg shadow-primary/20'
            : 'border-border'
        "
        @click="emit('update:modelValue', option.value)"
      >
        <Circle
          class="size-5"
          :class="
            modelValue === option.value
              ? 'fill-primary-foreground stroke-primary-foreground'
              : 'stroke-muted-foreground'
          "
        />
      </button>
    </div>

    <p class="text-center text-sm text-muted-foreground">
      {{ options.find((option) => option.value === props.modelValue)?.label }}
    </p>
  </div>
</template>
