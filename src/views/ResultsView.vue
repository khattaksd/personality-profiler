<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { CircularGauge } from '@/components/ui/gauge'
import PersonalityHeader from '@/components/personality/PersonalityHeader.vue'
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
    <!-- TOP SECTION: Personality Header -->
    <section class="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <PersonalityHeader
        :archetype-name="personalityStore.archetype.name"
        :archetype-summary="personalityStore.archetype.summary"
        :trait-scores="personalityStore.traitResults"
      />
    </section>

    <!-- MIDDLE SECTION: Trait Gauges -->
    <section class="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-foreground">Core Traits</h2>
        <p class="text-sm text-muted-foreground">How your five traits show up in the world</p>
      </div>
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="trait in personalityStore.traitResults"
          :key="trait.trait"
          class="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <CircularGauge
            :value="trait.simpleScore ?? 0"
            :label="trait.meta.friendlyLabel"
            :size="160"
          />
          <p class="text-center text-sm leading-6 text-muted-foreground">
            {{ trait.summary }}
          </p>
        </div>
      </div>
    </section>

    <!-- BOTTOM SECTION: Secondary Info -->
    <section class="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-foreground">Additional Perspectives</h2>
          <p class="text-sm text-muted-foreground">Other useful frameworks for self-understanding</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" @click="$router.push('/')">
            Back home
          </Button>
          <Button variant="outline" size="sm" @click="startOver">
            Retake snapshot
          </Button>
          <Button v-if="personalityStore.canContinueToDeep" size="sm" @click="goDeeper">
            Go deeper
          </Button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <!-- MBTI -->
        <article class="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div class="space-y-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                MBTI Shorthand
              </p>
              <h3 class="text-3xl font-bold text-primary mt-2">
                {{ personalityStore.mbtiProjection.code }}
              </h3>
            </div>
            <p class="text-sm leading-6 text-muted-foreground">
              {{ personalityStore.mbtiProjection.summary }}
            </p>
          </div>
        </article>

        <!-- Enneagram -->
        <article class="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div class="space-y-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Enneagram Signal
              </p>
              <h3 class="text-3xl font-bold text-primary mt-2">
                Type {{ personalityStore.enneagramProjection.type }}
              </h3>
              <p class="text-sm font-medium text-foreground">{{ personalityStore.enneagramProjection.label }}</p>
            </div>
            <p class="text-sm leading-6 text-muted-foreground">
              {{ personalityStore.enneagramProjection.summary }}
            </p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
