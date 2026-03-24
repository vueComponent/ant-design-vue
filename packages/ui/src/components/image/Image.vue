<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined'
import type { ImageProps, ImageEmits, ImageSlots, ImagePreviewConfig } from './types'
import { imageDefaultProps, IMAGE_GROUP_KEY } from './types'
import ImagePreview from './ImagePreview.vue'

defineOptions({ name: 'AImage' })
const props = withDefaults(defineProps<ImageProps>(), {
  preview: undefined,
})
const emit = defineEmits<ImageEmits>()
defineSlots<ImageSlots>()

const group = inject(IMAGE_GROUP_KEY, null)

// Unique id for group registration
let uid = ''
if (typeof crypto !== 'undefined' && crypto.randomUUID) {
  uid = crypto.randomUUID()
} else {
  uid = `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const isError = ref(false)
const isLoaded = ref(false)
const previewOpen = ref(false)

const mergedSrc = computed(() => {
  if (isError.value && props.fallback) {
    return props.fallback
  }
  return props.src
})

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

const wrapperClasses = computed(() => [
  'ant-image',
  {
    'ant-image-error': isError.value,
  },
  props.wrapperClassName,
])

const imgStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width != null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height != null) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return style
})

function handleError(e: Event) {
  isError.value = true
  emit('error', e)
}

function handleLoad() {
  isLoaded.value = true
}

function handleClick(e: MouseEvent) {
  emit('click', e)
  if (!isPreviewEnabled.value || isError.value) return

  if (group) {
    group.preview(uid)
  } else {
    previewOpen.value = true
  }
}

function handlePreviewClose(open: boolean) {
  previewOpen.value = open
}

// Register with group
onMounted(() => {
  if (group && props.src) {
    group.register(uid, props.src)
  }
})

onBeforeUnmount(() => {
  if (group) {
    group.unregister(uid)
  }
})
</script>

<template>
  <div :class="wrapperClasses" :style="wrapperStyle">
    <!-- Placeholder -->
    <div v-if="placeholder && !isLoaded && !isError" class="ant-image-placeholder">
      <slot name="placeholder">
        <div class="ant-image-placeholder-default" />
      </slot>
    </div>

    <!-- Image -->
    <img
      class="ant-image-img"
      :src="mergedSrc"
      :alt="alt"
      :style="imgStyle"
      :width="width"
      :height="height"
      @error="handleError"
      @load="handleLoad"
      @click="handleClick"
    />

    <!-- Preview mask overlay -->
    <div
      v-if="isPreviewEnabled && !isError"
      class="ant-image-mask"
      :class="typeof preview === 'object' ? preview.maskClassName : undefined"
      @click="handleClick"
    >
      <slot name="previewMask">
        <div class="ant-image-mask-info">
          <EyeOutlined />
          <span>Preview</span>
        </div>
      </slot>
    </div>

    <!-- Standalone preview (not in group) -->
    <ImagePreview
      v-if="!group && isPreviewEnabled"
      :open="mergedPreviewOpen"
      :src="mergedSrc"
      :get-container="typeof preview === 'object' ? preview.getContainer : undefined"
      @update:open="handlePreviewClose"
    />
  </div>
</template>
