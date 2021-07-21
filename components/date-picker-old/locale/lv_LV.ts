import CalendarLocale from '../../vc-calendar/src/locale/lv_LV';
import TimePickerLocale from '../../time-picker/locale/lv_LV';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Izvēlieties datumu',
    rangePlaceholder: ['Sākuma datums', 'Beigu datums'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
