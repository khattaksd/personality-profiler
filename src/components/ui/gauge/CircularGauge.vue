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
  size: 180,
  strokeWidth: 6,
  animationDuration: 1500,
  label: undefined,
})

const displayValue = ref(0)
const radius = 80
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  const percentage = Math.min(Math.max(displayValue.value, 0), 100) / 100
  return circumference * (1 - percentage)
})

// Responsive text sizing based on gauge size
const textSize = computed(() => {
  return Math.round((props.size / 180) * 36)
})

const percentTextSize = computed(() => {
  return Math.round((props.size / 180) * 12)
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
  <div class="flex flex-col items-center gap-2 w-full">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 200 200"
      class="drop-shadow-md"
      :aria-label="`${label || 'Gauge'}: ${Math.round(displayValue)}%`"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: hsl(var(--color-primary))" />
          <stop
            offset="100%"
            style="stop-color: hsl(var(--color-primary)); stop-opacity: 0.85"
          />
        </linearGradient>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="center-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: rgba(255,255,255,0.95)" />
          <stop offset="100%" style="stop-color: rgba(255,255,255,0.85)" />
        </radialGradient>
      </defs>

      <!-- Background circle -->
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="hsl(var(--color-muted))"
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray="502.65 502.65"
        stroke-dashoffset="0"
        transform="rotate(225 100 100)"
        opacity="0.25"
      />

      <!-- Progress circle (animated) with glow -->
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="url(#gauge-gradient)"
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray="502.65 502.65"
        :stroke-dashoffset="strokeDashoffset"
        transform="rotate(225 100 100)"
        class="gauge-progress"
        filter="url(#soft-glow)"
      />

      <!-- Center circle with gradient background -->
      <circle cx="100" cy="100" r="50" fill="url(#center-gradient)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />

      <!-- Value text - single line, responsive -->
      <text
        x="100"
        y="100"
        text-anchor="middle"
        dominant-baseline="central"
        :font-size="textSize"
        font-weight="700"
        fill="hsl(var(--color-primary))"
        class="font-family-sans"
      >
        {{ Math.round(displayValue) }}<tspan :font-size="percentTextSize" dx="2">%</tspan>
      </text>
    </svg>

    <p v-if="label" class="text-xs md:text-sm font-semibold text-muted-foreground text-center px-2 line-clamp-2">
      {{ label }}
    </p>
  </div>
</template>

<style scoped>
.gauge-progress {
  transition: stroke-dashoffset 50ms linear;
}

@media (max-width: 640px) {
  :deep(svg) {
    max-width: 140px;
    height: auto;
  }
}

/* Smooth rendering */
svg {
  shape-rendering: geometricPrecision;
}
</style>
