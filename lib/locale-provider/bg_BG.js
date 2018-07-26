'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bg_BG = require('../vc-pagination/locale/bg_BG');

var _bg_BG2 = _interopRequireDefault(_bg_BG);

var _bg_BG3 = require('../date-picker/locale/bg_BG');

var _bg_BG4 = _interopRequireDefault(_bg_BG3);

var _bg_BG5 = require('../time-picker/locale/bg_BG');

var _bg_BG6 = _interopRequireDefault(_bg_BG5);

var _bg_BG7 = require('../calendar/locale/bg_BG');

var _bg_BG8 = _interopRequireDefault(_bg_BG7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'bg',
  Pagination: _bg_BG2['default'],
  DatePicker: _bg_BG4['default'],
  TimePicker: _bg_BG6['default'],
  Calendar: _bg_BG8['default'],
  Table: {
    filterTitle: 'Филтриране',
    filterConfirm: 'Добре',
    filterReset: 'Нулриане',
    emptyText: 'Няма данни',
    selectAll: 'Избор на текуща страница',
    selectInvert: 'Обръщане'
  },
  Modal: {
    okText: 'Добре',
    cancelText: 'Отказ',
    justOkText: 'Добре'
  },
  Popconfirm: {
    okText: 'Добре',
    cancelText: 'Отказ'
  },
  Transfer: {
    notFoundContent: 'Няма намерени',
    searchPlaceholder: 'Търсене',
    itemUnit: 'избор',
    itemsUnit: 'избори'
  },
  Select: {
    notFoundContent: 'Няма намерени'
  },
  Upload: {
    uploading: 'Качване...',
    removeFile: 'Премахване',
    uploadError: 'Грешка при качването',
    previewFile: 'Преглед'
  }
};
module.exports = exports['default'];