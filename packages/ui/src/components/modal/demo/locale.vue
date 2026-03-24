<template>
  <div>
    <a-button variant="solid" @click="open = true">Modal</a-button>
    <a-button style="margin-left: 8px" @click="confirm">Confirm</a-button>
    <a-modal
      v-model:open="open"
      title="Modal"
      ok-text="Confirm"
      cancel-text="Dismiss"
      @ok="open = false"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from '@ant-design-vue/ui'

const open = ref(false)

const confirm = () => {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    okText: 'Confirm',
    cancelText: 'Dismiss',
  })
}
</script>
