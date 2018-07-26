'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fi_FI = require('../vc-pagination/locale/fi_FI');

var _fi_FI2 = _interopRequireDefault(_fi_FI);

var _fi_FI3 = require('../date-picker/locale/fi_FI');

var _fi_FI4 = _interopRequireDefault(_fi_FI3);

var _fi_FI5 = require('../time-picker/locale/fi_FI');

var _fi_FI6 = _interopRequireDefault(_fi_FI5);

var _fi_FI7 = require('../calendar/locale/fi_FI');

var _fi_FI8 = _interopRequireDefault(_fi_FI7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'fi',
  Pagination: _fi_FI2['default'],
  DatePicker: _fi_FI4['default'],
  TimePicker: _fi_FI6['default'],
  Calendar: _fi_FI8['default'],
  Table: {
    filterTitle: 'Suodatus valikko',
    filterConfirm: 'OK',
    filterReset: 'Tyhjennä',
    emptyText: 'Ei kohteita',
    selectAll: 'Valitse kaikki',
    selectInvert: 'Valitse päinvastoin'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Peruuta',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Peruuta'
  },
  Transfer: {
    notFoundContent: 'Ei löytynyt',
    searchPlaceholder: 'Etsi täältä',
    itemUnit: 'kohde',
    itemsUnit: 'kohdetta'
  },
  Select: {
    notFoundContent: 'Ei löytynyt'
  },
  Upload: {
    uploading: 'Lähetetään...',
    removeFile: 'Poista tiedosto',
    uploadError: 'Virhe lähetyksessä',
    previewFile: 'Esikatsele tiedostoa'
  }
};
module.exports = exports['default'];