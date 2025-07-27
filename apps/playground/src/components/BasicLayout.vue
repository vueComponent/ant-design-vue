<template>
  <div class="flex h-screen" :class="pageClass">
    <TheNavbar v-if="!hideNavbar" :items="navs"></TheNavbar>
    <div class="flex-1 justify-center px-4 py-16" :class="contentClass">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { provideLayoutOptions } from '@/composables/layout'
import { computed, ref } from 'vue'
import TheNavbar from './TheNavbar.vue'

const props = defineProps<{
  navs: { name: string; path: string }[]
  hideNavbar?: boolean
  hideBreadcrumbs?: boolean
}>()

const pageClass = ref<string>()
const contentClass = ref<string>()

provideLayoutOptions({
  pageClass,
  contentClass,
  hideNavbar: computed(() => props.hideNavbar),
  hideBreadcrumbs: computed(() => props.hideBreadcrumbs),
})
</script>
