import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/nl_NL';
import TimePickerLocale from '../../time-picker/locale/nl_NL';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Selecteer datum',
    rangePlaceholder: ['Begin datum', 'Eind datum']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // All settings at: https://github.com/ant-design/ant-design/issues/424

};export default locale;