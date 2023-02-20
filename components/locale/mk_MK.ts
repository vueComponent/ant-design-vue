import Pagination from '../vc-pagination/locale/mk_MK';
import DatePicker from '../date-picker/locale/mk_MK';
import TimePicker from '../time-picker/locale/mk_MK';
import Calendar from '../calendar/locale/mk_MK';
import type { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'mk',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    placeholder: 'Ве молиме означете',
  },
  Table: {
    filterTitle: 'Мени за филтрирање',
    filterConfirm: 'ОК',
    filterReset: 'Избриши',
    selectAll: 'Одбери страница',
    selectInvert: 'Инвертирај страница',
  },
  Modal: {
    okText: 'ОК',
    cancelText: 'Откажи',
    justOkText: 'ОК',
  },
  Popconfirm: {
    okText: 'ОК',
    cancelText: 'Откажи',
  },
  Transfer: {
    searchPlaceholder: 'Пребарај тука',
    itemUnit: 'предмет',
    itemsUnit: 'предмети',
  },
  Upload: {
    uploading: 'Се прикачува...',
    removeFile: 'Избриши фајл',
    uploadError: 'Грешка при прикачување',
    previewFile: 'Прикажи фајл',
    downloadFile: 'Преземи фајл',
  },
  Empty: {
    description: 'Нема податоци',
  },
  Icon: {
    icon: 'Икона',
  },
  Text: {
    edit: 'Уреди',
    copy: 'Копирај',
    copied: 'Копирано',
    expand: 'Зголеми',
  },
  PageHeader: {
    back: 'Назад',
  },
};

export default localeValues;
