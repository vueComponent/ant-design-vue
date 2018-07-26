'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sk_SK = require('../vc-pagination/locale/sk_SK');

var _sk_SK2 = _interopRequireDefault(_sk_SK);

var _sk_SK3 = require('../date-picker/locale/sk_SK');

var _sk_SK4 = _interopRequireDefault(_sk_SK3);

var _sk_SK5 = require('../time-picker/locale/sk_SK');

var _sk_SK6 = _interopRequireDefault(_sk_SK5);

var _sk_SK7 = require('../calendar/locale/sk_SK');

var _sk_SK8 = _interopRequireDefault(_sk_SK7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'sk',
  Pagination: _sk_SK2['default'],
  DatePicker: _sk_SK4['default'],
  TimePicker: _sk_SK6['default'],
  Calendar: _sk_SK8['default'],
  Table: {
    filterTitle: 'Filter',
    filterConfirm: 'OK',
    filterReset: 'Obnoviť',
    emptyText: 'Žiadne dáta',
    selectAll: 'Vybrať všetko',
    selectInvert: 'Vybrať opačné'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Zrušiť',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Zrušiť'
  },
  Transfer: {
    notFoundContent: 'Nenájdené',
    searchPlaceholder: 'Vyhľadávanie',
    itemUnit: 'položka',
    itemsUnit: 'položiek'
  },
  Select: {
    notFoundContent: 'Nenájdené'
  },
  Upload: {
    uploading: 'Nahrávanie...',
    removeFile: 'Odstrániť súbor',
    uploadError: 'Chyba pri nahrávaní',
    previewFile: 'Zobraziť súbor'
  }
};
module.exports = exports['default'];