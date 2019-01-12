import CalendarLocale from '../../vc-calendar/src/locale/sk_SK';
import TimePickerLocale from '../../time-picker/locale/sk_SK';

// 统一合并为完整的 Locale
const locale = {
  lang: {
    placeholder: 'Vybrať dátum',
    rangePlaceholder: ['Od', 'Do'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
// cale/example.json

export default locale;
