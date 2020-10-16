import CalendarLocale from '../../vc-calendar/src/locale/ro_RO';
import TimePickerLocale from '../../time-picker/locale/ro_RO';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Selectează data',
    rangePlaceholder: ['Data start', 'Data sfârșit'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
