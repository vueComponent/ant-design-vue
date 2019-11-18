import { AntdComponent } from './component';

import { Locale } from './locale-provider';

export interface CSPConfig {
  nonce?: string;
}

export declare class ConfigProvider extends AntdComponent {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  renderEmpty: Function;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
}
