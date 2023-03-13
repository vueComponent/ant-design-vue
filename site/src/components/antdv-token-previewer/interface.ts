import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import type { VueNode } from 'ant-design-vue/es/_util/type';

export type Theme = {
  name: string;
  key: string;
  config: ThemeConfig;
};

export type AliasToken = Exclude<ThemeConfig['token'], undefined>;
export type TokenValue = string | number | string[] | number[] | boolean;
export type TokenName = keyof AliasToken;

// 修改线  以上都是改过的
export interface ComponentDemo {
  tokens?: TokenName[];
  demo: VueNode;
  key: string;
}

export interface MutableTheme extends Theme {
  onThemeChange?: (newTheme: ThemeConfig, path: string[]) => void;
  onReset?: (path: string[]) => void;
  getCanReset?: (path: string[]) => boolean;
}

export type PreviewerProps = {
  onSave?: (themeConfig: ThemeConfig) => void;
  showTheme?: boolean;
  theme?: Theme;
  onThemeChange?: (config: ThemeConfig) => void;
};

export type SelectedToken = {
  seed?: string[];
  map?: string[];
  alias?: string[];
};
