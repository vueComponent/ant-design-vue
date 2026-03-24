<template>
  <a-space>
    <a-button @click="() => openNotificationWithIcon('success')">Success</a-button>
    <a-button @click="() => openNotificationWithIcon('info')">Info</a-button>
    <a-button @click="() => openNotificationWithIcon('warning')">Warning</a-button>
    <a-button @click="() => openNotificationWithIcon('error')">Error</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { notification } from '@ant-design-vue/ui'
import type { NotificationType } from '../types'

function openNotificationWithIcon(type: NotificationType) {
  notification[type]({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}
</script>
