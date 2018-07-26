import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/zh_CN';
import TimePickerLocale from '../../time-picker/locale/zh_CN';

var locale = {
  lang: _extends({
    placeholder: '请选择日期',
    rangePlaceholder: ['开始日期', '结束日期']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)

  // should add whitespace between char in Button
};locale.lang.ok = '确 定';

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

export default locale;