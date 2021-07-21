// Tamil Locale added to rc-calendar
import CalendarLocale from '../../vc-calendar/src/locale/ta_IN';
import TimePickerLocale from '../../time-picker/locale/ta_IN';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    rangePlaceholder: ['தொடக்க தேதி', 'கடைசி தேதி'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/vueComponent/ant-design-vue/blob/master/components/date-picker/locale/example.json

export default locale;
