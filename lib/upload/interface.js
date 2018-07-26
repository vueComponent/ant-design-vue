'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadListProps = exports.UploadState = exports.UploadProps = exports.UploadLocale = exports.ShowUploadListInterface = exports.UploadChangeParam = exports.UploadFileStatus = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var UploadFileStatus = exports.UploadFileStatus = _vueTypes2['default'].oneOf(['error', 'success', 'done', 'uploading', 'removed']);

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
  if (!['string', 'number'].includes(typeof uid === 'undefined' ? 'undefined' : (0, _typeof3['default'])(uid))) return false;
  if (name === '' || typeof name !== 'string') return false;
  return true;
}

var UploadChangeParam = exports.UploadChangeParam = {
  file: _vueTypes2['default'].custom(UploadFile),
  fileList: _vueTypes2['default'].arrayOf(_vueTypes2['default'].custom(UploadFile)),
  event: _vueTypes2['default'].object
};

var ShowUploadListInterface = exports.ShowUploadListInterface = _vueTypes2['default'].shape({
  showRemoveIcon: _vueTypes2['default'].bool,
  showPreviewIcon: _vueTypes2['default'].bool
}).loose;

var UploadLocale = exports.UploadLocale = _vueTypes2['default'].shape({
  uploading: _vueTypes2['default'].string,
  removeFile: _vueTypes2['default'].string,
  uploadError: _vueTypes2['default'].string,
  previewFile: _vueTypes2['default'].string
}).loose;

var UploadProps = exports.UploadProps = {
  type: _vueTypes2['default'].oneOf(['drag', 'select']),
  name: _vueTypes2['default'].string,
  defaultFileList: _vueTypes2['default'].arrayOf(_vueTypes2['default'].custom(UploadFile)),
  fileList: _vueTypes2['default'].arrayOf(_vueTypes2['default'].custom(UploadFile)),
  action: _vueTypes2['default'].string,
  data: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
  headers: _vueTypes2['default'].object,
  showUploadList: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, ShowUploadListInterface]),
  multiple: _vueTypes2['default'].bool,
  accept: _vueTypes2['default'].string,
  beforeUpload: _vueTypes2['default'].func,
  // onChange: PropsTypes.func,
  listType: _vueTypes2['default'].oneOf(['text', 'picture', 'picture-card']),
  // className: PropsTypes.string,
  // onPreview: PropsTypes.func,
  // onRemove: PropsTypes.func,
  supportServerRender: _vueTypes2['default'].bool,
  // style: PropsTypes.object,
  disabled: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  customRequest: _vueTypes2['default'].func,
  withCredentials: _vueTypes2['default'].bool,
  locale: UploadLocale,
  height: _vueTypes2['default'].number
};

var UploadState = exports.UploadState = {
  fileList: _vueTypes2['default'].arrayOf(_vueTypes2['default'].custom(UploadFile)),
  dragState: _vueTypes2['default'].string
};

var UploadListProps = exports.UploadListProps = {
  listType: _vueTypes2['default'].oneOf(['text', 'picture', 'picture-card']),
  // onPreview: PropsTypes.func,
  // onRemove: PropsTypes.func,
  // items: PropsTypes.arrayOf(UploadFile),
  items: _vueTypes2['default'].arrayOf(_vueTypes2['default'].custom(UploadFile)),
  // items: PropsTypes.any,
  progressAttr: _vueTypes2['default'].object,
  prefixCls: _vueTypes2['default'].string,
  showRemoveIcon: _vueTypes2['default'].bool,
  showPreviewIcon: _vueTypes2['default'].bool,
  locale: UploadLocale
};