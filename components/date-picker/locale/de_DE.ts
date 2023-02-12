import CalendarLocale from '../../vc-picker/locale/de_DE';
import TimePickerLocale from '../../time-picker/locale/de_DE';
import type { PickerLocale } from '../generatePicker';

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Datum auswählen',
    rangePlaceholder: ['Startdatum', 'Enddatum'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/issues/424

export default locale;
