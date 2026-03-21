<script setup lang="ts">
import { ArrowUpRightIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-6 py-16">
    <section class="flex max-w-xl flex-col items-center gap-6 text-center">
      <div class="space-y-3">
        <p class="text-sm font-medium text-muted-foreground">Vue + Vite + Tailwind + Shadcn/Vue</p>
        <h1 class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Shadcn/Vue is ready to use
        </h1>
        <p class="text-base leading-7 text-muted-foreground">
          Start adding components with
          <code class="rounded bg-muted px-2 py-1 text-sm">npx shadcn-vue@latest add button</code>
          and compose your UI from there.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button>Primary action</Button>
        <Button variant="outline" as-child>
          <a href="https://www.shadcn-vue.com/docs/introduction.html" target="_blank" rel="noopener">
            Read the docs
            <ArrowUpRightIcon />
          </a>
        </Button>
      </div>
    </section>
  </main>
</template>
