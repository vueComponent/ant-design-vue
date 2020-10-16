import CalendarLocale from '../../vc-calendar/src/locale/hr_HR';
import TimePickerLocale from '../../time-picker/locale/hr_HR';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Odaberite datum',
    rangePlaceholder: ['Početni datum', 'Završni datum'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
