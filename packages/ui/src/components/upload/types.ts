import type { Slot, ScopedSlot } from '@/utils/types'

export type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed'
export type UploadListType = 'text' | 'picture' | 'picture-card'

export interface UploadFile<T = any> {
  uid: string
  name: string
  status?: UploadFileStatus
  url?: string
  thumbUrl?: string
  percent?: number
  size?: number
  type?: string
  response?: T
  error?: any
  originFileObj?: File
  [key: string]: any
}

export interface UploadChangeParam<T = UploadFile> {
  file: T
  fileList: T[]
  event?: { percent: number }
}

export interface ShowUploadListInterface {
  showRemoveIcon?: boolean
  showPreviewIcon?: boolean
  showDownloadIcon?: boolean
}

export interface UploadProps {
  /** Upload URL */
  action?: string | ((file: File) => Promise<string>)
  /** HTTP method */
  method?: 'POST' | 'PUT' | 'PATCH'
  /** HTTP headers */
  headers?: Record<string, string>
  /** Additional form data */
  data?: Record<string, any> | ((file: UploadFile) => Record<string, any>)
  /** Accepted file types (MIME types) */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Controlled file list (v-model:fileList) */
  fileList?: UploadFile[]
  /** Default file list (uncontrolled) */
  defaultFileList?: UploadFile[]
  /** List display type */
  listType?: UploadListType
  /** Show upload list (or config) */
  showUploadList?: boolean | ShowUploadListInterface
  /** Disable upload */
  disabled?: boolean
  /** Form field name */
  name?: string
  /** Include credentials */
  withCredentials?: boolean
  /** Max file count */
  maxCount?: number
  /** Directory upload */
  directory?: boolean
  /** Custom upload implementation */
  customRequest?: (options: UploadRequestOption) => void
  /** Pre-upload hook */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<File | Blob | boolean | void>
  /** Enable drag-and-drop upload */
  drag?: boolean
  /** Open file dialog on click */
  openFileDialogOnClick?: boolean
}

export const uploadDefaultProps = {
  method: 'POST' as const,
  multiple: false,
  listType: 'text' as const,
  showUploadList: true,
  disabled: false,
  name: 'file',
  withCredentials: false,
  openFileDialogOnClick: true,
  directory: false,
  drag: false,
}

export interface UploadEmits {
  (e: 'update:fileList', fileList: UploadFile[]): void
  (e: 'change', info: UploadChangeParam): void
  (e: 'drop', event: DragEvent): void
  (e: 'preview', file: UploadFile): void
  (e: 'download', file: UploadFile): void
  (e: 'remove', file: UploadFile): boolean | void
  (e: 'reject', fileList: File[]): void
}

export interface UploadSlots {
  default?: Slot
  itemRender?: ScopedSlot<{
    file: UploadFile
    actions: { remove: () => void; download: () => void; preview: () => void }
  }>
  removeIcon?: ScopedSlot<{ file: UploadFile }>
  downloadIcon?: ScopedSlot<{ file: UploadFile }>
  previewIcon?: ScopedSlot<{ file: UploadFile }>
  iconRender?: ScopedSlot<{ file: UploadFile; listType: UploadListType }>
}

// Internal upload request types
export interface UploadRequestOption {
  action: string
  filename: string
  file: File
  data?: Record<string, any>
  headers?: Record<string, string>
  withCredentials?: boolean
  method: string
  onProgress: (event: { percent: number }) => void
  onSuccess: (response: any, xhr?: XMLHttpRequest) => void
  onError: (error: Error) => void
}
