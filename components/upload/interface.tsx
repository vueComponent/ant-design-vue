import type {
  RcFile as OriRcFile,
  UploadRequestOption as RcCustomRequestOptions,
} from '../vc-upload/interface';
import type { ProgressProps } from '../progress';
import type { VueNode } from '../_util/type';
import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';

export interface FileType extends OriRcFile {
  readonly lastModifiedDate: Date;
}

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: FileType;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface InternalUploadFile<T = any> extends UploadFile<T> {
  originFileObj: FileType;
}

export interface ShowUploadListInterface {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
}

export interface UploadChangeParam<T = UploadFile> {
  // https://github.com/ant-design/ant-design/issues/14420
  file: T;
  fileList: UploadFile[];
  event?: { percent: number };
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
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'> & {
  class?: string;
  style?: CSSProperties;
};

export type ItemRender<T = any> = (opt: {
  originNode: VueNode;
  file: UploadFile;
  fileList: Array<UploadFile<T>>;
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  };
}) => VueNode;

type PreviewFileHandler = (file: FileType | Blob) => PromiseLike<string>;
type TransformFileHandler = (
  file: FileType,
) => string | Blob | FileType | PromiseLike<string | Blob | FileType>;
type BeforeUploadValueType = void | boolean | string | Blob | FileType;

function uploadProps<T = any>() {
  return {
    capture: [Boolean, String] as PropType<boolean | 'user' | 'environment'>,
    type: String as PropType<UploadType>,
    name: String,
    defaultFileList: Array as PropType<Array<UploadFile<T>>>,
    fileList: Array as PropType<Array<UploadFile<T>>>,
    action: [String, Function] as PropType<
      string | ((file: FileType) => string) | ((file: FileType) => PromiseLike<string>)
    >,
    directory: { type: Boolean, default: undefined },
    data: [Object, Function] as PropType<
      | Record<string, unknown>
      | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>)
    >,
    method: String as PropType<'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch'>,
    headers: Object as PropType<HttpRequestHeader>,
    showUploadList: {
      type: [Boolean, Object] as PropType<boolean | ShowUploadListInterface>,
      default: undefined as boolean | ShowUploadListInterface,
    },
    multiple: { type: Boolean, default: undefined },
    accept: String,
    beforeUpload: Function as PropType<
      (
        file: FileType,
        FileList: FileType[],
      ) => BeforeUploadValueType | Promise<BeforeUploadValueType>
    >,
    onChange: Function as PropType<(info: UploadChangeParam<UploadFile<T>>) => void>,
    'onUpdate:fileList': Function as PropType<
      (fileList: UploadChangeParam<UploadFile<T>>['fileList']) => void
    >,
    onDrop: Function as PropType<(event: DragEvent) => void>,
    listType: String as PropType<UploadListType>,
    onPreview: Function as PropType<(file: UploadFile<T>) => void>,
    onDownload: Function as PropType<(file: UploadFile<T>) => void>,
    onReject: Function as PropType<(fileList: FileType[]) => void>,
    onRemove: Function as PropType<
      (file: UploadFile<T>) => void | boolean | Promise<void | boolean>
    >,
    /** @deprecated Please use `onRemove` directly */
    remove: Function as PropType<(file: UploadFile<T>) => void | boolean | Promise<void | boolean>>,
    supportServerRender: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    prefixCls: String,
    customRequest: Function as PropType<(options: RcCustomRequestOptions) => void>,
    withCredentials: { type: Boolean, default: undefined },
    openFileDialogOnClick: { type: Boolean, default: undefined },
    locale: { type: Object as PropType<UploadLocale>, default: undefined as UploadLocale },
    id: String,
    previewFile: Function as PropType<PreviewFileHandler>,
    /** @deprecated Please use `beforeUpload` directly */
    transformFile: Function as PropType<TransformFileHandler>,
    iconRender: Function as PropType<
      (opt: { file: UploadFile<T>; listType?: UploadListType }) => VueNode
    >,
    isImageUrl: Function as PropType<(file: UploadFile) => boolean>,
    progress: Object as PropType<UploadListProgressProps>,
    itemRender: Function as PropType<ItemRender<T>>,
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount: Number,
    height: [Number, String],
    removeIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    downloadIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    previewIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
  };
}

export type UploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>>;

export interface UploadState<T = any> {
  fileList: UploadFile<T>[];
  dragState: string;
}

function uploadListProps<T = any>() {
  return {
    listType: String as PropType<UploadListType>,
    onPreview: Function as PropType<(file: UploadFile<T>) => void>,
    onDownload: Function as PropType<(file: UploadFile<T>) => void>,
    onRemove: Function as PropType<(file: UploadFile<T>) => void | boolean>,
    items: Array as PropType<Array<UploadFile<T>>>,
    progress: Object as PropType<UploadListProgressProps>,
    prefixCls: String as PropType<string>,
    showRemoveIcon: { type: Boolean, default: undefined },
    showDownloadIcon: { type: Boolean, default: undefined },
    showPreviewIcon: { type: Boolean, default: undefined },
    removeIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    downloadIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    previewIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    locale: { type: Object as PropType<UploadLocale>, default: undefined as UploadLocale },
    previewFile: Function as PropType<PreviewFileHandler>,
    iconRender: Function as PropType<
      (opt: { file: UploadFile<T>; listType?: UploadListType }) => VueNode
    >,
    isImageUrl: Function as PropType<(file: UploadFile) => boolean>,
    appendAction: Function as PropType<() => VueNode>,
    appendActionVisible: { type: Boolean, default: undefined },
    itemRender: Function as PropType<ItemRender<T>>,
  };
}

export type UploadListProps = Partial<ExtractPropTypes<ReturnType<typeof uploadListProps>>>;
export { uploadProps, uploadListProps };
