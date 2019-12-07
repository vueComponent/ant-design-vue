import CalendarLocale from '../../vc-calendar/src/locale/he_IL';
import TimePickerLocale from '../../time-picker/locale/he_IL';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    rangePlaceholder: ['ಪ್ರಾರಂಭ ದಿನಾಂಕ', 'ಅಂತಿಮ ದಿನಾಂಕ'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;
