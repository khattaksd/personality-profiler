<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'

import { usePersonalityStore } from '@/stores/personality'

const personalityStore = usePersonalityStore()

watch(
  () => personalityStore.theme,
  (theme) => {
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('dark', theme === 'nebula')
  },
  { immediate: true },
)
</script>

<template>
  <RouterView />
</template>
