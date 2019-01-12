import CalendarLocale from '../../vc-calendar/src/locale/bg_BG';
import TimePickerLocale from '../../time-picker/locale/bg_BG';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Избор на дата',
    rangePlaceholder: ['Начална', 'Крайна'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

export default locale;
