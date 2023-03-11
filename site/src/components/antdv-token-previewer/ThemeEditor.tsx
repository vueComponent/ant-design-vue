import type { PropType } from 'vue';
import { defineComponent, toRefs, ref, computed } from 'vue';
import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { SelectedToken, Theme } from './interface';
import type { Locale } from './locale';
import { useProvideLocaleContext, zhCN } from './locale';
import { mapRelatedAlias, seedRelatedAlias, seedRelatedMap } from './meta/TokenRelation';
import { getRelatedComponents } from './utils/statistic';
import makeStyle from './utils/makeStyle';
import useControlledTheme from './hooks/useControlledTheme';

import type { TokenPanelProProps } from './token-panel-pro';
import TokenPanelPro from './token-panel-pro';
import ComponentDemoPro from './token-panel-pro/ComponentDemoPro';
import { antdComponents } from './component-panel';

const useStyle = makeStyle('ThemeEditor', token => ({
  '.antd-theme-editor': {
    backgroundColor: token.colorBgLayout,
    display: 'flex',
  },
}));

const defaultTheme: Theme = {
  name: '默认主题',
  key: 'default',
  config: {},
};

export type ThemeEditorProps = {
  /**
   * @deprecated
   * @default true
   */
  simple?: boolean;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  darkAlgorithm?: DerivativeFunc<any, any>;
  locale?: Locale;
};

const ThemeEditor = defineComponent({
  name: 'ThemeEditor',
  inheritAttrs: false,
  props: {
    simple: { type: Boolean },
    theme: { type: Object as PropType<Theme> },
    onThemeChange: { type: Function as PropType<(theme: Theme) => void> },
    darkAlgorithm: { type: Function as PropType<DerivativeFunc<any, any>> },
    locale: { type: Object as PropType<Locale>, default: zhCN },
  },
  setup(props, { attrs, expose }) {
    const { theme: customTheme, darkAlgorithm, locale } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const selectedTokens = ref<SelectedToken>({
      seed: ['colorPrimary'],
    });

    const aliasOpen = ref<boolean>(false);

    const { theme, infoFollowPrimary, onInfoFollowPrimaryChange, updateRef } = useControlledTheme({
      theme: customTheme,
      defaultTheme,
      onChange: props.onThemeChange,
      darkAlgorithm,
    });

    const handleTokenSelect: TokenPanelProProps['onTokenSelect'] = (token, type) => {
      const tokens = typeof token === 'string' ? (token ? [token] : []) : token;
      if (type === 'seed') {
        return {
          seed: tokens,
        };
      }

      let newSelectedTokens = { ...selectedTokens.value };
      tokens.forEach(newToken => {
        newSelectedTokens = {
          ...selectedTokens.value,
          [type]: selectedTokens.value[type]?.includes(newToken)
            ? selectedTokens.value[type]?.filter(t => t !== newToken)
            : [...(selectedTokens.value[type] ?? []), newToken],
        };
      });
      if (type === 'map') {
        delete newSelectedTokens.alias;
      }
      selectedTokens.value = newSelectedTokens;
    };

    const computedSelectedTokens = computed(() => {
      if (
        selectedTokens.value.seed?.length &&
        !selectedTokens.value.map?.length &&
        !selectedTokens.value.alias?.length
      ) {
        return [
          ...selectedTokens.value.seed,
          ...((seedRelatedMap as any)[selectedTokens.value.seed[0]] ?? []),
          ...((seedRelatedAlias as any)[selectedTokens.value.seed[0]] ?? []),
        ];
      }
      if (selectedTokens.value.map?.length && !selectedTokens.value.alias?.length) {
        return [
          ...selectedTokens.value.map,
          ...selectedTokens.value.map.reduce((result, item) => {
            return result.concat((mapRelatedAlias as any)[item]);
          }, []),
        ];
      }
      if (selectedTokens.value.alias?.length) {
        return [...selectedTokens.value.alias];
      }
      return [];
    });

    const relatedComponents = computed(() => {
      return computedSelectedTokens.value ? getRelatedComponents(computedSelectedTokens.value) : [];
    });

    expose({
      updateRef,
    });

    useProvideLocaleContext(locale);

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, 'antd-theme-editor', attrs.class)}>
          <div
            style={{
              flex: aliasOpen.value ? '0 0 860px' : `0 0 ${860 - 320}px`,
              height: '100%',
              backgroundColor: '#F7F8FA',
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(246,247,249,0.00) 100%)',
              display: 'flex',
              transition: 'all 0.3s',
            }}
          >
            <TokenPanelPro
              aliasOpen={aliasOpen.value}
              onAliasOpenChange={open => (aliasOpen.value = open)}
              theme={theme.value}
              style={{ flex: 1 }}
              selectedTokens={selectedTokens.value}
              onTokenSelect={handleTokenSelect}
              infoFollowPrimary={infoFollowPrimary.value}
              onInfoFollowPrimaryChange={onInfoFollowPrimaryChange}
            />
          </div>
          {/* <ComponentDemoPro
            theme={theme.value}
            components={antdComponents}
            activeComponents={relatedComponents.value}
            selectedTokens={computedSelectedTokens.value}
            style={{ flex: 1, overflow: 'auto', height: '100%' }}
            componentDrawer
          /> */}
          <ComponentDemoPro
            theme={theme.value}
            components={antdComponents}
            activeComponents={relatedComponents.value}
            selectedTokens={computedSelectedTokens.value}
            style={{ flex: 1, overflow: 'auto' }}
            componentDrawer
          />
        </div>,
      );
    };
  },
});

export default ThemeEditor;
