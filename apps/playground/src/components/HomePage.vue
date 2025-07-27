<template>
  <div class="flex flex-wrap gap-8 px-8">
    <RouterLink v-for="item in items" :key="item.path" :to="item.path">
      <div
        class="shadow-xs relative flex w-72 flex-col rounded-lg bg-primary capitalize text-primary-content transition-all hover:scale-105 hover:shadow-xl"
      >
        <div className="flex-col gap-2 flex flex-auto p-4 text-sm items-center text-center">
          <h2 className="font-semibold flex items-center gap-2 text-xl mb-1">
            {{ item.name }}
          </h2>
          <div className="flex flex-wrap items-start gap-2 justify-end">
            <ArrowRightIcon class="size-5" />
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRightIcon } from '@heroicons/vue/20/solid'

defineProps<{
  items: { name: string; path: string }[]
}>()
</script>
