<template>
  <div v-if="show && !disabled" ref="divRef" style="position: absolute; left: 0; top: 0">
    <Transition
      appear
      name="ant-wave-motion"
      appearFromClass="ant-wave-motion-appear"
      appearActiveClass="ant-wave-motion-appear"
      appearToClass="ant-wave-motion-appear ant-wave-motion-appear-active"
    >
      <div
        v-if="show"
        :style="waveStyle"
        class="ant-wave-motion"
        @transitionend="onTransitionend"
      />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import wrapperRaf from '@/utils/raf'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  Transition,
  watch,
} from 'vue'
import { getTargetWaveColor } from './util'
import isVisible from '@/utils/isVisible'

const props = defineProps<{
  disabled?: boolean
  target: HTMLElement
}>()

const divRef = shallowRef<HTMLDivElement | null>(null)

const show = defineModel<boolean>('show')

const color = ref<string | null>(null)
const borderRadius = ref<number[]>([])
const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value
}
function syncPos() {
  const { target } = props
  if (!target) {
    return
  }
  const nodeStyle = getComputedStyle(target)

  // Get wave color from target
  color.value = getTargetWaveColor(target)

  const isStatic = nodeStyle.position === 'static'

  // Rect
  const { borderLeftWidth, borderTopWidth } = nodeStyle
  left.value = isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth))
  top.value = isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth))
  width.value = target.offsetWidth
  height.value = target.offsetHeight

  // Get border radius
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = nodeStyle

  borderRadius.value = [
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
  ].map(radius => validateNum(parseFloat(radius)))
}
// Add resize observer to follow size
let resizeObserver: ResizeObserver
let rafId: number
let timeoutId: any
let onClick: (e: MouseEvent) => void
const clear = () => {
  clearTimeout(timeoutId)
  wrapperRaf.cancel(rafId)
  resizeObserver?.disconnect()
  const { target } = props
  target?.removeEventListener('click', onClick, true)
}

const init = () => {
  clear()
  const { target } = props
  if (target) {
    target?.removeEventListener('click', onClick, true)
    if (!target || target.nodeType !== 1) {
      return
    }
    // Click handler
    onClick = (e: MouseEvent) => {
      // Fix radio button click twice
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        !isVisible(e.target as HTMLElement) ||
        // No need wave
        !target.getAttribute ||
        target.getAttribute('disabled') ||
        (target as HTMLInputElement).disabled ||
        target.className.includes('disabled') ||
        target.className.includes('-leave')
      ) {
        return
      }
      show.value = false
      nextTick(() => {
        show.value = true
      })
    }

    // Bind events
    target.addEventListener('click', onClick, true)
    // We need delay to check position here
    // since UI may change after click
    rafId = wrapperRaf(() => {
      syncPos()
    })

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncPos)
      resizeObserver.observe(target)
    }
  }
}
onMounted(() => {
  nextTick(() => {
    init()
  })
})

watch(
  () => props.target,
  () => {
    init()
  },
  {
    flush: 'post',
  },
)

onBeforeUnmount(() => {
  clear()
})

const onTransitionend = (e: TransitionEvent) => {
  if (e.propertyName === 'opacity') {
    show.value = false
  }
}

// Auto hide wave after 5 seconds, transition end not work
watch(show, () => {
  clearTimeout(timeoutId)
  if (show.value) {
    timeoutId = setTimeout(() => {
      show.value = false
    }, 5000)
  }
})

const waveStyle = computed(() => {
  const style = {
    left: `${left.value}px`,
    top: `${top.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`,
    borderRadius: borderRadius.value.map(radius => `${radius}px`).join(' '),
  }
  if (color.value) {
    style['--wave-color'] = color.value
  }
  return style
})
</script>
