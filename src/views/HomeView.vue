<script setup lang="ts">
import { useRouter } from 'vue-router'

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
  <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16">
    <section class="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
      <div class="space-y-6">
        <p class="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Personality Profiler
        </p>

        <div class="space-y-4">
          <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find the five elements of you.
          </h1>
          <p class="max-w-2xl text-lg leading-8 text-muted-foreground">
            A mobile-first personality experience powered by the Big Five, translated into friendly labels,
            fast insights, and a frictionless snapshot-first flow.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <Button size="lg" @click="startAssessment('snapshot')">
            Start the Snapshot
          </Button>
          <Button size="lg" variant="outline" @click="startAssessment('deep')">
            Go Deeper
          </Button>
        </div>

        <div class="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div class="rounded-2xl border border-border bg-card p-4">
            Under 60 seconds to first results.
          </div>
          <div class="rounded-2xl border border-border bg-card p-4">
            Big Five scoring with friendly labels.
          </div>
          <div class="rounded-2xl border border-border bg-card p-4">
            Shadcn/Vue UI on top of Tailwind v4.
          </div>
        </div>
      </div>

      <section class="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div class="space-y-5">
          <div class="space-y-2">
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Theme selector
            </p>
            <h2 class="text-2xl font-semibold">Pick your vibe first</h2>
            <p class="text-sm leading-6 text-muted-foreground">
              Theme state lives in Pinia and updates the app instantly through CSS variables.
            </p>
          </div>

          <div class="grid gap-3">
            <button
              v-for="themeId in THEMES"
              :key="themeId"
              type="button"
              class="rounded-2xl border p-4 text-left transition hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :class="
                personalityStore.theme === themeId
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background'
              "
              @click="personalityStore.setTheme(themeId)"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-medium">{{ getThemeLabel(themeId) }}</p>
                  <p class="text-sm text-muted-foreground">{{ themeDescriptions[themeId] }}</p>
                </div>
                <span
                  class="size-3 rounded-full"
                  :class="{
                    'bg-slate-400': themeId === 'lab',
                    'bg-emerald-500': themeId === 'wild',
                    'bg-violet-500': themeId === 'nebula',
                  }"
                />
              </div>
            </button>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>
