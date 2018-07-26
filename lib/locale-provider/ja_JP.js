'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ja_JP = require('../vc-pagination/locale/ja_JP');

var _ja_JP2 = _interopRequireDefault(_ja_JP);

var _ja_JP3 = require('../date-picker/locale/ja_JP');

var _ja_JP4 = _interopRequireDefault(_ja_JP3);

var _ja_JP5 = require('../time-picker/locale/ja_JP');

var _ja_JP6 = _interopRequireDefault(_ja_JP5);

var _ja_JP7 = require('../calendar/locale/ja_JP');

var _ja_JP8 = _interopRequireDefault(_ja_JP7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ja',
  Pagination: _ja_JP2['default'],
  DatePicker: _ja_JP4['default'],
  TimePicker: _ja_JP6['default'],
  Calendar: _ja_JP8['default'],
  Table: {
    filterTitle: 'メニューをフィルター',
    filterConfirm: 'OK',
    filterReset: 'リセット',
    emptyText: 'データがありません',
    selectAll: 'すべてを選択',
    selectInvert: '選択を反転'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'キャンセル',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'キャンセル'
  },
  Transfer: {
    notFoundContent: '結果はありません',
    searchPlaceholder: 'ここを検索',
    itemUnit: 'アイテム',
    itemsUnit: 'アイテム'
  },
  Select: {
    notFoundContent: '結果はありません'
  },
  Upload: {
    uploading: 'アップロード中...',
    removeFile: 'ファイルを削除',
    uploadError: 'アップロードエラー',
    previewFile: 'ファイルをプレビュー'
  }
};
module.exports = exports['default'];