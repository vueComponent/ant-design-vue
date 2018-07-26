'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sr_RS = require('../vc-pagination/locale/sr_RS');

var _sr_RS2 = _interopRequireDefault(_sr_RS);

var _sr_RS3 = require('../date-picker/locale/sr_RS');

var _sr_RS4 = _interopRequireDefault(_sr_RS3);

var _sr_RS5 = require('../time-picker/locale/sr_RS');

var _sr_RS6 = _interopRequireDefault(_sr_RS5);

var _sr_RS7 = require('../calendar/locale/sr_RS');

var _sr_RS8 = _interopRequireDefault(_sr_RS7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'sr',
  Pagination: _sr_RS2['default'],
  DatePicker: _sr_RS4['default'],
  TimePicker: _sr_RS6['default'],
  Calendar: _sr_RS8['default'],
  Table: {
    filterTitle: 'Filter',
    filterConfirm: 'Primeni filter',
    filterReset: 'Resetuj filter',
    emptyText: 'Nema podataka',
    selectAll: 'Obeleži sve na trenutnoj strani',
    selectInvert: 'Obrni selekciju na trenutnoj stranici'
  },
  Modal: {
    okText: 'U redu',
    cancelText: 'Otkaži',
    justOkText: 'U redu'
  },
  Popconfirm: {
    okText: 'U redu',
    cancelText: 'Otkaži'
  },
  Transfer: {
    notFoundContent: 'Nisu pronađeni rezultati pretrage',
    searchPlaceholder: 'Pretražite ovde',
    itemUnit: 'stavka',
    itemsUnit: 'stavki'
  },
  Select: {
    notFoundContent: 'Nije pronađeno'
  },
  Upload: {
    uploading: 'Slanje...',
    removeFile: 'Ukloni fajl',
    uploadError: 'Greška prilikom slanja',
    previewFile: 'Pogledaj fajl'
  }
};
module.exports = exports['default'];