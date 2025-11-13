<script setup lang="ts">
import logoSrc from '~/logo.png?inline';
import { appearance } from '@/composables/appearance';
import { MoonIcon, SunIcon } from "@heroicons/vue/20/solid"

const toggleTheme = () => {
  appearance.value = appearance.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <header class="px-8 py-2 border-b flex justify-between items-center bg-base-100/90 text-base-content border-base-content/10 h-18">
    <div class="flex items-center">
      <img :src="logoSrc" alt="Logo" class="h-8 inline-block mr-3" />
      <h3 class="font-semibold text-xl">Playground</h3>
    </div>

    <div>
      <button @click="toggleTheme" class="cursor-pointer p-2 rounded hover:bg-base-content/10 transition">
        <MoonIcon class="size-4" v-if="appearance === 'light'" />
        <SunIcon class="size-4" v-else />
      </button>
    </div>
  </header>
</template>
