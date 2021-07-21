import CalendarLocale from '../../vc-calendar/src/locale/en_GB';
import TimePickerLocale from '../../time-picker/locale/en_GB';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
