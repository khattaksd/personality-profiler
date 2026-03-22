<script setup lang="ts">
import { computed } from 'vue'
import type { TraitScore } from '@/lib/personality'
import { deriveStrengthThemes } from '@/lib/personality'

interface Props {
  archetypeName: string
  archetypeSummary: string
  traitScores: TraitScore[]
}

const props = defineProps<Props>()

const strengths = computed(() => deriveStrengthThemes(props.traitScores))
</script>

<template>
  <div class="rounded-3xl border border-border bg-card p-8 shadow-sm">
    <!-- Archetype name -->
    <div class="mb-3">
      <div class="text-sm font-semibold text-primary uppercase tracking-wider">Personality Profile</div>
      <h1 class="text-4xl font-bold text-foreground mt-2 mb-3">{{ archetypeName }}</h1>
    </div>

    <!-- Archetype summary -->
    <p class="text-base text-muted-foreground leading-relaxed mb-6">
      {{ archetypeSummary }}
    </p>

    <!-- Top strengths -->
    <div class="mt-6">
      <div class="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Core Essence
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(strength, idx) in strengths"
          :key="`${strength}-${idx}`"
          class="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full"
        >
          {{ strength }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animation on mount */
:deep(.rounded-3xl) {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
