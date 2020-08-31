// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from './component';

export interface HttpRequestHeader {
  [key: string]: string;
}

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

export interface UploadChangeParam<T extends object = UploadFile> {
  file: T;
  fileList: UploadFile[];
  event?: { percent: number };
}

export interface VcCustomRequestOptions {
  onProgress: (event: { percent: number }, file: File) => void;
  onError: (error: Error) => void;
  onSuccess: (response: object, file: File) => void;
  data: object;
  filename: string;
  file: File;
  withCredentials: boolean;
  action: string;
  headers: object;
}

export interface ShowUploadListInterface {
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
  $props: AntdProps & {
    /**
     * File types that can be accepted.
     * @type string
     */
    accept?: string;

    /**
     * Uploading URL
     * @type string | Function
     */
    action?: string | ((file: VcFile) => string) | ((file: VcFile) => PromiseLike<string>);

    /**
     * support upload whole directory
     * @type boolean
     * @see https://caniuse.com/#feat=input-file-directory
     */
    directory?: boolean;

    /**
     * Hook function which will be executed before uploading.
     * Uploading will be stopped with false or a rejected Promise returned.
     * Warning：this function is not supported in IE9.
     * @type Function
     */
    beforeUpload?: (file: VcFile, fileList: VcFile[]) => boolean | Promise<boolean>;

    /**
     * A callback function, can be executed when uploading state is changing.
     */
    onChange?: (info: UploadChangeParam) => void;

    /**
     * A callback function, will be executed when file link or preview icon is clicked.
     */
    onPreview?: (file: UploadFile) => void;

    /**
     * Click the method to download the file, pass the method to perform the method logic, do not pass the default jump to the new TAB.
     */
    onDownload?: (file: UploadFile) => void;

    /**
     * A callback function, will be executed when removing file button is clicked,
     * remove event will be prevented when return value is false or a Promise which resolve(false) or reject.
     * @type Function
     */
    onRemove?: (file: UploadFile) => boolean | Promise<boolean>;

    /**
     * override for the default xhr behavior allowing for additional customization and ability to implement your own XMLHttpRequest
     * @type Function
     */
    customRequest?: (options: VcCustomRequestOptions) => void;

    /**
     * Uploading params or function which can return uploading params.
     * @type object | Function
     */
    data?: object | ((file: UploadFile) => object);
    /**
     * http method of upload request
     */
    method?: 'POST' | 'PUT' | 'post' | 'put';

    /**
     * Default list of files that have been uploaded.
     * @type UploadFile[]
     */
    defaultFileList?: UploadFile[];

    /**
     * disable upload button
     * @default false
     * @type boolean
     */
    disabled?: boolean;

    /**
     * List of files that have been uploaded (controlled)
     * @type UploadFile[]
     */
    fileList?: UploadFile[];

    /**
     * Set request headers, valid above IE10.
     * @type object
     */
    headers?: HttpRequestHeader;

    /**
     * Built-in stylesheets, support for three types: text, picture or picture-card
     * @default 'text'
     * @type string
     */
    listType?: 'text' | 'picture' | 'picture-card';

    /**
     * Whether to support selected multiple file. IE10+ supported.
     *  You can select multiple files with CTRL holding down while multiple is set to be true
     * @default false
     * @type boolean
     */
    multiple?: boolean;

    /**
     * The name of uploading file
     * @default 'file'
     * @type string
     */
    name?: string;

    /**
     * Whether to show default upload list, could be an object to specify showPreviewIcon and showRemoveIcon individually
     * @default true
     * @type boolean | ShowUploadListInterface
     */
    showUploadList?: boolean | ShowUploadListInterface;

    /**
     * Need to be turned on while the server side is rendering.
     * @default false
     * @type boolean
     */
    supportServerRender?: boolean;

    /**
     * ajax upload with cookie sent
     * @default false
     * @type boolean
     */
    withCredentials?: boolean;

    /**
     * click open file dialog
     * @default true
     * @type boolean
     */
    openFileDialogOnClick?: boolean;

    locale?: UploadLocale;
    id?: string;
    /**
     * Customize preview file logic (1.5.0)
     */
    previewFile?: PreviewFileHandler;
    /**
     * Customize transform file before request (1.5.0)
     */
    transformFile?: TransformFileHandler;
  };
}
