import type { UnwrapRef, App, Plugin, WatchStopHandle } from 'vue';
import { computed, reactive, provide, defineComponent, watch, watchEffect } from 'vue';
import defaultRenderEmpty from './renderEmpty';
import type { RenderEmptyHandler } from './renderEmpty';
import type { Locale } from '../locale-provider';
import LocaleProvider, { ANT_MARK } from '../locale-provider';

import LocaleReceiver from '../locale-provider/LocaleReceiver';

import type { MaybeRef } from '../_util/type';
import message from '../message';
import notification from '../notification';
import { registerTheme } from './cssVariables';
import defaultLocale from '../locale/default';
import type { ValidateMessages } from '../form/interface';

import type { ConfigProviderProps, Theme } from './context';
import { configProviderProps, useProvideGlobalForm } from './context';

export type { ConfigProviderProps, Theme, SizeType, Direction, CSPConfig } from './context';
export const defaultPrefixCls = 'ant';
function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls;
}
const globalConfigByCom = reactive<ConfigProviderProps>({});
const globalConfigBySet = reactive<ConfigProviderProps>({}); // 权重最大
export const globalConfigForApi = reactive<
  ConfigProviderProps & {
    getRootPrefixCls?: (rootPrefixCls?: string, customizePrefixCls?: string) => string;
  }
>({});

watchEffect(() => {
  Object.assign(globalConfigForApi, globalConfigByCom, globalConfigBySet);
  globalConfigForApi.prefixCls = getGlobalPrefixCls();
  globalConfigForApi.getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls;
  };
  globalConfigForApi.getRootPrefixCls = (rootPrefixCls?: string, customizePrefixCls?: string) => {
    // Customize rootPrefixCls is first priority
    if (rootPrefixCls) {
      return rootPrefixCls;
    }

    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
    if (customizePrefixCls && customizePrefixCls.includes('-')) {
      return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1');
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  };
});

type GlobalConfigProviderProps = {
  prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
  getPopupContainer?: ConfigProviderProps['getPopupContainer'];
};

let stopWatchEffect: WatchStopHandle;
const setGlobalConfig = (params: GlobalConfigProviderProps & { theme?: Theme }) => {
  if (stopWatchEffect) {
    stopWatchEffect();
  }
  stopWatchEffect = watchEffect(() => {
    Object.assign(globalConfigBySet, reactive(params));
    Object.assign(globalConfigForApi, reactive(params));
  });
  if (params.theme) {
    registerTheme(getGlobalPrefixCls(), params.theme);
  }
};

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
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
    if (customizePrefixCls && customizePrefixCls.includes('-')) {
      return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1');
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
});

const ConfigProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AConfigProvider',
  inheritAttrs: false,
  props: configProviderProps(),
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
    if (!props.notUpdateGlobalConfig) {
      Object.assign(globalConfigByCom, configProvider);
      watch(configProvider, () => {
        Object.assign(globalConfigByCom, configProvider);
      });
    }
    const validateMessagesRef = computed(() => {
      // Additional Form provider
      let validateMessages: ValidateMessages = {};

      if (props.locale) {
        validateMessages =
          props.locale.Form?.defaultValidateMessages ||
          defaultLocale.Form?.defaultValidateMessages ||
          {};
      }
      if (props.form && props.form.validateMessages) {
        validateMessages = { ...validateMessages, ...props.form.validateMessages };
      }
      return validateMessages;
    });
    useProvideGlobalForm({ validateMessages: validateMessagesRef });
    provide('configProvider', configProvider);

    const renderProvider = (legacyLocale: Locale) => {
      return (
        <LocaleProvider locale={props.locale || legacyLocale} ANT_MARK__={ANT_MARK}>
          {slots.default?.()}
        </LocaleProvider>
      );
    };

    watchEffect(() => {
      if (props.direction) {
        message.config({
          rtl: props.direction === 'rtl',
        });
        notification.config({
          rtl: props.direction === 'rtl',
        });
      }
    });

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
