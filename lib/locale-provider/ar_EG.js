'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ar_EG = require('../vc-pagination/locale/ar_EG');

var _ar_EG2 = _interopRequireDefault(_ar_EG);

var _ar_EG3 = require('../date-picker/locale/ar_EG');

var _ar_EG4 = _interopRequireDefault(_ar_EG3);

var _ar_EG5 = require('../time-picker/locale/ar_EG');

var _ar_EG6 = _interopRequireDefault(_ar_EG5);

var _ar_EG7 = require('../calendar/locale/ar_EG');

var _ar_EG8 = _interopRequireDefault(_ar_EG7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ar',
  Pagination: _ar_EG2['default'],
  DatePicker: _ar_EG4['default'],
  TimePicker: _ar_EG6['default'],
  Calendar: _ar_EG8['default'],
  Table: {
    filterTitle: 'الفلاتر',
    filterConfirm: 'تأكيد',
    filterReset: 'إعادة ضبط',
    emptyText: 'لا توجد بيانات',
    selectAll: 'اختيار الكل',
    selectInvert: 'إلغاء الاختيار'
  },
  Modal: {
    okText: 'تأكيد',
    cancelText: 'إلغاء',
    justOkText: 'تأكيد'
  },
  Popconfirm: {
    okText: 'تأكيد',
    cancelText: 'إلغاء'
  },
  Transfer: {
    notFoundContent: 'لا يوجد محتوى',
    searchPlaceholder: 'ابحث هنا',
    itemUnit: 'عنصر',
    itemsUnit: 'عناصر'
  },
  Select: {
    notFoundContent: 'لايوجد محتوى'
  },
  Upload: {
    uploading: 'جاري الرفع...',
    removeFile: 'احذف الملف',
    uploadError: 'مشكلة فى الرفع',
    previewFile: 'استعرض الملف'
  }
};
module.exports = exports['default'];