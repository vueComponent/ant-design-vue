import { provide } from 'vue';
import PropTypes from '../_util/vue-types';
import moment from 'moment';
import interopDefault from '../_util/interopDefault';
import { changeConfirmLocale } from '../modal/locale';
import warning from '../_util/warning';
import { getSlot } from '../_util/props-util';
// export interface Locale {
//   locale: string;
//   Pagination?: Object;
//   DatePicker?: Object;
//   TimePicker?: Object;
//   Calendar?: Object;
//   Table?: Object;
//   Modal?: ModalLocale;
//   Popconfirm?: Object;
//   Transfer?: Object;
//   Select?: Object;
//   Upload?: Object;
// }
export const ANT_MARK = 'internalMark';
function setMomentLocale(locale) {
  if (locale && locale.locale) {
    interopDefault(moment).locale(locale.locale);
  } else {
    interopDefault(moment).locale('en');
  }
}

const LocaleProvider = {
  name: 'ALocaleProvider',
  props: {
    locale: PropTypes.object.def(() => ({})),
    _ANT_MARK__: PropTypes.string,
  },
  data() {
    warning(
      this._ANT_MARK__ === ANT_MARK,
      'LocaleProvider',
      '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead',
    );
    return {
      antLocale: {
        ...this.locale,
        exist: true,
      },
    };
  },
  watch: {
    locale(val) {
      this.antLocale = {
        ...val,
        exist: true,
      };
      setMomentLocale(val);
      changeConfirmLocale(val && val.Modal);
    },
  },
  created() {
    provide('localeData', this.$data);
    const { locale } = this;
    setMomentLocale(locale);
    changeConfirmLocale(locale && locale.Modal);
  },
  beforeUnmount() {
    changeConfirmLocale();
  },
  render() {
    return getSlot(this);
  },
};

/* istanbul ignore next */
LocaleProvider.install = function(app) {
  app.component(LocaleProvider.name, LocaleProvider);
};

export default LocaleProvider;
