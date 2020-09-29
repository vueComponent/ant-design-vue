import defaultRenderEmpty, { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
import { SizeType } from './SizeContext';

export interface CSPConfig {
  nonce?: string;
}

export interface IConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
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

export const ConfigContext = {
  // We provide a default function for Context without provider
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;

    return suffixCls ? `ant-${suffixCls}` : 'ant';
  },

  renderEmpty: defaultRenderEmpty,
};
