import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs';
import { theme as antTheme } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import type { Ref } from 'vue';
import { watchEffect, ref, computed } from 'vue';
import type { MutableTheme, Theme } from '../interface';
import deepUpdateObj from '../utils/deepUpdateObj';
import getDesignToken from '../utils/getDesignToken';
import getValueByPath from '../utils/getValueByPath';

const { darkAlgorithm: defaultDark, compactAlgorithm, defaultAlgorithm } = antTheme;

export type ThemeCode = 'light' | 'dark' | 'compact';
export const themeMap: Record<ThemeCode, DerivativeFunc<any, any>> = {
  dark: defaultDark,
  compact: compactAlgorithm,
  light: defaultAlgorithm,
};

export type SetThemeState = (theme: Theme, modifiedPath: string[], updated?: boolean) => void;

export type UseControlledTheme = (options: {
  theme?: Ref<Theme>;
  defaultTheme: Theme;
  onChange?: (theme: Theme) => void;
  darkAlgorithm?: Ref<DerivativeFunc<any, any>>;
}) => {
  theme: Ref<MutableTheme>;
  infoFollowPrimary: Ref<boolean>;
  onInfoFollowPrimaryChange: (value: boolean) => void;
  updateRef: () => void;
};

const useControlledTheme: UseControlledTheme = ({ theme: customTheme, defaultTheme, onChange }) => {
  const theme = ref<Theme>(customTheme.value ?? defaultTheme);
  const infoFollowPrimary = ref<boolean>(false);
  const themeRef = ref<Theme>(theme.value);
  const renderHolder = ref(0);

  const forceUpdate = () => (renderHolder.value = renderHolder.value + 1);

  const getNewTheme = (newTheme: Theme, force?: boolean): Theme => {
    const newToken = { ...newTheme.config.token };
    if (infoFollowPrimary.value || force) {
      newToken.colorInfo = getDesignToken(newTheme.config).colorPrimary;
    }
    return { ...newTheme, config: { ...newTheme.config, token: newToken } };
  };

  const handleSetTheme: SetThemeState = newTheme => {
    if (customTheme.value) {
      onChange?.(getNewTheme(newTheme));
    } else {
      theme.value = getNewTheme(newTheme);
    }
  };

  const handleResetTheme = (path: string[]) => {
    let newConfig = { ...theme.value.config };
    newConfig = deepUpdateObj(newConfig, path, getValueByPath(themeRef.value?.config, path));
    handleSetTheme({ ...theme.value, config: newConfig }, path);
  };

  const getCanReset = (origin: ThemeConfig, current: ThemeConfig) => (path: string[]) => {
    return getValueByPath(origin, path) !== getValueByPath(current, path);
  };

  // Controlled theme change
  watchEffect(() => {
    if (customTheme.value) {
      theme.value = customTheme.value;
    }
  });

  const handleInfoFollowPrimaryChange = (value: boolean) => {
    infoFollowPrimary.value = value;
    if (value) {
      theme.value = getNewTheme(theme.value, true);
    }
  };

  return {
    theme: computed(() => ({
      ...theme.value,
      onThemeChange: (config, path) => handleSetTheme({ ...theme.value, config }, path),
      onReset: handleResetTheme,
      getCanReset: getCanReset(themeRef.value?.config, theme.value.config),
    })),
    infoFollowPrimary,
    onInfoFollowPrimaryChange: handleInfoFollowPrimaryChange,
    updateRef: () => {
      themeRef.value = theme.value;
      forceUpdate();
    },
  };
};

export default useControlledTheme;
