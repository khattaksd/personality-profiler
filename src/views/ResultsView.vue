<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { usePersonalityStore } from '@/stores/personality'

const router = useRouter()
const personalityStore = usePersonalityStore()

const startOver = () => {
  personalityStore.restartAssessment()
  void router.push('/assessment')
}

const goDeeper = () => {
  personalityStore.continueToDeep()
  void router.push('/assessment')
}
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
    <section class="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Your current profile
          </p>
          <h1 class="text-4xl font-semibold tracking-tight text-balance">
            {{ personalityStore.archetype.name }}
          </h1>
          <p class="max-w-3xl text-base leading-7 text-muted-foreground">
            {{ personalityStore.archetype.summary }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <Button variant="outline" @click="$router.push('/')">
            Back home
          </Button>
          <Button variant="outline" @click="startOver">
            Retake snapshot
          </Button>
          <Button v-if="personalityStore.canContinueToDeep" @click="goDeeper">
            Go deeper
          </Button>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="trait in personalityStore.traitResults"
          :key="trait.trait"
          class="rounded-3xl border border-border bg-card p-5 shadow-sm"
        >
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {{ trait.meta.friendlyLabel }}
              </p>
              <h2 class="text-xl font-semibold">{{ trait.meta.name }}</h2>
              <p class="text-sm text-muted-foreground">{{ trait.meta.friendlyDescription }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-2xl bg-muted p-3">
                <p class="text-muted-foreground">Simple</p>
                <p class="text-lg font-semibold">{{ trait.simpleScore ?? '--' }}%</p>
              </div>
              <div class="rounded-2xl bg-muted p-3">
                <p class="text-muted-foreground">Percentile</p>
                <p class="text-lg font-semibold">{{ trait.percentile ?? '--' }}</p>
              </div>
            </div>

            <p class="text-sm leading-6 text-muted-foreground">
              {{ trait.summary }}
            </p>
          </div>
        </article>
      </div>

      <aside class="space-y-4">
        <article class="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div class="space-y-3">
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Secondary lenses
            </p>
            <div>
              <h2 class="text-xl font-semibold">MBTI shorthand: {{ personalityStore.mbtiProjection.code }}</h2>
              <p class="text-sm leading-6 text-muted-foreground">
                {{ personalityStore.mbtiProjection.summary }}
              </p>
            </div>
            <div>
              <h2 class="text-xl font-semibold">
                Enneagram signal: Type {{ personalityStore.enneagramProjection.type }}
              </h2>
              <p class="text-sm leading-6 text-muted-foreground">
                {{ personalityStore.enneagramProjection.label }} — {{ personalityStore.enneagramProjection.summary }}
              </p>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div class="space-y-3">
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Top strengths
            </p>
            <ul class="space-y-2">
              <li
                v-for="strength in personalityStore.strengths"
                :key="strength"
                class="rounded-2xl bg-muted px-4 py-3 text-sm font-medium"
              >
                {{ strength }}
              </li>
            </ul>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>
