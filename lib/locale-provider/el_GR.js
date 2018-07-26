'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _el_GR = require('../vc-pagination/locale/el_GR');

var _el_GR2 = _interopRequireDefault(_el_GR);

var _el_GR3 = require('../date-picker/locale/el_GR');

var _el_GR4 = _interopRequireDefault(_el_GR3);

var _el_GR5 = require('../time-picker/locale/el_GR');

var _el_GR6 = _interopRequireDefault(_el_GR5);

var _el_GR7 = require('../calendar/locale/el_GR');

var _el_GR8 = _interopRequireDefault(_el_GR7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'el',
  Pagination: _el_GR2['default'],
  DatePicker: _el_GR4['default'],
  TimePicker: _el_GR6['default'],
  Calendar: _el_GR8['default'],
  Table: {
    filterTitle: 'Μενού φίλτρων',
    filterConfirm: 'ΟΚ',
    filterReset: 'Επαναφορά',
    emptyText: 'Δεν υπάρχουν δεδομένα',
    selectAll: 'Επιλογή τρέχουσας σελίδας',
    selectInvert: 'Αντιστροφή τρέχουσας σελίδας'
  },
  Modal: {
    okText: 'ΟΚ',
    cancelText: 'Άκυρο',
    justOkText: 'ΟΚ'
  },
  Popconfirm: {
    okText: 'ΟΚ',
    cancelText: 'Άκυρο'
  },
  Transfer: {
    notFoundContent: 'Δεν βρέθηκε',
    searchPlaceholder: 'Αναζήτηση',
    itemUnit: 'αντικείμενο',
    itemsUnit: 'αντικείμενα'
  },
  Select: {
    notFoundContent: 'Δεν βρέθηκε'
  },
  Upload: {
    uploading: 'Μεταφόρτωση...',
    removeFile: 'Αφαίρεση αρχείου',
    uploadError: 'Σφάλμα μεταφόρτωσης',
    previewFile: 'Προεπισκόπηση αρχείου'
  }
};
module.exports = exports['default'];