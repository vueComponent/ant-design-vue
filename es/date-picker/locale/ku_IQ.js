import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/ku_IQ';
import TimePickerLocale from '../../time-picker/locale/ku_IQ';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Dîrok hilbijêre',
    rangePlaceholder: ['Dîroka destpêkê', 'Dîroka dawîn']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
  // cale/example.json
};export default locale;