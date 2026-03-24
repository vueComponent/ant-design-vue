<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap">
    <a-button @click="showConfirm">Confirm</a-button>
    <a-button @click="showPromiseConfirm">With promise</a-button>
    <a-button variant="dashed" @click="showDeleteConfirm">Delete</a-button>
    <a-button variant="dashed" @click="showPropsConfirm">With extra props</a-button>
    <contextHolder />
  </div>
</template>

<script setup lang="ts">
import { Modal } from '@ant-design-vue/ui'

const [modal, contextHolder] = Modal.useModal()

const showConfirm = () => {
  modal.confirm({
    title: 'Do you Want to delete these items?',
    content: 'Some descriptions',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

const showDeleteConfirm = () => {
  modal.confirm({
    title: 'Are you sure delete this task?',
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'solid',
    cancelText: 'No',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

const showPropsConfirm = () => {
  modal.confirm({
    title: 'Are you sure delete this task?',
    content: 'Some descriptions',
    okText: 'Yes',
    okButtonProps: { disabled: true },
    cancelText: 'No',
    onOk() {
      console.log('OK')
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}

const showPromiseConfirm = () => {
  modal.confirm({
    title: 'Do you want to delete these items?',
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    async onOk() {
      try {
        return await new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        })
      } catch {
        return console.log('Oops errors!')
      }
    },
    onCancel() {},
  })
}
</script>
