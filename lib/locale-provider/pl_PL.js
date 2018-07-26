'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pl_PL = require('../vc-pagination/locale/pl_PL');

var _pl_PL2 = _interopRequireDefault(_pl_PL);

var _pl_PL3 = require('../date-picker/locale/pl_PL');

var _pl_PL4 = _interopRequireDefault(_pl_PL3);

var _pl_PL5 = require('../time-picker/locale/pl_PL');

var _pl_PL6 = _interopRequireDefault(_pl_PL5);

var _pl_PL7 = require('../calendar/locale/pl_PL');

var _pl_PL8 = _interopRequireDefault(_pl_PL7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'pl',
  Pagination: _pl_PL2['default'],
  DatePicker: _pl_PL4['default'],
  TimePicker: _pl_PL6['default'],
  Calendar: _pl_PL8['default'],
  Table: {
    filterTitle: 'Menu filtra',
    filterConfirm: 'OK',
    filterReset: 'Wyczyść',
    emptyText: 'Brak danych',
    selectAll: 'Zaznacz bieżącą stronę',
    selectInvert: 'Odwróć zaznaczenie'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Anuluj',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Anuluj'
  },
  Transfer: {
    notFoundContent: 'Nie znaleziono',
    searchPlaceholder: 'Szukaj',
    itemUnit: 'obiekt',
    itemsUnit: 'obiekty'
  },
  Select: {
    notFoundContent: 'Nie znaleziono'
  },
  Upload: {
    uploading: 'Wysyłanie...',
    removeFile: 'Usuń plik',
    uploadError: 'Błąd wysyłania',
    previewFile: 'Podejrzyj plik'
  }
};
module.exports = exports['default'];