import type { ExtractPropTypes, PropType } from 'vue';
import { tuple } from '../_util/type';
import PropsTypes from '../_util/vue-types';

export const UploadFileStatus = PropsTypes.oneOf(
  tuple('error', 'success', 'done', 'uploading', 'removed'),
);

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface VcFile extends File {
  uid: string;
  readonly lastModifiedDate: Date;
  readonly webkitRelativePath: string;
}

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
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
  originFileObj?: any;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface UploadChangeParam<T extends object = UploadFile> {
  file: T;
  fileList: UploadFile[];
  event?: { percent: number };
}

export const ShowUploadListInterface = PropsTypes.shape({
  showRemoveIcon: PropsTypes.looseBool,
  showPreviewIcon: PropsTypes.looseBool,
}).loose;

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export const uploadProps = {
  type: PropsTypes.oneOf(tuple('drag', 'select')),
  name: PropsTypes.string,
  defaultFileList: { type: Array as PropType<UploadFile[]> },
  fileList: { type: Array as PropType<UploadFile[]> },
  action: PropsTypes.oneOfType([PropsTypes.string, PropsTypes.func]),
  directory: PropsTypes.looseBool,
  data: PropsTypes.oneOfType([PropsTypes.object, PropsTypes.func]),
  method: PropsTypes.oneOf(tuple('POST', 'PUT', 'PATCH', 'post', 'put', 'patch')),
  headers: PropsTypes.object,
  showUploadList: PropsTypes.oneOfType([PropsTypes.looseBool, ShowUploadListInterface]),
  multiple: PropsTypes.looseBool,
  accept: PropsTypes.string,
  beforeUpload: PropsTypes.func,
  listType: PropsTypes.oneOf(tuple('text', 'picture', 'picture-card')),
  // className: PropsTypes.string,
  remove: PropsTypes.func,
  supportServerRender: PropsTypes.looseBool,
  // style: PropsTypes.object,
  disabled: PropsTypes.looseBool,
  prefixCls: PropsTypes.string,
  customRequest: PropsTypes.func,
  withCredentials: PropsTypes.looseBool,
  openFileDialogOnClick: PropsTypes.looseBool,
  locale: { type: Object as PropType<UploadLocale> },
  height: PropsTypes.number,
  id: PropsTypes.string,
  previewFile: PropsTypes.func,
  transformFile: PropsTypes.func,
  onChange: { type: Function as PropType<(info: UploadChangeParam) => void> },
  onPreview: { type: Function as PropType<(file: UploadFile) => void> },
  onRemove: {
    type: Function as PropType<(file: UploadFile) => void | boolean | Promise<void | boolean>>,
  },
  onDownload: { type: Function as PropType<(file: UploadFile) => void> },
  'onUpdate:fileList': { type: Function as PropType<(files: UploadFile[]) => void> },
};

export type UploadProps = Partial<ExtractPropTypes<typeof uploadProps>>;
export const uploadListProps = {
  listType: PropsTypes.oneOf(tuple('text', 'picture', 'picture-card')),
  // items: PropsTypes.arrayOf(UploadFile),
  items: { type: Array as PropType<UploadFile[]> },
  progressAttr: PropsTypes.object,
  prefixCls: PropsTypes.string,
  showRemoveIcon: PropsTypes.looseBool,
  showDownloadIcon: PropsTypes.looseBool,
  showPreviewIcon: PropsTypes.looseBool,
  locale: { type: Object as PropType<UploadLocale> },
  previewFile: PropsTypes.func,
  onPreview: { type: Function as PropType<(file: UploadFile) => void> },
  onRemove: {
    type: Function as PropType<(file: UploadFile) => void | boolean>,
  },
  onDownload: { type: Function as PropType<(file: UploadFile) => void> },
};

export type UploadListProps = Partial<ExtractPropTypes<typeof uploadListProps>>;
