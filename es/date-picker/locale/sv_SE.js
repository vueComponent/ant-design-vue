import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/sv_SE';
import TimePickerLocale from '../../time-picker/locale/sv_SE';

var locale = {
  lang: _extends({
    placeholder: 'Välj datum',
    rangePlaceholder: ['Startdatum', 'Slutdatum']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json

};export default locale;