import type { App, MaybeRef, Plugin, WatchStopHandle } from 'vue';
import { watch, computed, reactive, defineComponent, watchEffect } from 'vue';
import defaultRenderEmpty from './renderEmpty';
import type { RenderEmptyHandler } from './renderEmpty';
import type { Locale } from '../locale-provider';
import LocaleProvider, { ANT_MARK } from '../locale-provider';

import LocaleReceiver from '../locale-provider/LocaleReceiver';

import message from '../message';
import notification from '../notification';
import { registerTheme } from './cssVariables';
import defaultLocale from '../locale/en_US';
import type { ValidateMessages } from '../form/interface';
import useStyle from './style';
import useTheme from './hooks/useTheme';
import defaultSeedToken from '../theme/themes/seed';
import type { ConfigProviderInnerProps, ConfigProviderProps, Theme } from './context';
import {
  useConfigContextProvider,
  useConfigContextInject,
  configProviderProps,
  useProvideGlobalForm,
  defaultIconPrefixCls,
} from './context';
import { useProviderSize } from './SizeContext';
import { useProviderDisabled } from './DisabledContext';
import { createTheme } from '../_util/cssinjs';
import { DesignTokenProvider } from '../theme/internal';

export type {
  ConfigProviderProps,
  Theme,
  SizeType,
  Direction,
  CSPConfig,
  DirectionType,
} from './context';
export const defaultPrefixCls = 'ant';
export { defaultIconPrefixCls };
function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls;
}

function getGlobalIconPrefixCls() {
  return globalConfigForApi.iconPrefixCls || defaultIconPrefixCls;
}
const globalConfigBySet = reactive<ConfigProviderProps>({}); // 权重最大
export const globalConfigForApi: ConfigProviderProps & {
  getRootPrefixCls?: (rootPrefixCls?: string, customizePrefixCls?: string) => string;
} = reactive({});

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

watchEffect(() => {
  Object.assign(globalConfigForApi, globalConfigBySet);
  globalConfigForApi.prefixCls = getGlobalPrefixCls();
  globalConfigForApi.iconPrefixCls = getGlobalIconPrefixCls();
  globalConfigForApi.getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls;
  };
  globalConfigForApi.getRootPrefixCls = () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  };
});

type GlobalConfigProviderProps = {
  prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
  iconPrefixCls?: MaybeRef<ConfigProviderProps['iconPrefixCls']>;
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
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
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
    const parentContext = useConfigContextInject();
    const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
      const { prefixCls = 'ant' } = props;
      if (customizePrefixCls) return customizePrefixCls;
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    };
    const iconPrefixCls = computed(
      () => props.iconPrefixCls || parentContext.iconPrefixCls.value || defaultIconPrefixCls,
    );
    const shouldWrapSSR = computed(() => iconPrefixCls.value !== parentContext.iconPrefixCls.value);
    const csp = computed(() => props.csp || parentContext.csp?.value);

    const wrapSSR = useStyle(iconPrefixCls);

    const mergedTheme = useTheme(
      computed(() => props.theme),
      computed(() => parentContext.theme?.value),
    );
    const renderEmptyComponent = (name?: string) => {
      const renderEmpty = (props.renderEmpty ||
        slots.renderEmpty ||
        parentContext.renderEmpty ||
        defaultRenderEmpty) as RenderEmptyHandler;
      return renderEmpty(name);
    };
    const autoInsertSpaceInButton = computed(
      () => props.autoInsertSpaceInButton ?? parentContext.autoInsertSpaceInButton?.value,
    );
    const locale = computed(() => props.locale || parentContext.locale?.value);
    watch(
      locale,
      () => {
        globalConfigBySet.locale = locale.value;
      },
      { immediate: true },
    );
    const direction = computed(() => props.direction || parentContext.direction?.value);
    const space = computed(() => props.space ?? parentContext.space?.value);
    const virtual = computed(() => props.virtual ?? parentContext.virtual?.value);
    const dropdownMatchSelectWidth = computed(
      () => props.dropdownMatchSelectWidth ?? parentContext.dropdownMatchSelectWidth?.value,
    );
    const getTargetContainer = computed(() =>
      props.getTargetContainer !== undefined
        ? props.getTargetContainer
        : parentContext.getTargetContainer?.value,
    );
    const getPopupContainer = computed(() =>
      props.getPopupContainer !== undefined
        ? props.getPopupContainer
        : parentContext.getPopupContainer?.value,
    );
    const pageHeader = computed(() =>
      props.pageHeader !== undefined ? props.pageHeader : parentContext.pageHeader?.value,
    );
    const input = computed(() =>
      props.input !== undefined ? props.input : parentContext.input?.value,
    );
    const pagination = computed(() =>
      props.pagination !== undefined ? props.pagination : parentContext.pagination?.value,
    );
    const form = computed(() =>
      props.form !== undefined ? props.form : parentContext.form?.value,
    );
    const select = computed(() =>
      props.select !== undefined ? props.select : parentContext.select?.value,
    );
    const componentSize = computed(() => props.componentSize);
    const componentDisabled = computed(() => props.componentDisabled);
    const wave = computed(() => props.wave ?? parentContext.wave?.value);
    const configProvider: ConfigProviderInnerProps = {
      csp,
      autoInsertSpaceInButton,
      locale,
      direction,
      space,
      virtual,
      dropdownMatchSelectWidth,
      getPrefixCls,
      iconPrefixCls,
      theme: computed(() => {
        return mergedTheme.value ?? parentContext.theme?.value;
      }),
      renderEmpty: renderEmptyComponent,
      getTargetContainer,
      getPopupContainer,
      pageHeader,
      input,
      pagination,
      form,
      select,
      componentSize,
      componentDisabled,
      transformCellText: computed(() => props.transformCellText),
      wave,
    };

    // ================================ Dynamic theme ================================
    const memoTheme = computed(() => {
      const { algorithm, token, ...rest } = mergedTheme.value || {};
      const themeObj =
        algorithm && (!Array.isArray(algorithm) || algorithm.length > 0)
          ? createTheme(algorithm)
          : undefined;
      return {
        ...rest,
        theme: themeObj,

        token: {
          ...defaultSeedToken,
          ...token,
        },
      };
    });
    const validateMessagesRef = computed(() => {
      // Additional Form provider
      let validateMessages: ValidateMessages = {};

      if (locale.value) {
        validateMessages =
          locale.value.Form?.defaultValidateMessages ||
          defaultLocale.Form?.defaultValidateMessages ||
          {};
      }
      if (props.form && props.form.validateMessages) {
        validateMessages = { ...validateMessages, ...props.form.validateMessages };
      }
      return validateMessages;
    });
    useConfigContextProvider(configProvider);
    useProvideGlobalForm({ validateMessages: validateMessagesRef });
    useProviderSize(componentSize);
    useProviderDisabled(componentDisabled);

    const renderProvider = (legacyLocale: Locale) => {
      let childNode = shouldWrapSSR.value ? wrapSSR(slots.default?.()) : slots.default?.();
      if (props.theme)
        childNode = <DesignTokenProvider value={memoTheme.value}>{childNode}</DesignTokenProvider>;
      return (
        <LocaleProvider locale={locale.value || legacyLocale} ANT_MARK__={ANT_MARK}>
          {childNode}
        </LocaleProvider>
      );
    };

    watchEffect(() => {
      if (direction.value) {
        message.config({
          rtl: direction.value === 'rtl',
        });
        notification.config({
          rtl: direction.value === 'rtl',
        });
      }
    });

    return () => (
      <LocaleReceiver children={(_, __, legacyLocale) => renderProvider(legacyLocale as Locale)} />
    );
  },
});

ConfigProvider.config = setGlobalConfig;

ConfigProvider.install = function (app: App) {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider as typeof ConfigProvider &
  Plugin & {
    readonly config: typeof setGlobalConfig;
  };
