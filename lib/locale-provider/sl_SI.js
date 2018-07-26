'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sl_SI = require('../vc-pagination/locale/sl_SI');

var _sl_SI2 = _interopRequireDefault(_sl_SI);

var _sl_SI3 = require('../date-picker/locale/sl_SI');

var _sl_SI4 = _interopRequireDefault(_sl_SI3);

var _sl_SI5 = require('../time-picker/locale/sl_SI');

var _sl_SI6 = _interopRequireDefault(_sl_SI5);

var _sl_SI7 = require('../calendar/locale/sl_SI');

var _sl_SI8 = _interopRequireDefault(_sl_SI7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'sl',
  Pagination: _sl_SI2['default'],
  DatePicker: _sl_SI4['default'],
  TimePicker: _sl_SI6['default'],
  Calendar: _sl_SI8['default'],
  Table: {
    filterTitle: 'Filter',
    filterConfirm: 'Filtriraj',
    filterReset: 'Pobriši filter',
    emptyText: 'Ni podatkov',
    selectAll: 'Izberi vse na trenutni strani',
    selectInvert: 'Obrni izbor na trenutni strani'
  },
  Modal: {
    okText: 'V redu',
    cancelText: 'Prekliči',
    justOkText: 'V redu'
  },
  Popconfirm: {
    okText: 'v redu',
    cancelText: 'Prekliči'
  },
  Transfer: {
    notFoundContent: 'Ni rezultatov iskanja',
    searchPlaceholder: 'Išči tukaj',
    itemUnit: 'Objekt',
    itemsUnit: 'Objektov'
  },
  Select: {
    notFoundContent: 'Ni bilo mogoče najti'
  },
  Upload: {
    uploading: 'Nalaganje...',
    removeFile: 'Odstrani datoteko',
    uploadError: 'Napaka pri nalaganju',
    previewFile: 'Predogled datoteke'
  }
};
module.exports = exports['default'];