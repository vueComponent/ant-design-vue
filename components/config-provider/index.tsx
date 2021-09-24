import type { PropType, ExtractPropTypes, UnwrapRef, App, Plugin, WatchStopHandle } from 'vue';
import { reactive, provide, defineComponent, watch, ref, unref, watchEffect } from 'vue';
import PropTypes from '../_util/vue-types';
import defaultRenderEmpty from './renderEmpty';
import type { RenderEmptyHandler } from './renderEmpty';
import type { Locale } from '../locale-provider';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import type { TransformCellTextProps } from '../table/interface';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import type { RequiredMark } from '../form/Form';
import type { MaybeRef } from '../_util/type';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface CSPConfig {
  nonce?: string;
}

export type { RenderEmptyHandler };

export type Direction = 'ltr' | 'rtl';

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
  transformCellText?: (tableProps: TransformCellTextProps) => any;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  input?: {
    autoComplete?: string;
  };
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  componentSize?: SizeType;
  direction?: 'ltr' | 'rtl';
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean | number;
}

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
  'pageHeader',
];

export const defaultPrefixCls = 'ant';
const globalPrefixCls = ref<string>();

type GlobalConfigProviderProps = {
  prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
};

let stopWatchEffect: WatchStopHandle;
const setGlobalConfig = (params: GlobalConfigProviderProps) => {
  if (stopWatchEffect) {
    stopWatchEffect();
  }
  stopWatchEffect = watchEffect(() => {
    const prefixCls = unref(params.prefixCls);
    if (prefixCls !== undefined) {
      globalPrefixCls.value = prefixCls;
    }
  });
};

function getGlobalPrefixCls() {
  return globalPrefixCls.value || defaultPrefixCls;
}

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getRootPrefixCls: (rootPrefixCls?: string, customizePrefixCls?: string) => {
    // Customize rootPrefixCls is first priority
    if (rootPrefixCls) {
      return rootPrefixCls;
    }

    // If Global prefixCls provided, use this
    if (globalPrefixCls.value) {
      return globalPrefixCls.value;
    }

    // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
    if (customizePrefixCls && customizePrefixCls.includes('-')) {
      return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1');
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
});

export const configProviderProps = {
  getTargetContainer: {
    type: Function as PropType<() => HTMLElement>,
  },
  getPopupContainer: {
    type: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
  },
  prefixCls: String,
  getPrefixCls: {
    type: Function as PropType<(suffixCls?: string, customizePrefixCls?: string) => string>,
  },
  renderEmpty: {
    type: Function as PropType<RenderEmptyHandler>,
  },
  transformCellText: {
    type: Function as PropType<(tableProps: TransformCellTextProps) => any>,
  },
  csp: {
    type: Object as PropType<CSPConfig>,
  },
  autoInsertSpaceInButton: PropTypes.looseBool,
  locale: {
    type: Object as PropType<Locale>,
  },
  pageHeader: {
    type: Object as PropType<{ ghost: boolean }>,
  },
  componentSize: {
    type: String as PropType<SizeType>,
  },
  direction: {
    type: String as PropType<'ltr' | 'rtl'>,
  },
  space: {
    type: Object as PropType<{ size: SizeType | number }>,
  },
  virtual: PropTypes.looseBool,
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
  form: {
    type: Object as PropType<{ requiredMark?: RequiredMark }>,
  },
};

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>;

const ConfigProvider = defineComponent({
  name: 'AConfigProvider',
  inheritAttrs: false,
  props: configProviderProps,
  setup(props, { slots }) {
    const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
      const { prefixCls = 'ant' } = props;
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
    };

    const renderEmptyComponent = (name?: string) => {
      const renderEmpty = (props.renderEmpty ||
        slots.renderEmpty ||
        defaultRenderEmpty) as RenderEmptyHandler;
      return renderEmpty(name);
    };

    const getPrefixClsWrapper = (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls } = props;

      if (customizePrefixCls) return customizePrefixCls;

      const mergedPrefixCls = prefixCls || getPrefixCls('');

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    };

    const configProvider = reactive({
      ...props,
      getPrefixCls: getPrefixClsWrapper,
      renderEmpty: renderEmptyComponent,
    });
    Object.keys(props).forEach(key => {
      watch(
        () => props[key],
        () => {
          configProvider[key] = props[key];
        },
      );
    });

    provide('configProvider', configProvider);

    const renderProvider = (legacyLocale: Locale) => {
      return (
        <LocaleProvider locale={props.locale || legacyLocale} ANT_MARK__={ANT_MARK}>
          {slots.default?.()}
        </LocaleProvider>
      );
    };

    return () => (
      <LocaleReceiver children={(_, __, legacyLocale) => renderProvider(legacyLocale as Locale)} />
    );
  },
});

export const defaultConfigProvider: UnwrapRef<ConfigProviderProps> = reactive({
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `ant-${suffixCls}` : 'ant';
  },
  renderEmpty: defaultRenderEmpty,
  direction: 'ltr',
});

ConfigProvider.config = setGlobalConfig;
ConfigProvider.install = function (app: App) {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider as typeof ConfigProvider &
  Plugin & {
    readonly config: typeof setGlobalConfig;
  };
