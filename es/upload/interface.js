import _typeof from 'babel-runtime/helpers/typeof';
import PropsTypes from '../_util/vue-types';

export var UploadFileStatus = PropsTypes.oneOf(['error', 'success', 'done', 'uploading', 'removed']);

// export const HttpRequestHeader {
//   [key: string]: string;
// }

// export const UploadFile = PropsTypes.shape({
//   uid: PropsTypes.oneOfType([
//     PropsTypes.string,
//     PropsTypes.number,
//   ]),
//   size: PropsTypes.number,
//   name: PropsTypes.string,
//   filename: PropsTypes.string,
//   lastModified: PropsTypes.number,
//   lastModifiedDate: PropsTypes.any,
//   url: PropsTypes.string,
//   status: UploadFileStatus,
//   percent: PropsTypes.number,
//   thumbUrl: PropsTypes.string,
//   originFileObj: PropsTypes.any,
//   response: PropsTypes.any,
//   error: PropsTypes.any,
//   linkProps: PropsTypes.any,
//   type: PropsTypes.string,
// }).loose

function UploadFile(_ref) {
  var uid = _ref.uid,
      name = _ref.name;

  if (!uid && uid !== 0) return false;
  if (!['string', 'number'].includes(typeof uid === 'undefined' ? 'undefined' : _typeof(uid))) return false;
  if (name === '' || typeof name !== 'string') return false;
  return true;
}

export var UploadChangeParam = {
  file: PropsTypes.custom(UploadFile),
  fileList: PropsTypes.arrayOf(PropsTypes.custom(UploadFile)),
  event: PropsTypes.object
};

export var ShowUploadListInterface = PropsTypes.shape({
  showRemoveIcon: PropsTypes.bool,
  showPreviewIcon: PropsTypes.bool
}).loose;

export var UploadLocale = PropsTypes.shape({
  uploading: PropsTypes.string,
  removeFile: PropsTypes.string,
  uploadError: PropsTypes.string,
  previewFile: PropsTypes.string
}).loose;

export var UploadProps = {
  type: PropsTypes.oneOf(['drag', 'select']),
  name: PropsTypes.string,
  defaultFileList: PropsTypes.arrayOf(PropsTypes.custom(UploadFile)),
  fileList: PropsTypes.arrayOf(PropsTypes.custom(UploadFile)),
  action: PropsTypes.string,
  data: PropsTypes.oneOfType([PropsTypes.object, PropsTypes.func]),
  headers: PropsTypes.object,
  showUploadList: PropsTypes.oneOfType([PropsTypes.bool, ShowUploadListInterface]),
  multiple: PropsTypes.bool,
  accept: PropsTypes.string,
  beforeUpload: PropsTypes.func,
  // onChange: PropsTypes.func,
  listType: PropsTypes.oneOf(['text', 'picture', 'picture-card']),
  // className: PropsTypes.string,
  // onPreview: PropsTypes.func,
  // onRemove: PropsTypes.func,
  supportServerRender: PropsTypes.bool,
  // style: PropsTypes.object,
  disabled: PropsTypes.bool,
  prefixCls: PropsTypes.string,
  customRequest: PropsTypes.func,
  withCredentials: PropsTypes.bool,
  locale: UploadLocale,
  height: PropsTypes.number
};

export var UploadState = {
  fileList: PropsTypes.arrayOf(PropsTypes.custom(UploadFile)),
  dragState: PropsTypes.string
};

export var UploadListProps = {
  listType: PropsTypes.oneOf(['text', 'picture', 'picture-card']),
  // onPreview: PropsTypes.func,
  // onRemove: PropsTypes.func,
  // items: PropsTypes.arrayOf(UploadFile),
  items: PropsTypes.arrayOf(PropsTypes.custom(UploadFile)),
  // items: PropsTypes.any,
  progressAttr: PropsTypes.object,
  prefixCls: PropsTypes.string,
  showRemoveIcon: PropsTypes.bool,
  showPreviewIcon: PropsTypes.bool,
  locale: UploadLocale
};