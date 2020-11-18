import { reactive, provide, VNodeTypes, PropType, defineComponent, watch } from 'vue';
import PropTypes from '../_util/vue-types';
import defaultRenderEmpty, { RenderEmptyHandler } from './renderEmpty';
import LocaleProvider, { Locale, ANT_MARK } from '../locale-provider';
import { TransformCellTextProps } from '../table/interface';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { withInstall } from '../_util/type';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface CSPConfig {
  nonce?: string;
}

export { RenderEmptyHandler };

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
  direction?: 'ltr' | 'rtl';
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
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

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: VNodeTypes;
  renderEmpty?: RenderEmptyHandler;
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
  dropdownMatchSelectWidth?: boolean;
}

const ConfigProvider = defineComponent({
  name: 'AConfigProvider',
  props: {
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
      type: Object as PropType<SizeType>,
    },
    direction: {
      type: String as PropType<'ltr' | 'rtl'>,
    },
    space: {
      type: [String, Number] as PropType<SizeType | number>,
    },
    virtual: PropTypes.looseBool,
    dropdownMatchSelectWidth: PropTypes.looseBool,
  },
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

    watch(props, () => {
      Object.assign(configProvider, props);
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

export const defaultConfigProvider: ConfigConsumerProps = {
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `ant-${suffixCls}`;
  },
  renderEmpty: defaultRenderEmpty,
};

export default withInstall(ConfigProvider);
