'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tr_TR = require('../vc-pagination/locale/tr_TR');

var _tr_TR2 = _interopRequireDefault(_tr_TR);

var _tr_TR3 = require('../date-picker/locale/tr_TR');

var _tr_TR4 = _interopRequireDefault(_tr_TR3);

var _tr_TR5 = require('../time-picker/locale/tr_TR');

var _tr_TR6 = _interopRequireDefault(_tr_TR5);

var _tr_TR7 = require('../calendar/locale/tr_TR');

var _tr_TR8 = _interopRequireDefault(_tr_TR7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'tr',
  Pagination: _tr_TR2['default'],
  DatePicker: _tr_TR4['default'],
  TimePicker: _tr_TR6['default'],
  Calendar: _tr_TR8['default'],
  Table: {
    filterTitle: 'Menü Filtrele',
    filterConfirm: 'Tamam',
    filterReset: 'Sıfırla',
    emptyText: 'Veri Yok',
    selectAll: 'Hepsini Seç',
    selectInvert: 'Tersini Seç'
  },
  Modal: {
    okText: 'Tamam',
    cancelText: 'İptal',
    justOkText: 'Tamam'
  },
  Popconfirm: {
    okText: 'Tamam',
    cancelText: 'İptal'
  },
  Transfer: {
    notFoundContent: 'Bulunamadı',
    searchPlaceholder: 'Arama',
    itemUnit: 'Öğe',
    itemsUnit: 'Öğeler'
  },
  Select: {
    notFoundContent: 'Bulunamadı'
  },
  Upload: {
    uploading: 'Yükleniyor...',
    removeFile: 'Dosyay\u0131 kald\u0131r',
    uploadError: 'Yükleme Hatası',
    previewFile: 'Dosyay\u0131 \xD6nizle'
  }
};
module.exports = exports['default'];