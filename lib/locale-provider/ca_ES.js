'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ca_ES = require('../vc-pagination/locale/ca_ES');

var _ca_ES2 = _interopRequireDefault(_ca_ES);

var _ca_ES3 = require('../date-picker/locale/ca_ES');

var _ca_ES4 = _interopRequireDefault(_ca_ES3);

var _ca_ES5 = require('../time-picker/locale/ca_ES');

var _ca_ES6 = _interopRequireDefault(_ca_ES5);

var _ca_ES7 = require('../calendar/locale/ca_ES');

var _ca_ES8 = _interopRequireDefault(_ca_ES7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ca',
  Pagination: _ca_ES2['default'],
  DatePicker: _ca_ES4['default'],
  TimePicker: _ca_ES6['default'],
  Calendar: _ca_ES8['default'],
  Table: {
    filterTitle: 'Filtrar Menu',
    filterConfirm: 'OK',
    filterReset: 'Restablir',
    emptyText: 'Sense dades'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancel·lar',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancel·lar'
  },
  Transfer: {
    notFoundContent: 'No trobat',
    searchPlaceholder: 'Cercar aquí',
    itemUnit: 'item',
    itemsUnit: 'items'
  },
  Select: {
    notFoundContent: 'No trobat'
  }
};
module.exports = exports['default'];