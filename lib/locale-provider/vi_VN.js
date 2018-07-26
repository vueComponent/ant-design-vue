'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vi_VN = require('../vc-pagination/locale/vi_VN');

var _vi_VN2 = _interopRequireDefault(_vi_VN);

var _vi_VN3 = require('../date-picker/locale/vi_VN');

var _vi_VN4 = _interopRequireDefault(_vi_VN3);

var _vi_VN5 = require('../time-picker/locale/vi_VN');

var _vi_VN6 = _interopRequireDefault(_vi_VN5);

var _vi_VN7 = require('../calendar/locale/vi_VN');

var _vi_VN8 = _interopRequireDefault(_vi_VN7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'vi',
  Pagination: _vi_VN2['default'],
  DatePicker: _vi_VN4['default'],
  TimePicker: _vi_VN6['default'],
  Calendar: _vi_VN8['default'],
  Table: {
    filterTitle: 'Bộ ',
    filterConfirm: 'OK',
    filterReset: 'Tạo Lại',
    emptyText: 'Trống',
    selectAll: 'Chọn Tất Cả',
    selectInvert: 'Chọn Ngược Lại'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Huỷ',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Huỷ'
  },
  Transfer: {
    notFoundContent: 'Không Tìm Thấy',
    searchPlaceholder: 'Tìm ở đây',
    itemUnit: 'mục',
    itemsUnit: 'mục'
  },
  Select: {
    notFoundContent: 'Không Tìm Thấy'
  },
  Upload: {
    uploading: 'Đang tải lên...',
    removeFile: 'Gỡ bỏ tập tin',
    uploadError: 'Lỗi tải lên',
    previewFile: 'Xem thử tập tin'
  }
};
module.exports = exports['default'];