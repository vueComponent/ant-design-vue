import Pagination from '../vc-pagination/locale/uk_UA';
import DatePicker from '../date-picker/locale/uk_UA';
import TimePicker from '../time-picker/locale/uk_UA';
import Calendar from '../calendar/locale/uk_UA';
import type { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'uk',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Фільтрувати',
    filterConfirm: 'OK',
    filterReset: 'Скинути',
    selectAll: 'Обрати всі',
    selectInvert: 'Інвертувати вибір',
  },
  Modal: {
    okText: 'Гаразд',
    cancelText: 'Скасувати',
    justOkText: 'Гаразд',
  },
  Popconfirm: {
    okText: 'Гаразд',
    cancelText: 'Скасувати',
  },
  Transfer: {
    searchPlaceholder: 'Введіть текст для пошуку',
    itemUnit: 'елем.',
    itemsUnit: 'елем.',
  },
  Upload: {
    uploading: 'Завантаження ...',
    removeFile: 'Видалити файл',
    uploadError: 'Помилка завантаження',
    previewFile: 'Попередній перегляд файлу',
    downloadFile: 'Завантажити файл',
  },
  Empty: {
    description: 'Даних немає',
  },
};

export default localeValues;
