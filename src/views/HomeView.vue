<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Zap, Heart, Lightbulb } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { type AssessmentMode, type ThemeId, THEMES, getThemeLabel } from '@/lib/personality'
import { usePersonalityStore } from '@/stores/personality'

const router = useRouter()
const personalityStore = usePersonalityStore()

const themeDescriptions: Record<ThemeId, string> = {
  lab: 'Clinical, bright, and focused.',
  wild: 'Organic, grounded, and calm.',
  nebula: 'Moody, vivid, and cosmic.',
}

const startAssessment = (mode: AssessmentMode) => {
  personalityStore.startAssessment(mode)
  void router.push('/assessment')
}
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-16">
    <section class="space-y-6">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Personality Profiler
      </p>

      <div class="space-y-4">
        <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Find the five elements of you.
        </h1>
        <p class="max-w-2xl text-lg leading-8 text-muted-foreground">
          Discover who you really are through honest questions and genuine insights. Learn how you
          think, what drives you, and what makes you unique—in just a few minutes.
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <Button size="lg" @click="startAssessment('snapshot')"> Get Started </Button>
      </div>

      <div class="mt-8 flex items-center border-y border-border py-4">
        <div class="flex-1 px-4 text-center text-sm text-muted-foreground">
          <div class="mb-2 flex justify-center">
            <Zap class="size-5" />
          </div>
          Instant
        </div>
        <div class="h-12 w-px bg-border -skew-x-12"></div>
        <div class="flex-1 px-4 text-center text-sm text-muted-foreground">
          <div class="mb-2 flex justify-center">
            <Heart class="size-5" />
          </div>
          Honest
        </div>
        <div class="h-12 w-px bg-border -skew-x-12"></div>
        <div class="flex-1 px-4 text-center text-sm text-muted-foreground">
          <div class="mb-2 flex justify-center">
            <Lightbulb class="size-5" />
          </div>
          Insightful
        </div>
      </div>
    </section>

    <footer class="space-y-3 border-t border-border pt-8">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70">Theme</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="themeId in THEMES"
          :key="themeId"
          type="button"
          class="rounded-lg border px-3 py-2 text-sm transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :class="
            personalityStore.theme === themeId
              ? 'border-primary bg-primary/10 font-medium'
              : 'border-border text-muted-foreground'
          "
          @click="personalityStore.setTheme(themeId)"
          :title="themeDescriptions[themeId]"
        >
          {{ getThemeLabel(themeId) }}
        </button>
      </div>
    </footer>
  </main>
</template>
