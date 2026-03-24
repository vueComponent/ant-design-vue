<template>
  <a-button @click="showConfirm">Confirm</a-button>
</template>

<script setup lang="ts">
import { Modal } from '@ant-design-vue/ui'

const showConfirm = () => {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      Modal.confirm({
        content: 'destroy all',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        cancelText: 'Click to destroy all',
        onCancel() {
          Modal.destroyAll()
        },
      })
    }, i * 500)
  }
}
</script>
