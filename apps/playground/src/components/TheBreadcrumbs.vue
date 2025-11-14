<template>
  <div class="max-w-full overflow-x-auto px-4 py-2 text-sm select-none">
    <ul class="flex min-h-min items-center whitespace-nowrap capitalize">
      <template v-for="(item, i) in items" :key="item.path">
        <li class="flex items-center">
          <template v-if="i > 0">
            <span
              class="border-base-content/70 mr-3 ml-2 block size-1.5 rotate-45 transform border-t-[1px] border-r-[1px] bg-transparent"
            ></span>
          </template>
          <template v-if="item.path !== route.path">
            <RouterLink class="flex items-center hover:underline" :to="item.path">
              {{ item.name }}
            </RouterLink>
          </template>
          <template v-else>
            <span class="text-base-content/70">{{ item.name }}</span>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineProps<{ items: { name: string; path: string }[] }>()
const route = useRoute()
</script>
