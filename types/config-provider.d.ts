import { AntdComponent, AntdProps } from './component';
import { App, VNodeChild } from 'vue';

import { Locale } from './locale-provider';

export interface CSPConfig {
  nonce?: string;
}

export declare class ConfigProvider extends AntdComponent {
  $props: AntdProps & {
    getPopupContainer?: (triggerNode: HTMLElement, dialogContext?: App | null) => HTMLElement;
    getPrefixCls?: (suffixCls: string, customizePrefixCls?: string) => string;
    renderEmpty?: Function | VNodeChild | JSX.Element;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    transformCellText?: Function | VNodeChild | JSX.Element;
    locale: Locale | object;
  };
}
