'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ku_IQ = require('../vc-pagination/locale/ku_IQ');

var _ku_IQ2 = _interopRequireDefault(_ku_IQ);

var _ku_IQ3 = require('../date-picker/locale/ku_IQ');

var _ku_IQ4 = _interopRequireDefault(_ku_IQ3);

var _ku_IQ5 = require('../time-picker/locale/ku_IQ');

var _ku_IQ6 = _interopRequireDefault(_ku_IQ5);

var _ku_IQ7 = require('../calendar/locale/ku_IQ');

var _ku_IQ8 = _interopRequireDefault(_ku_IQ7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ku-iq',
  Pagination: _ku_IQ2['default'],
  DatePicker: _ku_IQ4['default'],
  TimePicker: _ku_IQ6['default'],
  Calendar: _ku_IQ8['default'],
  Table: {
    filterTitle: 'Menuê peldanka',
    filterConfirm: 'Temam',
    filterReset: 'Jê bibe',
    emptyText: 'Agahî tune',
    selectAll: 'Hemî hilbijêre',
    selectInvert: 'Hilbijartinan veguhere'
  },
  Modal: {
    okText: 'Temam',
    cancelText: 'Betal ke',
    justOkText: 'Temam'
  },
  Popconfirm: {
    okText: 'Temam',
    cancelText: 'Betal ke'
  },
  Transfer: {
    notFoundContent: 'Peyda Nebû',
    searchPlaceholder: 'Lêgerîn',
    itemUnit: 'tişt',
    itemsUnit: 'tişt'
  },
  Select: {
    notFoundContent: 'Peyda Nebû'
  },
  Upload: {
    uploading: 'Bardike...',
    removeFile: 'Pelê rabike',
    uploadError: 'Xeta barkirine',
    previewFile: 'Pelê pêşbibîne'
  }
};
module.exports = exports['default'];