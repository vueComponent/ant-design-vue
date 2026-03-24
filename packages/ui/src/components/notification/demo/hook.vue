<template>
  <div>
    <a-space>
      <a-button variant="solid" @click="() => open('topLeft')">topLeft</a-button>
      <a-button variant="solid" @click="() => open('topRight')">topRight</a-button>
    </a-space>
    <a-divider />
    <a-space>
      <a-button variant="solid" @click="() => open('bottomLeft')">bottomLeft</a-button>
      <a-button variant="solid" @click="() => open('bottomRight')">bottomRight</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { notification } from '@ant-design-vue/ui'
import type { NotificationPlacement } from '../types'

function open(placement: NotificationPlacement) {
  notification.info({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  })
}
</script>
