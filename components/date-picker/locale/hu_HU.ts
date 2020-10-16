import CalendarLocale from '../../vc-calendar/src/locale/hu_HU';
import TimePickerLocale from '../../time-picker/locale/hu_HU';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Válasszon dátumot',
    rangePlaceholder: ['Kezdő dátum', 'Befejezés dátuma'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
