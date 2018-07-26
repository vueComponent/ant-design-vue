'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _en_US = require('../vc-pagination/locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _en_US3 = require('../date-picker/locale/en_US');

var _en_US4 = _interopRequireDefault(_en_US3);

var _en_US5 = require('../time-picker/locale/en_US');

var _en_US6 = _interopRequireDefault(_en_US5);

var _en_US7 = require('../calendar/locale/en_US');

var _en_US8 = _interopRequireDefault(_en_US7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'en',
  Pagination: _en_US2['default'],
  DatePicker: _en_US4['default'],
  TimePicker: _en_US6['default'],
  Calendar: _en_US8['default'],
  Table: {
    filterTitle: 'Filter menu',
    filterConfirm: 'OK',
    filterReset: 'Reset',
    emptyText: 'No data',
    selectAll: 'Select current page',
    selectInvert: 'Invert current page'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancel',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancel'
  },
  Transfer: {
    titles: ['', ''],
    notFoundContent: 'Not Found',
    searchPlaceholder: 'Search here',
    itemUnit: 'item',
    itemsUnit: 'items'
  },
  Select: {
    notFoundContent: 'Not Found'
  },
  Upload: {
    uploading: 'Uploading...',
    removeFile: 'Remove file',
    uploadError: 'Upload error',
    previewFile: 'Preview file'
  }
};
module.exports = exports['default'];