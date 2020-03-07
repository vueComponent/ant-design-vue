// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export interface VcFile extends File {
  uid: string;
  readonly lastModifiedDate: Date;
  readonly webkitRelativePath: string;
}

export interface UploadFile<T = any> {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: T;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: T;
  preview?: string;
}

export interface ShowUploadList {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
}

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card';
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

type PreviewFileHandler = (file: File | Blob) => PromiseLike<string>;
type TransformFileHandler = (
  file: VcFile,
) => string | Blob | File | PromiseLike<string | Blob | File>;

export declare class Upload extends AntdComponent {
  static Dragger: typeof Upload;

  /**
   * File types that can be accepted.
   * @type string
   */
  accept: string;

  /**
   * Uploading URL
   * @type string | Function
   */
  action: string | Function;

  /**
   * support upload whole directory
   * @type boolean
   * @see https://caniuse.com/#feat=input-file-directory
   */
  directory: boolean;

  /**
   * Hook function which will be executed before uploading.
   * Uploading will be stopped with false or a rejected Promise returned.
   * Warning：this function is not supported in IE9.
   * @type Function
   */
  beforeUpload: (file: any, fileList: any) => boolean | Promise<boolean>;

  /**
   * override for the default xhr behavior allowing for additional customization and ability to implement your own XMLHttpRequest
   * @type Function
   */
  customRequest: Function;

  /**
   * Uploading params or function which can return uploading params.
   * @type object | Function
   */
  data: object | Function;

  method?: 'POST' | 'PUT' | 'post' | 'put';

  /**
   * Default list of files that have been uploaded.
   * @type UploadFile[]
   */
  defaultFileList: UploadFile[];

  /**
   * disable upload button
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * List of files that have been uploaded (controlled)
   * @type UploadFile[]
   */
  fileList: UploadFile[];

  /**
   * Set request headers, valid above IE10.
   * @type object
   */
  headers: object;

  /**
   * Built-in stylesheets, support for three types: text, picture or picture-card
   * @default 'text'
   * @type string
   */
  listType: 'text' | 'picture' | 'picture-card';

  /**
   * Whether to support selected multiple file. IE10+ supported.
   *  You can select multiple files with CTRL holding down while multiple is set to be true
   * @default false
   * @type boolean
   */
  multiple: boolean;

  /**
   * The name of uploading file
   * @default 'file'
   * @type string
   */
  name: string;

  /**
   * Whether to show default upload list, could be an object to specify showPreviewIcon and showRemoveIcon individually
   * @default true
   * @type boolean | ShowUploadList
   */
  showUploadList: boolean | ShowUploadList;

  /**
   * Need to be turned on while the server side is rendering.
   * @default false
   * @type boolean
   */
  supportServerRender: boolean;

  /**
   * ajax upload with cookie sent
   * @default false
   * @type boolean
   */
  withCredentials: boolean;

  /**
   * click open file dialog
   * @default true
   * @type boolean
   */
  openFileDialogOnClick: boolean;

  /**
   * A callback function, will be executed when removing file button is clicked,
   * remove event will be prevented when return value is false or a Promise which resolve(false) or reject.
   * @type Function
   */
  remove: (file: any) => boolean | Promise<boolean>;

  locale?: UploadLocale;
  id?: string;
  previewFile?: PreviewFileHandler;
  transformFile?: TransformFileHandler;
}
