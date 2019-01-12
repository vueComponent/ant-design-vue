import CalendarLocale from '../../vc-calendar/src/locale/sr_RS';
import TimePickerLocale from '../../time-picker/locale/sr_RS';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Izaberite datum',
    rangePlaceholder: ['Početni datum', 'Krajnji datum'],
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
