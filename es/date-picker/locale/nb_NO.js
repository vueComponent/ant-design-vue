import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/nb_NO';
import TimePickerLocale from '../../time-picker/locale/nb_NO';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Velg dato',
    rangePlaceholder: ['Startdato', 'Sluttdato']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};export default locale;