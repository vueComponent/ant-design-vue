<template>
  <component
    :is="tag"
    ref="elRef"
    :class="rootClass"
    :style="cssVars"
    :disabled="!href ? (isDisabled || undefined) : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="isLoading || undefined"
    :role="href && isDisabled ? 'link' : undefined"
    :href="href && !isDisabled ? href : undefined"
    :target="href && !isDisabled ? target : undefined"
    :type="!href ? htmlType : undefined"
    :tabindex="href && isDisabled ? -1 : undefined"
    :title="title"
    @click="handleClick"
  >
    <Wave :target="elRef" :disabled="isWaveDisabled" />

    <template v-if="hasIcon">
      <span v-if="isLoading" class="ant-btn-icon ant-btn-loading-icon">
        <LoadingOutlined />
      </span>
      <template v-else>
        <component v-if="iconNode" :is="iconNode" />
        <slot v-else name="icon" />
      </template>
    </template>
    <template v-else>
      <Transition
        @before-enter="onCollapseWidth"
        @enter="onExpandWidth"
        @after-enter="onResetStyle"
        @before-leave="onExpandWidth"
        @leave="onCollapseWidth"
        @after-leave="onResetStyle"
      >
        <span v-if="isLoading" class="ant-btn-icon ant-btn-loading-icon">
          <LoadingOutlined />
        </span>
      </Transition>
    </template>

    <span v-if="$slots.default" class="ant-btn-content"><slot /></span>
  </component>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  shallowRef,
  watch,
  watchEffect,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  inject,
  nextTick,
  useSlots,
  Transition,
} from 'vue'
import type { ButtonProps, ButtonEmits, ButtonSlots } from './types'
import { buttonDefaultProps, resolveVariant, resolveSize, BUTTON_GROUP_KEY } from './types'
import { getCssVarColor } from '@/utils/colorAlgorithm'
import { useConfigInject } from '@/hooks'
import { DEFAULT_PRIMARY_COLOR } from '../theme/types'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'
import { Wave } from '../wave'

defineOptions({ name: 'AButton' })
const props = withDefaults(defineProps<ButtonProps>(), buttonDefaultProps)
const emit = defineEmits<ButtonEmits>()
defineSlots<ButtonSlots>()

const {
  size: globalSize,
  disabled: globalDisabled,
  direction,
  autoInsertSpaceInButton,
  theme,
} = useConfigInject()
const buttonGroup = inject(BUTTON_GROUP_KEY, null)

const elRef = shallowRef<HTMLElement | null>(null)
const slots = useSlots()

// --- Loading with delay support ---
const isLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

function updateLoading() {
  clearTimeout(loadingTimer)
  if (typeof props.loading === 'object' && props.loading.delay && props.loading.delay > 0) {
    loadingTimer = setTimeout(() => {
      isLoading.value = true
    }, props.loading.delay)
  } else {
    isLoading.value = !!props.loading
  }
}

watch(() => props.loading, updateLoading, { immediate: true })
onBeforeUnmount(() => clearTimeout(loadingTimer))

// --- Two Chinese Characters ---
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
const hasTwoCNChar = ref(false)
const autoInsertSpace = computed(() => autoInsertSpaceInButton.value !== false)

function fixTwoCNChar() {
  const node = elRef.value
  if (!node || autoInsertSpaceInButton.value === false) return
  const buttonText = (node.textContent || '').trim()
  if (isTwoCNChar(buttonText)) {
    if (!hasTwoCNChar.value) hasTwoCNChar.value = true
  } else if (hasTwoCNChar.value) {
    hasTwoCNChar.value = false
  }
}

onMounted(fixTwoCNChar)
onUpdated(fixTwoCNChar)

// --- Resolved props ---
const variant = computed(() => resolveVariant(props))
const size = computed(() => resolveSize(props.size ?? buttonGroup?.size.value ?? globalSize.value))
const isDisabled = computed(() => props.disabled || globalDisabled.value)

if (process.env.NODE_ENV !== 'production') {
  watchEffect(() => {
    const v = variant.value
    if (props.ghost && (v === 'text' || v === 'link')) {
      console.warn(
        `[antdv] Button: \`${v}\` variant cannot be used with \`ghost\` prop.`,
      )
    }
  })
}

const tag = computed(() => (props.href ? 'a' : 'button'))
const isWaveDisabled = computed(() => {
  const v = variant.value
  return v === 'text' || v === 'link' || isLoading.value || isDisabled.value
})

// --- Color ---
const color = computed(() => {
  if (props.color) return props.color
  if (props.danger) return 'red'
  return theme.primaryColor
})

const cssVars = computed(() => {
  if (color.value.toLowerCase() === DEFAULT_PRIMARY_COLOR.toLowerCase()) return {}
  return getCssVarColor(color.value, {
    appearance: theme.appearance as 'light' | 'dark',
    backgroundColor: theme.backgroundColor,
  })
})

// --- Icon ---
const hasIcon = computed(() => !!props.icon || !!slots.icon)
const iconNode = computed(() => props.icon ?? null)
const isIconOnly = computed(() => !slots.default && (hasIcon.value || isLoading.value))

// --- Classes ---
const rootClass = computed(() => ({
  'ant-btn': true,
  [`ant-btn-${variant.value}`]: true,
  [`ant-btn-${size.value}`]: true,
  [`ant-btn-shape-${props.shape}`]: props.shape !== 'default',
  'ant-btn-danger': props.danger,
  'ant-btn-ghost': props.ghost,
  'ant-btn-loading': isLoading.value,
  'ant-btn-disabled': isDisabled.value,
  'ant-btn-block': props.block,
  'ant-btn-custom-color': !!props.color || props.danger,
  'ant-btn-icon-only': isIconOnly.value,
  'ant-btn-two-chinese-chars': hasTwoCNChar.value && autoInsertSpace.value,
  'ant-btn-rtl': direction.value === 'rtl',
}))

// --- Loading icon transition hooks ---
function onCollapseWidth(el: Element) {
  const node = el as HTMLElement
  node.style.width = '0px'
  node.style.opacity = '0'
  node.style.transform = 'scale(0)'
}

function onExpandWidth(el: Element) {
  const node = el as HTMLElement
  nextTick(() => {
    node.style.width = `${node.scrollWidth}px`
    node.style.opacity = '1'
    node.style.transform = 'scale(1)'
  })
}

function onResetStyle(el: Element) {
  const node = el as HTMLElement
  node.style.width = ''
  node.style.opacity = ''
  node.style.transform = ''
}

// --- Events ---
function handleClick(event: MouseEvent) {
  if (isLoading.value || isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

// --- Expose ---
defineExpose({
  focus: (options?: FocusOptions) => elRef.value?.focus(options),
  blur: () => elRef.value?.blur(),
})
</script>
