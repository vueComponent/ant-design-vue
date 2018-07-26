'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zh_TW = require('../vc-pagination/locale/zh_TW');

var _zh_TW2 = _interopRequireDefault(_zh_TW);

var _zh_TW3 = require('../date-picker/locale/zh_TW');

var _zh_TW4 = _interopRequireDefault(_zh_TW3);

var _zh_TW5 = require('../time-picker/locale/zh_TW');

var _zh_TW6 = _interopRequireDefault(_zh_TW5);

var _zh_TW7 = require('../calendar/locale/zh_TW');

var _zh_TW8 = _interopRequireDefault(_zh_TW7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'zh-tw',
  Pagination: _zh_TW2['default'],
  DatePicker: _zh_TW4['default'],
  TimePicker: _zh_TW6['default'],
  Calendar: _zh_TW8['default'],
  Table: {
    filterTitle: '篩選器',
    filterConfirm: '確 定',
    filterReset: '重 置',
    emptyText: '目前尚無資料',
    selectAll: '全部選取',
    selectInvert: '反向選取'
  },
  Modal: {
    okText: '確 定',
    cancelText: '取 消',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: '確 定',
    cancelText: '取 消'
  },
  Transfer: {
    notFoundContent: '查無此資料',
    searchPlaceholder: '搜尋資料',
    itemUnit: '項目',
    itemsUnit: '項目'
  },
  Select: {
    notFoundContent: '查無此資料'
  },
  Upload: {
    uploading: '正在上傳...',
    removeFile: '刪除檔案',
    uploadError: '上傳失敗',
    previewFile: '檔案預覽'
  }
};
module.exports = exports['default'];