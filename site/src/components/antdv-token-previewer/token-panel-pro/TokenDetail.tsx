import { Tooltip } from 'ant-design-vue';
import type { MutableTheme } from '../interface';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { PropType } from 'vue';
import { defineComponent, computed, toRefs } from 'vue';
import type { TokenValue } from '../interface';
import { useInjectLocaleContext } from '../locale';
import { mapRelatedAlias } from '../meta/TokenRelation';
import TokenInput from '../TokenInput';
import deepUpdateObj from '../utils/deepUpdateObj';
import getDesignToken from '../utils/getDesignToken';
import getValueByPath from '../utils/getValueByPath';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';

const useStyle = makeStyle('TokenDetail', token => ({
  '.token-panel-token-detail': {
    '.token-panel-pro-token-collapse-map-collapse-token-description': {
      color: token.colorTextPlaceholder,
      marginBottom: 8,
      fontSize: 12,
    },

    '.token-panel-pro-token-collapse-map-collapse-token-usage-tag-container': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: token.colorTextSecondary,
    },

    '.token-panel-pro-token-collapse-map-collapse-token-usage-tag': {
      display: 'inline-block',
      marginInlineEnd: 8,
      borderRadius: 4,
      height: 20,
      padding: '0 8px',
      fontSize: 12,
      lineHeight: '20px',
      backgroundColor: 'rgba(0,0,0,0.015)',
    },

    '.token-panel-pro-token-collapse-map-collapse-token-inputs': {
      padding: '8px 10px',
      backgroundColor: 'rgba(0,0,0,0.02)',
      marginTop: 12,
      '> *:not(:last-child)': {
        marginBottom: 8,
      },
    },
  },
}));

export type TokenDetailProps = {
  themes: MutableTheme[];
  path: string[];
  tokenName: string;
};

const TokenDetail = defineComponent({
  name: 'TokenDetail',
  inheritAttrs: false,
  props: {
    themes: { type: Array as PropType<MutableTheme[]> },
    path: { type: Array as PropType<string[]> },
    tokenName: { type: String },
  },
  setup(props, { attrs }) {
    const { themes, path, tokenName } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const tokenPath = computed(() => [...path.value, tokenName.value]);
    const locale = useInjectLocaleContext();

    const handleTokenChange = (theme: MutableTheme) => (value: TokenValue) => {
      theme.onThemeChange?.(deepUpdateObj(theme.config, [...path.value, tokenName.value], value), [
        ...path.value,
        tokenName.value,
      ]);
    };

    const relatedComponents = computed(() => {
      return getRelatedComponents([
        tokenName.value,
        ...((mapRelatedAlias as any)[tokenName.value] ?? []),
      ]);
    });

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, attrs.class, 'token-panel-token-detail')}>
          <div class="token-panel-pro-token-collapse-map-collapse-token-description">
            {
              (tokenMeta as any)[tokenName.value]?.[
                locale.value._lang === 'zh-CN' ? 'desc' : 'descEn'
              ]
            }
          </div>
          {relatedComponents.value.length > 0 && (
            <Tooltip title={getRelatedComponents(tokenName.value).join(', ')} placement="topLeft">
              <div class="token-panel-pro-token-collapse-map-collapse-token-usage-tag-container">
                {relatedComponents.value.map(item => (
                  <span
                    key={item}
                    class="token-panel-pro-token-collapse-map-collapse-token-usage-tag"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Tooltip>
          )}
          <div class="token-panel-pro-token-collapse-map-collapse-token-inputs">
            {themes.value.map(themeItem => {
              return (
                <div key={themeItem.key}>
                  <TokenInput
                    hideTheme={themes.value.length === 1}
                    theme={themeItem}
                    canReset={themeItem.getCanReset?.(tokenPath.value)}
                    onReset={() => themeItem.onReset?.(tokenPath.value)}
                    onChange={handleTokenChange(themeItem)}
                    value={
                      getValueByPath(themeItem.config, tokenPath.value) ??
                      (getDesignToken(themeItem.config) as any)[tokenName.value]
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>,
      );
    };
  },
});

export default TokenDetail;
