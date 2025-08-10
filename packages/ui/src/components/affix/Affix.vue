<template>
  <div ref="placeholderNode" :data-measure-status="state.status">
    <div v-if="enableFixed" :style="state.placeholderStyle" aria-hidden="true" />
    <div
      ref="fixedNode"
      :style="[state.affixStyle, { zIndex: props.zIndex }]"
      :class="enableFixed && 'ant-affix'"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getCurrentInstance,
  reactive,
  shallowRef,
  computed,
  watch,
  onMounted,
  onUpdated,
  onUnmounted,
} from 'vue'
import {
  AFFIX_STATUS_NONE,
  AFFIX_STATUS_PREPARE,
  AffixProps,
  AffixState,
  affixDefaultProps,
  AffixEmits,
} from './meta'
import {
  addObserveTarget,
  getFixedBottom,
  getFixedTop,
  getTargetRect,
  removeObserveTarget,
} from './utils'
import throttleByAnimationFrame from '@/utils/throttleByAnimationFrame'
import { useResizeObserver } from '@vueuse/core'

const props = withDefaults(defineProps<AffixProps>(), affixDefaultProps)
const emit = defineEmits<AffixEmits>()
const placeholderNode = shallowRef()

useResizeObserver(placeholderNode, () => {
  updatePosition()
})

const fixedNode = shallowRef()
const state = reactive<AffixState>({
  affixStyle: undefined,
  placeholderStyle: undefined,
  status: AFFIX_STATUS_NONE,
  lastAffix: false,
})
const prevTarget = shallowRef<Window | HTMLElement | null>(null)
const timeout = shallowRef<any>(null)
const currentInstance = getCurrentInstance()

const offsetTop = computed(() => {
  return props.offsetBottom === undefined && props.offsetTop === undefined ? 0 : props.offsetTop
})
const offsetBottom = computed(() => props.offsetBottom)
const measure = () => {
  const { status, lastAffix } = state
  const { target } = props
  if (status !== AFFIX_STATUS_PREPARE || !fixedNode.value || !placeholderNode.value || !target) {
    return
  }

  const targetNode = target()
  if (!targetNode) {
    return
  }

  const newState = {
    status: AFFIX_STATUS_NONE,
  } as AffixState
  const placeholderRect = getTargetRect(placeholderNode.value as HTMLElement)

  if (
    placeholderRect.top === 0 &&
    placeholderRect.left === 0 &&
    placeholderRect.width === 0 &&
    placeholderRect.height === 0
  ) {
    return
  }

  const targetRect = getTargetRect(targetNode)
  const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value)
  const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value)
  if (
    placeholderRect.top === 0 &&
    placeholderRect.left === 0 &&
    placeholderRect.width === 0 &&
    placeholderRect.height === 0
  ) {
    return
  }

  if (fixedTop !== undefined) {
    const width = `${placeholderRect.width}px`
    const height = `${placeholderRect.height}px`

    newState.affixStyle = {
      position: 'fixed',
      top: fixedTop,
      width,
      height,
    }
    newState.placeholderStyle = {
      width,
      height,
    }
  } else if (fixedBottom !== undefined) {
    const width = `${placeholderRect.width}px`
    const height = `${placeholderRect.height}px`

    newState.affixStyle = {
      position: 'fixed',
      bottom: fixedBottom,
      width,
      height,
    }
    newState.placeholderStyle = {
      width,
      height,
    }
  }

  newState.lastAffix = !!newState.affixStyle
  if (lastAffix !== newState.lastAffix) {
    emit('change', newState.lastAffix)
  }
  // update state
  Object.assign(state, newState)
}
const prepareMeasure = () => {
  Object.assign(state, {
    status: AFFIX_STATUS_PREPARE,
    affixStyle: undefined,
    placeholderStyle: undefined,
  })
}

const updatePosition = throttleByAnimationFrame(() => {
  prepareMeasure()
})
const lazyUpdatePosition = throttleByAnimationFrame(() => {
  const { target } = props
  const { affixStyle } = state

  // Check position change before measure to make Safari smooth
  if (target && affixStyle) {
    const targetNode = target()
    if (targetNode && placeholderNode.value) {
      const targetRect = getTargetRect(targetNode)
      const placeholderRect = getTargetRect(placeholderNode.value as HTMLElement)
      const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop.value)
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom.value)
      if (
        (fixedTop !== undefined && affixStyle.top === fixedTop) ||
        (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
      ) {
        return
      }
    }
  }
  // Directly call prepare measure since it's already throttled.
  prepareMeasure()
})

defineExpose({
  updatePosition,
  lazyUpdatePosition,
})
watch(
  () => props.target,
  val => {
    const newTarget = val?.() || null
    if (prevTarget.value !== newTarget) {
      removeObserveTarget(currentInstance)
      if (newTarget) {
        addObserveTarget(newTarget, currentInstance)
        // Mock Event object.
        updatePosition()
      }
      prevTarget.value = newTarget
    }
  },
)
watch(() => [props.offsetTop, props.offsetBottom], updatePosition)
onMounted(() => {
  const { target } = props
  if (target) {
    // [Legacy] Wait for parent component ref has its value.
    // We should use target as directly element instead of function which makes element check hard.
    timeout.value = setTimeout(() => {
      addObserveTarget(target(), currentInstance)
      // Mock Event object.
      updatePosition()
    })
  }
})
onUpdated(() => {
  measure()
})
onUnmounted(() => {
  clearTimeout(timeout.value)
  removeObserveTarget(currentInstance)
  ;(updatePosition as any).cancel()
  ;(lazyUpdatePosition as any).cancel()
})

const enableFixed = computed(() => {
  return !!state.affixStyle
})
</script>
