import CalendarLocale from '../../vc-calendar/src/locale/fa_IR';
import TimePickerLocale from '../../time-picker/locale/fa_IR';

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'انتخاب تاریخ',
    rangePlaceholder: ['تاریخ شروع', 'تاریخ پایان'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

export default locale;
