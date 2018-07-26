'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uk_UA = require('../vc-pagination/locale/uk_UA');

var _uk_UA2 = _interopRequireDefault(_uk_UA);

var _uk_UA3 = require('../date-picker/locale/uk_UA');

var _uk_UA4 = _interopRequireDefault(_uk_UA3);

var _uk_UA5 = require('../time-picker/locale/uk_UA');

var _uk_UA6 = _interopRequireDefault(_uk_UA5);

var _uk_UA7 = require('../calendar/locale/uk_UA');

var _uk_UA8 = _interopRequireDefault(_uk_UA7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'uk',
  Pagination: _uk_UA2['default'],
  DatePicker: _uk_UA4['default'],
  TimePicker: _uk_UA6['default'],
  Calendar: _uk_UA8['default'],
  Table: {
    filterTitle: 'Фільтрувати',
    filterConfirm: 'OK',
    filterReset: 'Скинути',
    emptyText: 'Даних немає',
    selectAll: 'Обрати всі',
    selectInvert: 'Інвертувати вибір'
  },
  Modal: {
    okText: 'Гаразд',
    cancelText: 'Скасувати',
    justOkText: 'Гаразд'
  },
  Popconfirm: {
    okText: 'Гаразд',
    cancelText: 'Скасувати'
  },
  Transfer: {
    notFoundContent: 'Нічого не знайдено',
    searchPlaceholder: 'Введіть текст для пошуку',
    itemUnit: 'item',
    itemsUnit: 'items'
  },
  Select: {
    notFoundContent: 'Нічого не знайдено'
  },
  Upload: {
    uploading: 'Завантаження ...',
    removeFile: 'Видалити файл',
    uploadError: 'Помилка завантаження',
    previewFile: 'Попередній перегляд файлу'
  }
};
module.exports = exports['default'];