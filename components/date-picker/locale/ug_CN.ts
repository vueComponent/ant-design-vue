import CalendarLocale from '../../vc-picker/locale/ug_CN';
import TimePickerLocale from '../../time-picker/locale/ug_CN';
import type { PickerLocale } from '../generatePicker';

// 统一合并为完整的 Locale
const locale: PickerLocale = {
  lang: {
    placeholder: 'چىسلانى تاللاڭ',
    yearPlaceholder: 'يىلنى تاللاڭ',
    quarterPlaceholder: 'پەسىلنى تاللاڭ',
    monthPlaceholder: 'ئاينى تاللاڭ',
    weekPlaceholder: 'ھەپتىنى تاللاڭ',
    rangePlaceholder: ['باشلىنىش ۋاقتى', 'ئاخىرلىشىش ۋاقتى'],
    rangeYearPlaceholder: ['باشلىنىش يىلى', 'ئاخىرلىشىش يىلى'],
    rangeMonthPlaceholder: ['باشلىنىش ئيى', 'ئاخىرلىشىش ئيى'],
    rangeQuarterPlaceholder: ['باشلىنىش پەسلى', 'ئاخىرلشىش پەسلى'],
    rangeWeekPlaceholder: ['باشلىنىش ھەپتىسى', 'ئاخىرلىشىش ھەپتىسى'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

locale.lang.ok = 'جەزىملەشتۈرۈش';

export default locale;