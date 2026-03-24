<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <a-switch v-model:checked="checked" />
</template>
