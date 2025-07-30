<template>
  <button @click="toggleTheme" class="fixed top-2 right-2">toggle {{ appearance }}</button>
  <a-theme :appearance="appearance">
    <RouterView />
  </a-theme>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const appearance = ref('light')

const toggleTheme = () => {
  appearance.value = appearance.value === 'light' ? 'dark' : 'light'
}
</script>
