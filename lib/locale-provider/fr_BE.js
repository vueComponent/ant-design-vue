'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fr_BE = require('../vc-pagination/locale/fr_BE');

var _fr_BE2 = _interopRequireDefault(_fr_BE);

var _fr_BE3 = require('../date-picker/locale/fr_BE');

var _fr_BE4 = _interopRequireDefault(_fr_BE3);

var _fr_BE5 = require('../time-picker/locale/fr_BE');

var _fr_BE6 = _interopRequireDefault(_fr_BE5);

var _fr_BE7 = require('../calendar/locale/fr_BE');

var _fr_BE8 = _interopRequireDefault(_fr_BE7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'fr',
  Pagination: _fr_BE2['default'],
  DatePicker: _fr_BE4['default'],
  TimePicker: _fr_BE6['default'],
  Calendar: _fr_BE8['default'],
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