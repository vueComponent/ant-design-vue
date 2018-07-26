import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/ko_KR';
import TimePickerLocale from '../../time-picker/locale/ko_KR';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: '날짜 선택',
    rangePlaceholder: ['시작일', '종료일']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // All settings at:
  // https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
  // o cale/example.json

};export default locale;