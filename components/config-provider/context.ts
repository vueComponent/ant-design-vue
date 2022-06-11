import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue';
import { computed, inject, provide } from 'vue';
import type { ValidateMessages } from '../form/interface';
import type { RequiredMark } from '../form/Form';
import type { RenderEmptyHandler } from './renderEmpty';
import type { TransformCellTextProps } from '../table/interface';
import type { Locale } from '../locale-provider';

type GlobalFormCOntextProps = {
  validateMessages?: Ref<ValidateMessages>;
};
export const GlobalFormContextKey: InjectionKey<GlobalFormCOntextProps> =
  Symbol('GlobalFormContextKey');

export const useProvideGlobalForm = (state: GlobalFormCOntextProps) => {
  provide(GlobalFormContextKey, state);
};

export const useInjectGlobalForm = () => {
  return inject(GlobalFormContextKey, { validateMessages: computed(() => undefined) });
};

export const GlobalConfigContextKey: InjectionKey<GlobalFormCOntextProps> =
  Symbol('GlobalConfigContextKey');

export interface CSPConfig {
  nonce?: string;
}
export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export type Direction = 'ltr' | 'rtl';

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
  transformCellText?: (tableProps: TransformCellTextProps) => any;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  input?: {
    autocomplete?: string;
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
  form?: {
    requiredMark?: RequiredMark;
    colon?: boolean;
  };
}

export const configProviderProps = () => ({
  getTargetContainer: {
    type: Function as PropType<() => HTMLElement>,
  },
  getPopupContainer: {
    type: Function as PropType<(triggerNode?: HTMLElement) => HTMLElement>,
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
    default: undefined as CSPConfig,
  },
  input: {
    type: Object as PropType<{ autocomplete: string }>,
  },
  autoInsertSpaceInButton: { type: Boolean, default: undefined },
  locale: {
    type: Object as PropType<Locale>,
    default: undefined as Locale,
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
  virtual: { type: Boolean, default: undefined },
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
  form: {
    type: Object as PropType<{
      validateMessages?: ValidateMessages;
      requiredMark?: RequiredMark;
      colon?: boolean;
    }>,
    default: undefined as {
      validateMessages?: ValidateMessages;
      requiredMark?: RequiredMark;
      colon?: boolean;
    },
  },
  // internal use
  notUpdateGlobalConfig: Boolean,
});

export type ConfigProviderProps = Partial<ExtractPropTypes<ReturnType<typeof configProviderProps>>>;
