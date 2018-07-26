'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _en_GB = require('../vc-pagination/locale/en_GB');

var _en_GB2 = _interopRequireDefault(_en_GB);

var _en_GB3 = require('../date-picker/locale/en_GB');

var _en_GB4 = _interopRequireDefault(_en_GB3);

var _en_GB5 = require('../time-picker/locale/en_GB');

var _en_GB6 = _interopRequireDefault(_en_GB5);

var _en_GB7 = require('../calendar/locale/en_GB');

var _en_GB8 = _interopRequireDefault(_en_GB7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'en-gb',
  Pagination: _en_GB2['default'],
  DatePicker: _en_GB4['default'],
  TimePicker: _en_GB6['default'],
  Calendar: _en_GB8['default'],
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