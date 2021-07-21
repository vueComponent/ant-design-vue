import CalendarLocale from '../../vc-calendar/src/locale/is_IS';
import TimePickerLocale from '../../time-picker/locale/is_IS';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Veldu dag',
    rangePlaceholder: ['Upphafsdagur', 'Lokadagur'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
