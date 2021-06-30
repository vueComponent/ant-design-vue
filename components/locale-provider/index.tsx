import type { App, VNode, PropType } from 'vue';
import { provide, defineComponent, reactive, watch, onUnmounted } from 'vue';
import PropTypes from '../_util/vue-types';
import moment from 'moment';
import interopDefault from '../_util/interopDefault';
import type { ModalLocale } from '../modal/locale';
import { changeConfirmLocale } from '../modal/locale';
import warning from '../_util/warning';
import { withInstall } from '../_util/type';
import type { ValidateMessages } from '../form/interface';
export interface Locale {
  locale: string;
  Pagination?: Object;
  DatePicker?: Object;
  TimePicker?: Object;
  Calendar?: Object;
  Table?: Object;
  Modal?: ModalLocale;
  Popconfirm?: Object;
  Transfer?: Object;
  Select?: Object;
  Upload?: Object;

  Form?: {
    optional?: string;
    defaultValidateMessages: ValidateMessages;
  };
  Image?: {
    preview: string;
  };
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: VNode | VNode[];
  ANT_MARK__?: string;
}

export const ANT_MARK = 'internalMark';

function setMomentLocale(locale?: Locale) {
  if (locale && locale.locale) {
    interopDefault(moment).locale(locale.locale);
  } else {
    interopDefault(moment).locale('en');
  }
}

const LocaleProvider = defineComponent({
  name: 'ALocaleProvider',
  props: {
    locale: {
      type: Object as PropType<Locale>,
    },
    ANT_MARK__: PropTypes.string,
  },
  setup(props, { slots }) {
    warning(
      props.ANT_MARK__ === ANT_MARK,
      'LocaleProvider',
      '`LocaleProvider` is deprecated. Please use `locale` with `ConfigProvider` instead',
    );
    const state = reactive({
      antLocale: {
        ...props.locale,
        exist: true,
      },
      ANT_MARK__: ANT_MARK,
    });
    provide('localeData', state);
    watch(
      () => props.locale,
      val => {
        state.antLocale = {
          ...val,
          exist: true,
        };
        setMomentLocale(val);
        changeConfirmLocale(val && val.Modal);
      },
      { immediate: true },
    );
    onUnmounted(() => {
      changeConfirmLocale();
    });

    return () => {
      return slots.default?.();
    };
  },
});

/* istanbul ignore next */
LocaleProvider.install = function (app: App) {
  app.component(LocaleProvider.name, LocaleProvider);
  return app;
};

export default withInstall(LocaleProvider);
