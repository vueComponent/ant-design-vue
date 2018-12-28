import { AntdVueComponent } from './component';

/** AUpload Layout Component */
export declare class AUpload extends AntdVueComponent {
  accept: string

  action: string

  directory: boolean

  beforeUpload: (file: File, fileList: FileList) => boolean | Promise<any>

  customRequest: Function

  data: (file: File) => any | object

  defaultFileList: object[]

  disabled: boolean

  fileList: FileList

  headers: object

  listType: string

  multiple: boolean

  name: string

  showUploadList: { showPreviewIcon?: boolean, showRemoveIcon?: boolean } | boolean

  supportServerRender: boolean

  withCredentials: boolean

  openFileDialogOnClick: boolean

  change(): void

  preview(file: File): void

  remove(file: File): boolean | Promise<any>
}
