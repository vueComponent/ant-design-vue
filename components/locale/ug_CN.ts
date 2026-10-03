/* eslint-disable no-template-curly-in-string */
import Pagination from '../vc-pagination/locale/ug_CN';
import DatePicker from '../date-picker/locale/ug_CN';
import TimePicker from '../time-picker/locale/ug_CN';
import Calendar from '../calendar/locale/ug_CN';
import type { Locale } from '../locale-provider';

const typeTemplate = 'كەچۈرۈڭ${label}بولسا ئۈنۈملۈك${type}ئەمەس';

const localeValues: Locale = {
  locale: 'ug-cn',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    placeholder: 'تاللاڭ',
  },
  Table: {
    filterTitle: 'تاسقاش',
    filterConfirm: 'جەزىملەشتۈرۈش',
    filterReset: 'قايتىلاش',
    filterEmptyText: 'تاشقاش تۈرى يوق',
    filterCheckall: 'ھەممىنى تاللاش',
    filterSearchPlaceholder: 'تاسقاشتىن ئىزدەڭ',
    selectAll: 'بۇ بەتتىكى ھەممىنى تاللاش',
    selectInvert: 'بۇ بەتتىكى تەتۈرىنى تاللاش',
    selectNone: 'ھەممىنى قۇرۇقداش',
    selectionAll: 'ھەممىنى تاللاش',
    sortTitle: 'تەرتىپلەش',
    expand: 'قۇرنى ئېچىش',
    collapse: 'قۇرنى يېپىش',
    triggerDesc: 'تۆۋەنلەش',
    triggerAsc: 'ئېشىش',
    cancelSort: 'تەرتىپنى قالدۇرۇش',
  },
  Tour: {
    Next: 'كىيىنكى قەدىم',
    Previous: 'ئالدىنقى قەدەم',
    Finish: 'زىيارەتنى ئاخىرلاشتۇرۇش',
  },
  Modal: {
    okText: 'جەزىملەشتۈرۈش',
    cancelText: 'قالدۇرۇش',
    justOkText: 'بىلدىم',
  },
  Popconfirm: {
    cancelText: 'قالدۇرۇش',
    okText: 'جەزىملەشتۈرۈش',
  },
  Transfer: {
    searchPlaceholder: 'ھالقىلىق سۆزنى كىرگۈزۈڭ',
    itemUnit: 'تۈر',
    itemsUnit: 'تۈر',
    remove: 'ئۆچۈرۈش',
    selectCurrent: 'بۇ بەتتىكى ھەممىنى تاللاش',
    removeCurrent: 'بۇ بەتتىكى ھەممىنى ئۆچۈرۈش',
    selectAll: 'بۇ بەتتىكى ھەممىنى تاللاش',
    removeAll: 'بۇ بەتتىكى ھەممىنى ئۆچۈرۈش',
    selectInvert: 'بۇ بەتتىكى تەتۈرىنى تاللاش',
  },
  Upload: {
    uploading: '... رەسىم يوللىنىۋاتىدۇ',
    removeFile: 'رەسىمنى ئۆچۈرۈش',
    uploadError: 'يوللاش مەغلۇپ بولدى',
    previewFile: 'كۆرۈش',
    downloadFile: 'چۈشۈرۈش',
  },
  Empty: {
    description: 'ھازىرچە ئۇچۇر يوق',
  },
  Icon: {
    icon: 'رەسىم',
  },
  Text: {
    edit: 'تەھرىرلەش',
    copy: 'كۆچۈرۈش',
    copied: 'كۆچۈرۈش ئوڭۇشلۇق بولدى',
    expand: 'ئېچىش',
  },
  PageHeader: {
    back: 'قايتىش',
  },
  Form: {
    optional: '(تاللانما)',
    defaultValidateMessages: {
      default: 'نى${label} دەلىللەش مەغلۇپ بولدى',
      required: '${label}نى كىرگۈزۈڭ',
      enum: '${label}چوقۇم تۆۋەندىكىلەردىن بىرى بولسۇن[${enum}]',
      whitespace: '${label}قۇرۇق بولمىسۇن',
      date: {
        format: '${label}چىسلا توغرا ئەمەس',
        parse: '${label}نى چىسلاغا ئايلاندۇرغىلى بولمايدۇ',
        invalid: '${label}بولسا  ئۈنۈمسىز چسلا',
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: '${label}چوقۇم${len}دانە ھەرىپ',
        min: '${label}كەمىدە${min}دانە ھەرىپ',
        max: '${label}ئەڭ كۆپ بولغاندا${max}دانە ھەرىپ',
        range: '${label}چوقۇم${min}-${max}نىڭ ئارىسىدا بولسۇن',
      },
      number: {
        len: '${label}چوقۇم چوڭ${len}دىن',
        min: '${label}ئەڭ كىچىك قىممىتى${min}',
        max: '${label}ئەڭ چوڭ قىممىتى${max}',
        range: '${label}چوقۇم${min}-${max}نىڭ ئارىسىدا بولسۇن',
      },
      array: {
        len: 'چوقۇم${len}دانە${label}',
        min: 'كەمىدە${min}دانە${label}',
        max: 'ئەڭ كۆپ بولغاندا${max}دانە${label}',
        range: '${label}سانى چوقۇم${min}-${max}نىڭ ئارىسىدا بولسۇن',
      },
      pattern: {
        mismatch: '${label}نىڭ ھالىتى بىلەن${pattern} نىڭ ھالىتى ماسلاشمىدى',
      },
    },
  },
  Image: {
    preview: 'كۆرۈش',
  },
  QRCode: {
    expired: 'ئىككىلىك كودنىڭ ۋاقتى ئۆتتى',
    refresh: 'بىسىپ يېڭىلاڭ',
    scanned: 'سېكانىرلاندى',
  },
};

export default localeValues;