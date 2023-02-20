import type { ThemeConfig } from '../context';
import { defaultConfig } from '../../theme/internal';
import type { Ref } from 'vue';
import { computed } from 'vue';

export default function useTheme(theme?: Ref<ThemeConfig>, parentTheme?: Ref<ThemeConfig>) {
  const themeConfig = computed(() => theme?.value || {});
  const parentThemeConfig = computed<ThemeConfig>(() =>
    themeConfig.value.inherit === false || !parentTheme?.value ? defaultConfig : parentTheme.value,
  );

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

    // Base token
    return {
      ...parentThemeConfig.value,
      ...themeConfig.value,

      token: {
        ...parentThemeConfig.value.token,
        ...themeConfig.value.token,
      },
      components: mergedComponents,
    };
  });

  return mergedTheme;
}
