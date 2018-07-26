'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _et_EE = require('../vc-pagination/locale/et_EE');

var _et_EE2 = _interopRequireDefault(_et_EE);

var _et_EE3 = require('../date-picker/locale/et_EE');

var _et_EE4 = _interopRequireDefault(_et_EE3);

var _et_EE5 = require('../time-picker/locale/et_EE');

var _et_EE6 = _interopRequireDefault(_et_EE5);

var _et_EE7 = require('../calendar/locale/et_EE');

var _et_EE8 = _interopRequireDefault(_et_EE7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'et',
  Pagination: _et_EE2['default'],
  DatePicker: _et_EE4['default'],
  TimePicker: _et_EE6['default'],
  Calendar: _et_EE8['default'],
  Table: {
    filterTitle: 'Filtri menüü',
    filterConfirm: 'OK',
    filterReset: 'Nulli',
    emptyText: 'Andmed puuduvad',
    selectAll: 'Vali kõik',
    selectInvert: 'Inverteeri valik'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Tühista',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Tühista'
  },
  Transfer: {
    notFoundContent: 'Ei leitud',
    searchPlaceholder: 'Otsi siit',
    itemUnit: 'kogus',
    itemsUnit: 'kogus'
  },
  Select: {
    notFoundContent: 'Ei leitud'
  },
  Upload: {
    uploading: 'Üleslaadimine...',
    removeFile: 'Eemalda fail',
    uploadError: 'Üleslaadimise tõrge',
    previewFile: 'Faili eelvaade'
  }
};
module.exports = exports['default'];