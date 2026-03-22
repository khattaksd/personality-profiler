<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  value: number
  label?: string
  size?: number
  strokeWidth?: number
  animationDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  strokeWidth: 8,
  animationDuration: 1500,
  label: undefined,
})

const displayValue = ref(0)
const radius = 85
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  const percentage = Math.min(Math.max(displayValue.value, 0), 100) / 100
  return circumference * (1 - percentage)
})

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
  <div class="flex flex-col items-center gap-3">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 200 200"
      class="drop-shadow-sm"
      :aria-label="`${label || 'Gauge'}: ${Math.round(displayValue)}%`"
    >
      <defs>
        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: hsl(var(--color-primary))" />
          <stop
            offset="100%"
            style="stop-color: hsl(var(--color-primary)); stop-opacity: 0.7"
          />
        </linearGradient>
      </defs>

      <!-- Background circle -->
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="hsl(var(--color-muted))"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="471.24 471.24"
        stroke-dashoffset="0"
        transform="rotate(225 100 100)"
        opacity="0.3"
      />

      <!-- Progress circle (animated) -->
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="url(#gauge-gradient)"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="471.24 471.24"
        :stroke-dashoffset="strokeDashoffset"
        transform="rotate(225 100 100)"
        class="transition-all duration-75"
      />

      <!-- Center circle -->
      <circle cx="100" cy="100" r="50" fill="white" filter="drop-shadow(0 0 8px rgba(0,0,0,0.05))" />

      <!-- Value text -->
      <text
        x="100"
        y="95"
        text-anchor="middle"
        font-size="48"
        font-weight="bold"
        fill="hsl(var(--color-primary))"
      >
        {{ Math.round(displayValue) }}
      </text>

      <!-- Unit text -->
      <text x="100" y="115" text-anchor="middle" font-size="14" fill="rgba(0,0,0,0.5)">
        %
      </text>
    </svg>

    <p v-if="label" class="text-sm font-medium text-muted-foreground">
      {{ label }}
    </p>
  </div>
</template>

<style scoped>
circle[stroke="url(#gauge-gradient)"] {
  transition: stroke-dashoffset 50ms linear;
}
</style>
