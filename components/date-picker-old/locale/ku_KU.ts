import CalendarLocale from '../../vc-calendar/src/locale/ku_KU';
import TimePickerLocale from '../../time-picker/locale/ku_KU';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'هەڵبژاردنی ڕێکەوت',
    rangePlaceholder: ['دەستپێکی ڕێکەوت', 'کوتایی ڕێکەوت'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
