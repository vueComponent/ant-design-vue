<template>
  <div class="bg-base-100/90 text-base-content border-base-content/10 border-r">
    <div class="flex min-h-16 w-full items-center p-2">
      <div class="justify-start">
        <div class="group relative inline-block">
          <ul
            tabindex="0"
            class="bg-base-100 z-[1] mt-3 flex w-52 origin-top scale-95 flex-col flex-wrap rounded-lg p-2 text-sm capitalize"
          >
            <li v-for="item in items" :key="item.name">
              <RouterLink
                :aria-disabled="item.path === route.path"
                :to="item.path"
                @click.stop="$event.currentTarget.blur()"
                class="hover:bg-base-content/10 flex cursor-pointer flex-col rounded-lg px-3 py-2 transition duration-200"
              >
                {{ item.name }}
              </RouterLink>
              <ul v-if="item.children">
                <li v-for="child in item.children" :key="child.name">
                  <RouterLink
                    :to="child.path"
                    @click.stop="$event.currentTarget.blur()"
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
