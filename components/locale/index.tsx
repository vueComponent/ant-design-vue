import type { App, VNode, PropType } from 'vue';
import { provide, defineComponent, reactive, watch } from 'vue';
import type { ModalLocale } from '../modal/locale';
import { changeConfirmLocale } from '../modal/locale';
import warning from '../_util/warning';
import { withInstall } from '../_util/type';
import type { ValidateMessages } from '../form/interface';
import type { TransferLocale } from '../transfer';
import type { PickerLocale as DatePickerLocale } from '../date-picker/generatePicker';
import type { PaginationLocale } from '../pagination/Pagination';
import type { TableLocale } from '../table/interface';
import type { UploadLocale } from '../upload/interface';
import type { TourLocale } from '../tour/interface';

interface TransferLocaleForEmpty {
  description: string;
}
export interface Locale {
  locale: string;
  Pagination?: PaginationLocale;
  Table?: TableLocale;
  Popconfirm?: Record<string, any>;
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
  Upload?: UploadLocale;
  Empty?: TransferLocaleForEmpty;
  global?: Record<string, any>;
  PageHeader?: { back: string };
  Icon?: Record<string, any>;
  Text?: {
    edit?: any;
    copy?: any;
    copied?: any;
    expand?: any;
  };
  Tour?: TourLocale;
  QRCode?: {
    expired?: string;
    refresh?: string;
    scanned?: string;
  };
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: VNode | VNode[];
  ANT_MARK__?: string;
}

export const ANT_MARK = 'internalMark';

const LocaleProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ALocaleProvider',
  props: {
    locale: {
      type: Object as PropType<Locale>,
    },
    ANT_MARK__: String,
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
      locale => {
        changeConfirmLocale(locale && locale.Modal);
        state.antLocale = {
          ...locale,
          exist: true,
        } as any;
      },
      { immediate: true },
    );

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
