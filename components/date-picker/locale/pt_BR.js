import CalendarLocale from '../../vc-calendar/src/locale/pt_BR';
import TimePickerLocale from '../../time-picker/locale/pt_BR';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Selecionar data',
    rangePlaceholder: ['Data de início', 'Data de fim'],
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
