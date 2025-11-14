<template>
  <div class="text-base-content border-base-content/10 border-r">
    <div class="flex min-h-16 w-full p-2 pr-0 h-[calc(100vh-72px)] overflow-scroll">
      <div class="justify-start">
        <div class="group relative inline-block">
          <ul
            tabindex="0"
            class="z-1 mt-3 flex w-54 origin-top scale-95 flex-col rounded-lg p-2 text-sm capitalize"
          >
            <li v-for="item in items" :key="item.name" class="mb-2">
              <RouterLink
                :aria-disabled="item.path === route.path"
                :to="item.path"
                class="hover:bg-base-content/10 flex cursor-pointer flex-col rounded-lg px-3 py-2 transition duration-200"
              >
                {{ item.name }} 
              </RouterLink>
              <ul v-if="item.children">
                <li v-for="child in item.children" :key="child.name">
                  <RouterLink
                    :to="child.path"
                    class="hover:bg-base-content/10 flex cursor-pointer flex-col rounded-lg px-3 py-2 text-xs opacity-80 transition duration-200"
                  >
                    {{ child.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineProps<{
  items: { name: string; path: string; children?: { name: string; path: string }[] }[]
}>()
const route = useRoute()
</script>
