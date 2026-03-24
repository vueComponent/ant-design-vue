<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import UploadOutlined from '@ant-design/icons-vue/UploadOutlined'
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined'
import type { UploadProps, UploadEmits, UploadSlots, UploadFile, UploadRequestOption } from './types'
import { uploadDefaultProps } from './types'
import { defaultRequest } from './request'
import UploadList from './UploadList.vue'

defineOptions({ name: 'AUpload' })
const props = withDefaults(defineProps<UploadProps>(), {
  method: 'POST',
  multiple: false,
  listType: 'text',
  showUploadList: undefined,
  disabled: false,
  name: 'file',
  withCredentials: false,
  openFileDialogOnClick: true,
  directory: false,
  drag: false,
})
const emit = defineEmits<UploadEmits>()
defineSlots<UploadSlots>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const abortControllers = new Map<string, { abort: () => void }>()

// Internal file list for uncontrolled mode
const internalFileList = ref<UploadFile[]>(props.defaultFileList ? [...props.defaultFileList] : [])

watch(
  () => props.fileList,
  (list) => {
    if (list !== undefined) {
      internalFileList.value = [...list]
    }
  },
)

const mergedFileList = computed(() => {
  return props.fileList !== undefined ? props.fileList : internalFileList.value
})

const showList = computed(() => {
  return props.showUploadList !== false
})

const isPictureCard = computed(() => props.listType === 'picture-card')

const classes = computed(() => ({
  'ant-upload-wrapper': true,
  [`ant-upload-wrapper-${props.listType}`]: true,
}))

const triggerClasses = computed(() => ({
  'ant-upload': true,
  'ant-upload-drag': props.drag,
  'ant-upload-drag-hover': props.drag && dragOver.value,
  'ant-upload-disabled': props.disabled,
  [`ant-upload-${props.listType}`]: true,
}))

const isMaxCountReached = computed(() => {
  if (props.maxCount === undefined) return false
  return mergedFileList.value.length >= props.maxCount
})

function generateUid(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function updateFileList(newList: UploadFile[], file?: UploadFile, event?: { percent: number }) {
  internalFileList.value = newList
  emit('update:fileList', newList)
  if (file) {
    emit('change', { file, fileList: newList, event })
  }
}

function handleClick() {
  if (props.disabled || !props.openFileDialogOnClick) return
  inputRef.value?.click()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  // Reset input so same file can be selected again
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (props.disabled) return
  dragOver.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  if (props.disabled) return

  emit('drop', e)

  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    processFiles(files)
  }
}

async function processFiles(files: File[]) {
  if (files.length === 0) return

  let filesToProcess = files

  // Enforce maxCount
  if (props.maxCount !== undefined) {
    const remaining = props.maxCount - mergedFileList.value.length
    if (remaining <= 0) {
      emit('reject', files)
      return
    }
    if (files.length > remaining) {
      filesToProcess = files.slice(0, remaining)
      emit('reject', files.slice(remaining))
    }
  }

  // Filter by accept if needed
  if (props.accept) {
    const accepted: File[] = []
    const rejected: File[] = []
    const acceptTypes = props.accept.split(',').map((t) => t.trim())

    filesToProcess.forEach((file) => {
      const isAccepted = acceptTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })

      if (isAccepted) {
        accepted.push(file)
      } else {
        rejected.push(file)
      }
    })

    if (rejected.length > 0) {
      emit('reject', rejected)
    }
    filesToProcess = accepted
  }

  for (const file of filesToProcess) {
    await uploadFile(file, filesToProcess)
  }
}

async function uploadFile(file: File, fileList: File[]) {
  // Run beforeUpload hook
  if (props.beforeUpload) {
    try {
      const result = await props.beforeUpload(file, fileList)
      if (result === false) return
      // If result is a File, use that instead
      if (result instanceof File) {
        await startUpload(result)
        return
      }
    } catch {
      return
    }
  }

  await startUpload(file)
}

async function startUpload(file: File) {
  const uid = generateUid()
  const uploadFile: UploadFile = {
    uid,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'uploading',
    percent: 0,
    originFileObj: file,
  }

  // Generate thumbnail for images in picture/picture-card mode
  if ((props.listType === 'picture' || props.listType === 'picture-card') && file.type?.startsWith('image/')) {
    try {
      uploadFile.thumbUrl = await getBase64(file)
    } catch {
      // Ignore thumbnail generation failure
    }
  }

  const newList = [...mergedFileList.value, uploadFile]
  updateFileList(newList, uploadFile)

  // Resolve action URL
  let actionUrl = ''
  if (typeof props.action === 'function') {
    try {
      actionUrl = await props.action(file)
    } catch {
      handleUploadError(uid, new Error('Failed to resolve upload URL'))
      return
    }
  } else if (typeof props.action === 'string') {
    actionUrl = props.action
  }

  if (!actionUrl && !props.customRequest) {
    // No action URL and no custom request - mark as done immediately
    handleUploadSuccess(uid, null)
    return
  }

  // Resolve additional data
  let data: Record<string, any> | undefined
  if (typeof props.data === 'function') {
    data = props.data(uploadFile)
  } else {
    data = props.data
  }

  const requestOptions: UploadRequestOption = {
    action: actionUrl,
    filename: props.name,
    file,
    data,
    headers: props.headers,
    withCredentials: props.withCredentials,
    method: props.method,
    onProgress: (event) => handleUploadProgress(uid, event),
    onSuccess: (response, xhr) => handleUploadSuccess(uid, response, xhr),
    onError: (error) => handleUploadError(uid, error),
  }

  if (props.customRequest) {
    props.customRequest(requestOptions)
  } else {
    const controller = defaultRequest(requestOptions)
    abortControllers.set(uid, controller)
  }
}

function handleUploadProgress(uid: string, event: { percent: number }) {
  const list = [...mergedFileList.value]
  const index = list.findIndex((f) => f.uid === uid)
  if (index === -1) return

  const file = { ...list[index], percent: event.percent, status: 'uploading' as const }
  list[index] = file
  updateFileList(list, file, event)
}

function handleUploadSuccess(uid: string, response: any, xhr?: XMLHttpRequest) {
  abortControllers.delete(uid)
  const list = [...mergedFileList.value]
  const index = list.findIndex((f) => f.uid === uid)
  if (index === -1) return

  const file = { ...list[index], status: 'done' as const, percent: 100, response }
  list[index] = file
  updateFileList(list, file)
}

function handleUploadError(uid: string, error: Error) {
  abortControllers.delete(uid)
  const list = [...mergedFileList.value]
  const index = list.findIndex((f) => f.uid === uid)
  if (index === -1) return

  const file = { ...list[index], status: 'error' as const, error }
  list[index] = file
  updateFileList(list, file)
}

function handleRemove(file: UploadFile) {
  const result = emit('remove', file)
  // If remove returns false, do not remove
  if (result === false) return

  // Abort if still uploading
  const controller = abortControllers.get(file.uid)
  if (controller) {
    controller.abort()
    abortControllers.delete(file.uid)
  }

  const newList = mergedFileList.value.filter((f) => f.uid !== file.uid)
  const removedFile = { ...file, status: 'removed' as const }
  updateFileList(newList, removedFile)
}

function handlePreview(file: UploadFile) {
  emit('preview', file)
}

function handleDownload(file: UploadFile) {
  emit('download', file)
}

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

onBeforeUnmount(() => {
  abortControllers.forEach((controller) => controller.abort())
  abortControllers.clear()
})
</script>

<template>
  <div :class="classes">
    <!-- Picture card: list before trigger -->
    <template v-if="isPictureCard">
      <UploadList
        v-if="showList"
        :items="mergedFileList"
        :list-type="listType"
        :show-upload-list="showUploadList"
        :disabled="disabled"
        @remove="handleRemove"
        @preview="handlePreview"
        @download="handleDownload"
      >
        <template v-if="$slots.itemRender" #itemRender="{ file, actions }">
          <slot name="itemRender" :file="file" :actions="actions" />
        </template>
        <template v-if="$slots.removeIcon" #removeIcon="{ file }">
          <slot name="removeIcon" :file="file" />
        </template>
        <template v-if="$slots.downloadIcon" #downloadIcon="{ file }">
          <slot name="downloadIcon" :file="file" />
        </template>
        <template v-if="$slots.previewIcon" #previewIcon="{ file }">
          <slot name="previewIcon" :file="file" />
        </template>
        <template v-if="$slots.iconRender" #iconRender="{ file, listType: lt }">
          <slot name="iconRender" :file="file" :list-type="lt" />
        </template>
      </UploadList>

      <div
        v-if="!isMaxCountReached"
        :class="triggerClasses"
        role="button"
        :tabindex="disabled ? -1 : 0"
        @click="handleClick"
        @keydown="handleKeydown"
        @dragover="drag ? handleDragOver($event) : undefined"
        @dragleave="drag ? handleDragLeave($event) : undefined"
        @drop="drag ? handleDrop($event) : undefined"
      >
        <input
          ref="inputRef"
          type="file"
          class="ant-upload-input"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :webkitdirectory="directory || undefined"
          @change="handleFileSelect"
        />
        <slot>
          <div class="ant-upload-card-trigger">
            <PlusOutlined />
            <div class="ant-upload-card-trigger-text">Upload</div>
          </div>
        </slot>
      </div>
    </template>

    <!-- Text / Picture: trigger before list -->
    <template v-else>
      <div
        v-if="!isMaxCountReached"
        :class="triggerClasses"
        role="button"
        :tabindex="disabled ? -1 : 0"
        @click="handleClick"
        @keydown="handleKeydown"
        @dragover="drag ? handleDragOver($event) : undefined"
        @dragleave="drag ? handleDragLeave($event) : undefined"
        @drop="drag ? handleDrop($event) : undefined"
      >
        <input
          ref="inputRef"
          type="file"
          class="ant-upload-input"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :webkitdirectory="directory || undefined"
          @change="handleFileSelect"
        />
        <slot>
          <button v-if="!drag" type="button" class="ant-btn" :disabled="disabled">
            <UploadOutlined />
            <span>Click to Upload</span>
          </button>
          <template v-else>
            <p class="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
            <p class="ant-upload-hint">Support for a single or bulk upload.</p>
          </template>
        </slot>
      </div>

      <UploadList
        v-if="showList"
        :items="mergedFileList"
        :list-type="listType"
        :show-upload-list="showUploadList"
        :disabled="disabled"
        @remove="handleRemove"
        @preview="handlePreview"
        @download="handleDownload"
      >
        <template v-if="$slots.itemRender" #itemRender="{ file, actions }">
          <slot name="itemRender" :file="file" :actions="actions" />
        </template>
        <template v-if="$slots.removeIcon" #removeIcon="{ file }">
          <slot name="removeIcon" :file="file" />
        </template>
        <template v-if="$slots.downloadIcon" #downloadIcon="{ file }">
          <slot name="downloadIcon" :file="file" />
        </template>
        <template v-if="$slots.previewIcon" #previewIcon="{ file }">
          <slot name="previewIcon" :file="file" />
        </template>
        <template v-if="$slots.iconRender" #iconRender="{ file, listType: lt }">
          <slot name="iconRender" :file="file" :list-type="lt" />
        </template>
      </UploadList>
    </template>
  </div>
</template>
