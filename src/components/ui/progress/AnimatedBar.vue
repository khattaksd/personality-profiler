<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  value: number
  animationDuration?: number
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animationDuration: 1200,
  showLabel: true,
})

const displayValue = ref(0)

const percentage = computed(() => Math.round(displayValue.value))

onMounted(() => {
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.animationDuration, 1)
    // easeOutCubic
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    displayValue.value = props.value * easeProgress
    if (progress < 1) requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-75"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <span v-if="showLabel" class="text-xs font-semibold text-primary whitespace-nowrap">
      {{ percentage }}%
    </span>
  </div>
</template>
