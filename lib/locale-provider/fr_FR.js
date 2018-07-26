'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fr_FR = require('../vc-pagination/locale/fr_FR');

var _fr_FR2 = _interopRequireDefault(_fr_FR);

var _fr_FR3 = require('../date-picker/locale/fr_FR');

var _fr_FR4 = _interopRequireDefault(_fr_FR3);

var _fr_FR5 = require('../time-picker/locale/fr_FR');

var _fr_FR6 = _interopRequireDefault(_fr_FR5);

var _fr_FR7 = require('../calendar/locale/fr_FR');

var _fr_FR8 = _interopRequireDefault(_fr_FR7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'fr',
  Pagination: _fr_FR2['default'],
  DatePicker: _fr_FR4['default'],
  TimePicker: _fr_FR6['default'],
  Calendar: _fr_FR8['default'],
  Table: {
    filterTitle: 'Filtrer',
    filterConfirm: 'OK',
    filterReset: 'Réinitialiser',
    emptyText: 'Aucune donnée'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Annuler',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Annuler'
  },
  Transfer: {
    notFoundContent: 'Pas de résultat',
    searchPlaceholder: 'Recherche',
    itemUnit: 'élément',
    itemsUnit: 'éléments'
  },
  Select: {
    notFoundContent: 'Pas de résultat'
  }
};
module.exports = exports['default'];