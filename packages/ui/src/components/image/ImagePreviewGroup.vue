<script setup lang="ts">
import { ref, reactive, computed, provide } from 'vue'
import type { ImagePreviewGroupProps, ImagePreviewGroupSlots, ImagePreviewConfig } from './types'
import { IMAGE_GROUP_KEY } from './types'
import ImagePreview from './ImagePreview.vue'

defineOptions({ name: 'AImagePreviewGroup' })
const props = defineProps<ImagePreviewGroupProps>()
defineSlots<ImagePreviewGroupSlots>()

// Map of id -> src for all registered images
const imageMap = reactive(new Map<string, string>())
const imageOrder = ref<string[]>([])

const previewOpen = ref(false)
const previewIndex = ref(0)

const previewConfig = computed<ImagePreviewConfig | false>(() => {
  if (props.preview === false) return false
  if (props.preview === true || props.preview === undefined) return {}
  return props.preview
})

const isPreviewEnabled = computed(() => previewConfig.value !== false)

const mergedPreviewOpen = computed(() => {
  const config = previewConfig.value
  if (config && config.open !== undefined) {
    return config.open
  }
  return previewOpen.value
})

const srcs = computed(() => {
  return imageOrder.value.map((id) => imageMap.get(id) || '').filter(Boolean)
})

function register(id: string, src: string) {
  imageMap.set(id, src)
  if (!imageOrder.value.includes(id)) {
    imageOrder.value.push(id)
  }
}

function unregister(id: string) {
  imageMap.delete(id)
  const idx = imageOrder.value.indexOf(id)
  if (idx > -1) {
    imageOrder.value.splice(idx, 1)
  }
}

function preview(id: string) {
  if (!isPreviewEnabled.value) return
  const idx = imageOrder.value.indexOf(id)
  previewIndex.value = idx > -1 ? idx : 0
  previewOpen.value = true
}

function handlePreviewClose(open: boolean) {
  previewOpen.value = open
}

function handleIndexChange(index: number) {
  previewIndex.value = index
}

provide(IMAGE_GROUP_KEY, {
  register,
  unregister,
  preview,
  isInGroup: true,
})
</script>

<template>
  <div class="ant-image-preview-group">
    <slot />

    <ImagePreview
      v-if="isPreviewEnabled"
      :open="mergedPreviewOpen"
      :srcs="srcs"
      :current-index="previewIndex"
      :get-container="typeof props.preview === 'object' ? props.preview.getContainer : undefined"
      @update:open="handlePreviewClose"
      @update:current-index="handleIndexChange"
    />
  </div>
</template>
