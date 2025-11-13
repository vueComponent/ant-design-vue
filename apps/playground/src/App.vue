<template>
  <the-header /> 
  <a-theme :appearance="appearance">
    <RouterView />
  </a-theme>
</template>
<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import { appearance } from '@/composables/appearance';
</script>
