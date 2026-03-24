<script setup lang="ts">
import UploadOutlined from '@ant-design/icons-vue/UploadOutlined'
import type { UploadProps, UploadEmits, UploadSlots } from './types'
import { uploadDefaultProps } from './types'
import Upload from './Upload.vue'

defineOptions({ name: 'AUploadDragger' })
const props = withDefaults(defineProps<UploadProps>(), {
  drag: true,
  method: 'POST',
  multiple: false,
  listType: 'text',
  disabled: false,
  name: 'file',
  withCredentials: false,
  openFileDialogOnClick: true,
  directory: false,
})
const emit = defineEmits<UploadEmits>()
defineSlots<UploadSlots>()
</script>

<template>
  <Upload
    v-bind="({ ...props, drag: true } as any)"
    @update:file-list="(v) => emit('update:fileList', v)"
    @change="(v) => emit('change', v)"
    @drop="(v) => emit('drop', v)"
    @preview="(v) => emit('preview', v)"
    @download="(v) => emit('download', v)"
    @remove="(v) => emit('remove', v)"
    @reject="(v) => emit('reject', v)"
  >
    <slot>
      <p class="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">Support for a single or bulk upload.</p>
    </slot>
  </Upload>
</template>
