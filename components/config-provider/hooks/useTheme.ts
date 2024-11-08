import type { ThemeConfig } from '../context';
import { defaultConfig } from '../../_theme/internal';
import type { Ref } from 'vue';
import { computed } from 'vue';
import devWarning from '../../vc-util/warning';
const themeKey = 'antdvtheme';
export default function useTheme(theme?: Ref<ThemeConfig>, parentTheme?: Ref<ThemeConfig>) {
  const themeConfig = computed(() => theme?.value || {});
  const parentThemeConfig = computed<ThemeConfig>(() =>
    themeConfig.value.inherit === false || !parentTheme?.value ? defaultConfig : parentTheme.value,
  );

  if (process.env.NODE_ENV !== 'production') {
    const cssVarEnabled = themeConfig.value.cssVar || parentThemeConfig.value.cssVar;
    const validKey = !!(
      (typeof themeConfig.value.cssVar === 'object' && themeConfig.value.cssVar?.key) ||
      themeKey
    );
    devWarning(
      !cssVarEnabled || validKey,
      '[Ant Design Vue ConfigProvider] Missing key in `cssVar` config. Please set `cssVar.key` manually in each ConfigProvider inside `cssVar` enabled ConfigProvider.',
    );
  }

  const mergedTheme = computed(() => {
    if (!theme?.value) {
      return parentTheme?.value;
    }

    // Override
    const mergedComponents = {
      ...parentThemeConfig.value.components,
    };

    Object.keys(theme.value.components || {}).forEach(componentName => {
      mergedComponents[componentName] = {
        ...mergedComponents[componentName],
        ...theme.value.components![componentName],
      } as any;
    });

    const cssVarKey = `css-var-${themeKey.replace(/:/g, '')}`;

    const mergedCssVar = (themeConfig.value.cssVar ?? parentThemeConfig.value.cssVar) && {
      prefix: 'ant', // Default to ant
      ...(typeof parentThemeConfig.value.cssVar === 'object' ? parentThemeConfig.value.cssVar : {}),
      ...(typeof themeConfig.value.cssVar === 'object' ? themeConfig.value.cssVar : {}),
      key:
        (typeof themeConfig.value.cssVar === 'object' && themeConfig.value.cssVar?.key) ||
        cssVarKey,
    };

    // Base token
    return {
      ...parentThemeConfig.value,
      ...themeConfig.value,

      token: {
        ...parentThemeConfig.value.token,
        ...themeConfig.value.token,
      },
      components: mergedComponents,
      cssVar: mergedCssVar,
    };
  });

  return mergedTheme;
}
