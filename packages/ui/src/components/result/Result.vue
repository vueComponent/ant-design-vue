<script setup lang="ts">
import { computed, isVNode, useSlots, type Component } from 'vue'
import type { ResultProps, ResultSlots } from './types'
import { resultDefaultProps } from './types'
import SuccessIcon from './icons/SuccessIcon.vue'
import ErrorIcon from './icons/ErrorIcon.vue'
import InfoIcon from './icons/InfoIcon.vue'
import WarningIcon from './icons/WarningIcon.vue'
import UnauthorizedIcon from './icons/UnauthorizedIcon.vue'
import NotFoundIcon from './icons/NotFoundIcon.vue'
import ServerErrorIcon from './icons/ServerErrorIcon.vue'

defineOptions({ name: 'AResult' })
const props = withDefaults(defineProps<ResultProps>(), resultDefaultProps)
defineSlots<ResultSlots>()
const slots = useSlots()

const exceptionStatuses = new Set(['403', '404', '500'])

const iconComponents: Record<string, Component> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
  403: UnauthorizedIcon,
  404: NotFoundIcon,
  500: ServerErrorIcon,
}

const defaultIconComponent = computed(() => {
  return iconComponents[String(props.status)] || InfoIcon
})

const hasCustomIcon = computed(() => !!props.icon)
const isExceptionStatus = computed(() => exceptionStatuses.has(String(props.status)))

const statusClass = computed(() => {
  return `ant-result-${props.status}`
})

const classes = computed(() => ({
  'ant-result': true,
  [statusClass.value]: true,
}))

const hasTitle = computed(() => {
  return props.title !== undefined || !!slots.title
})

const hasSubTitle = computed(() => {
  return props.subTitle !== undefined || !!slots.subTitle
})

const hasExtra = computed(() => {
  return !!props.extra || !!slots.extra
})

const iconClasses = computed(() => ({
  'ant-result-icon': true,
  'ant-result-image': isExceptionStatus.value,
}))
</script>

<template>
  <div :class="classes" role="status">
    <div :class="iconClasses" aria-hidden="true">
      <template v-if="hasCustomIcon">
        <component :is="props.icon" v-if="typeof props.icon === 'function'" />
        <component :is="props.icon" v-else-if="isVNode(props.icon)" />
      </template>
      <slot v-else name="icon">
        <component :is="defaultIconComponent" />
      </slot>
    </div>
    <div v-if="hasTitle" class="ant-result-title">
      <template v-if="props.title !== undefined">
        <component :is="props.title" v-if="typeof props.title === 'function'" />
        <component :is="props.title" v-else-if="isVNode(props.title)" />
        <template v-else>{{ props.title }}</template>
      </template>
      <slot v-else name="title" />
    </div>
    <div v-if="hasSubTitle" class="ant-result-subtitle">
      <template v-if="props.subTitle !== undefined">
        <component :is="props.subTitle" v-if="typeof props.subTitle === 'function'" />
        <component :is="props.subTitle" v-else-if="isVNode(props.subTitle)" />
        <template v-else>{{ props.subTitle }}</template>
      </template>
      <slot v-else name="subTitle" />
    </div>
    <div v-if="hasExtra" class="ant-result-extra">
      <template v-if="props.extra">
        <component :is="props.extra" v-if="typeof props.extra === 'function'" />
        <component :is="props.extra" v-else-if="isVNode(props.extra)" />
        <template v-else>{{ props.extra }}</template>
      </template>
      <slot v-else name="extra" />
    </div>
    <div v-if="$slots.default" class="ant-result-content">
      <slot />
    </div>
  </div>
</template>
