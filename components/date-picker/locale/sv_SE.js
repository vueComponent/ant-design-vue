import CalendarLocale from '../../vc-calendar/src/locale/sv_SE';
import TimePickerLocale from '../../time-picker/locale/sv_SE';

const locale = {
  lang: {
    placeholder: 'Välj datum',
    rangePlaceholder: ['Startdatum', 'Slutdatum'],
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
