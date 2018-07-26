'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _de_DE = require('../vc-pagination/locale/de_DE');

var _de_DE2 = _interopRequireDefault(_de_DE);

var _de_DE3 = require('../date-picker/locale/de_DE');

var _de_DE4 = _interopRequireDefault(_de_DE3);

var _de_DE5 = require('../time-picker/locale/de_DE');

var _de_DE6 = _interopRequireDefault(_de_DE5);

var _de_DE7 = require('../calendar/locale/de_DE');

var _de_DE8 = _interopRequireDefault(_de_DE7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'de',
  Pagination: _de_DE2['default'],
  DatePicker: _de_DE4['default'],
  TimePicker: _de_DE6['default'],
  Calendar: _de_DE8['default'],
  Table: {
    filterTitle: 'Filter-Menü',
    filterConfirm: 'OK',
    filterReset: 'Zurücksetzen',
    emptyText: 'Keine Daten',
    selectAll: 'Selektiere Alle',
    selectInvert: 'Selektion Invertieren'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Abbrechen',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Abbrechen'
  },
  Transfer: {
    notFoundContent: 'Nicht gefunden',
    searchPlaceholder: 'Suchen',
    itemUnit: 'Eintrag',
    itemsUnit: 'Einträge'
  },
  Select: {
    notFoundContent: 'Nicht gefunden'
  },
  Upload: {
    uploading: 'Hochladen...',
    removeFile: 'Datei entfernen',
    uploadError: 'Fehler beim Hochladen',
    previewFile: 'Dateivorschau'
  }
};
module.exports = exports['default'];