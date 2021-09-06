import type { App, VNode, PropType } from 'vue';
import { provide, defineComponent, reactive, watch, onUnmounted } from 'vue';
import PropTypes from '../_util/vue-types';
import type { ModalLocale } from '../modal/locale';
import { changeConfirmLocale } from '../modal/locale';
import warning from '../_util/warning';
import { withInstall } from '../_util/type';
import type { ValidateMessages } from '../form/interface';
import type { TransferLocale } from '../transfer';
import type { PickerLocale as DatePickerLocale } from '../date-picker/generatePicker';
import type { PaginationLocale } from '../pagination/Pagination';
import type { TableLocale } from '../table/interface';

interface TransferLocaleForEmpty {
  description: string;
}
export interface Locale {
  locale: string;
  Pagination?: PaginationLocale;
  Table?: TableLocale;
  Popconfirm?: Record<string, any>;
  Upload?: Record<string, any>;
  Form?: {
    optional?: string;
    defaultValidateMessages: ValidateMessages;
  };
  Image?: {
    preview: string;
  };
  DatePicker?: DatePickerLocale;
  TimePicker?: Record<string, any>;
  Calendar?: Record<string, any>;
  Modal?: ModalLocale;
  Transfer?: Partial<TransferLocale>;
  Select?: Record<string, any>;
  Empty?: TransferLocaleForEmpty;
  global?: Record<string, any>;
  PageHeader?: { back: string };
  Icon?: Record<string, any>;
  Text?: Record<string, any>;
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: VNode | VNode[];
  ANT_MARK__?: string;
}

export const ANT_MARK = 'internalMark';

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
          ...props.locale,
          exist: true,
        } as any;
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
