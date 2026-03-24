<template>
  <a-theme :appearance="appearance">
    <div class="app-layout">
      <AppSidebar />
      <main class="app-main">
        <RouterView />
      </main>
      <button class="theme-toggle" :title="`Switch to ${appearance === 'light' ? 'dark' : 'light'}`" @click="toggleTheme">
        {{ appearance === 'light' ? '☾' : '☀' }}
      </button>
    </div>
  </a-theme>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '#/components/AppSidebar.vue'

const appearance = ref('light')
const toggleTheme = () => {
  appearance.value = appearance.value === 'light' ? 'dark' : 'light'
}
</script>

<style>
.app-layout {
  display: flex;
  height: 100vh;
}

.app-main {
  flex: 1;
  margin-left: 220px;
  overflow: auto;
  height: 100vh;
}

.theme-toggle {
  position: fixed;
  top: 8px;
  right: 12px;
  z-index: 100;
  width: 32px;
  height: 32px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.theme-toggle:hover {
  border-color: #1677ff;
}
</style>
