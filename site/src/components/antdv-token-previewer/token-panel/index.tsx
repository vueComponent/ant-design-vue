import type { PropType } from 'vue';
import { defineComponent, toRefs, ref, watchEffect, computed } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';
import { Dropdown, Input, Menu, Switch, theme as antdTheme } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import { SearchDropdown } from '../icons';
import type { AliasToken, MutableTheme, TokenValue } from '../interface';
import type { TokenType } from '../utils/classifyToken';
import { classifyToken, getTypeOfToken, TOKEN_SORTS } from '../utils/classifyToken';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import TokenCard, { IconMap, TextMap } from './token-card';
import { getTokenItemId } from './token-item';

const { useToken } = antdTheme;

const useStyle = makeStyle('AliasTokenPreview', token => ({
  '.preview-panel-wrapper': {
    overflow: 'auto',
    height: '100%',
    '.preview-panel': {
      height: '100%',
      minWidth: 300,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      '.preview-panel-token-wrapper': {
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        '&::before, &::after': {
          position: 'absolute',
          zIndex: 1,
          opacity: 0,
          transition: 'opacity .3s',
          content: '""',
          pointerEvents: 'none',
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 40,
        },

        '&::before': {
          top: 0,
          boxShadow: 'inset 0 10px 8px -8px #00000014',
        },

        '&::after': {
          bottom: 0,
          boxShadow: 'inset 0 -10px 8px -8px #00000014',
        },

        '&.preview-panel-token-wrapper-ping-top': {
          '&::before': {
            opacity: 1,
          },
        },
      },
      '.preview-panel-space': {
        marginBottom: 20,
        paddingInlineStart: token.paddingXS,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        '.preview-hide-token': {
          color: token.colorTextSecondary,
          fontSize: token.fontSizeSM,
          lineHeight: token.lineHeightSM,
          display: 'flex',
          alignItems: 'center',
          '>*:first-child': {
            marginInlineEnd: 2,
          },
        },
      },
      '.preview-panel-search': {
        backgroundColor: 'rgba(0, 0, 0, 2%)',
        borderRadius: token.borderRadiusLG,

        [`${token.rootCls}-input-group-addon`]: {
          backgroundColor: 'inherit',
          border: 'none',
          padding: 0,
          transition: `background-color ${token.motionDurationSlow}`,

          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 4%)',
          },
        },

        input: {
          fontSize: token.fontSizeSM,
          paddingInlineStart: 4,
        },

        '.previewer-token-type-dropdown-icon-active': {
          color: token.colorPrimary,
        },
      },
    },
  },
}));

export interface TokenPreviewProps {
  themes: MutableTheme[];
  selectedTokens?: string[];
  onTokenSelect?: (token: string) => void;
  filterTypes?: TokenType[];
  onFilterTypesChange?: (types: TokenType[]) => void;
  enableTokenSelect?: boolean;
}

export type TokenPanelRef = {
  scrollToToken: (token: string) => void;
};
export default defineComponent({
  name: 'TokenPreview',
  props: {
    themes: { type: Array as PropType<MutableTheme[]> },
    selectedTokens: { type: Array as PropType<string[]> },
    onTokenSelect: { type: Function as PropType<(token: string) => void> },
    filterTypes: { type: Array as PropType<TokenType[]> },
    onFilterTypesChange: { type: Function as PropType<(types: TokenType[]) => void> },
    enableTokenSelect: { type: Boolean },
  },
  setup(props, { attrs, expose }) {
    const { filterTypes, themes, selectedTokens, enableTokenSelect } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const { token } = useToken();

    const search = ref<string>('');
    const showAll = ref<boolean>(false);
    const showTokenListShadowTop = ref<boolean>(false);
    const cardWrapperRef = ref<HTMLDivElement>(null);
    const activeCards = ref<TokenType[]>([]);
    const activeToken = ref<string | undefined>();

    const mergedFilterTypes = ref<TokenType[]>(filterTypes.value || []);

    // TODO: Split AliasToken and SeedToken
    const groupedToken = computed(() => classifyToken(token.value as any));

    watchEffect(() => {
      const handleTokenListScroll = () => {
        showTokenListShadowTop.value = (cardWrapperRef.value?.scrollTop ?? 0) > 0;
      };
      cardWrapperRef.value?.addEventListener('scroll', handleTokenListScroll);
      const wrapper = cardWrapperRef.value;
      return () => {
        wrapper?.removeEventListener('scroll', handleTokenListScroll);
      };
    });

    expose({
      scrollToToken: tokenName => {
        const type = getTypeOfToken(tokenName);
        if (!activeCards.value.includes(type)) {
          activeCards.value = [...activeCards.value, type];
        }
        activeToken.value = tokenName;
        setTimeout(() => {
          const node = cardWrapperRef.value?.querySelector<HTMLElement>(
            `#${getTokenItemId(tokenName)}`,
          );
          if (!node) {
            return;
          }
          node?.scrollIntoView({
            block: 'center',
            inline: 'nearest',
          });
        }, 100);
      },
    });

    const handleAliasTokenChange = (theme: MutableTheme, tokenName: string, value: TokenValue) => {
      theme.onThemeChange?.(
        {
          ...theme.config,
          token: {
            ...theme.config.token,
            [tokenName]: value,
          },
        },
        ['token', tokenName],
      );
    };

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames('preview-panel-wrapper', hashId.value)}>
          <div class={classNames('preview-panel')}>
            <div style={{ padding: '16px' }}>
              <h3 class={classNames('preview-panel-space', hashId.value)}>
                <span>Alias Token 预览</span>
                <span class="preview-hide-token">
                  <span>显示所有</span>
                  <Switch
                    checked={showAll.value}
                    onChange={value => (showAll.value = value as any)}
                    size="small"
                  />
                </span>
              </h3>
              <Input
                allowClear
                onChange={e => {
                  search.value = e.target.value;
                }}
                bordered={false}
                addonBefore={
                  <>
                    <Dropdown
                      v-slots={{
                        overlay: () => (
                          <Menu
                            items={[
                              {
                                label: '筛选项',
                                type: 'group',
                                key: 'title-key',
                                style: { fontSize: '12px' },
                              },
                              ...TOKEN_SORTS.map(type => ({
                                icon: (
                                  <span>
                                    <CheckOutlined
                                      style={{
                                        opacity: mergedFilterTypes.value.includes(type) ? 1 : 0,
                                        marginInlineEnd: '8px',
                                        fontSize: '12px',
                                      }}
                                    />
                                    {IconMap[type]}
                                  </span>
                                ),
                                label: TextMap[type],
                                key: type,
                                onClick: () => {
                                  const newTypes = mergedFilterTypes.value.includes(type)
                                    ? mergedFilterTypes.value.filter(item => type !== item)
                                    : [...mergedFilterTypes.value, type];
                                  mergedFilterTypes.value = newTypes;
                                  props.onFilterTypesChange?.(newTypes);
                                },
                              })),
                            ]}
                          />
                        ),
                      }}
                      trigger={['click']}
                    >
                      <SearchDropdown
                        style={{
                          width: '32px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          paddingTop: '2px',
                          transition: 'color 0.3s',
                        }}
                        class={classNames({
                          'previewer-token-type-dropdown-icon-active':
                            mergedFilterTypes.value.length > 0,
                        })}
                      />
                    </Dropdown>
                  </>
                }
                class="preview-panel-search"
                placeholder="搜索 Token / 色值 / 文本 / 圆角等"
              />
            </div>
            <div
              class={classNames('preview-panel-token-wrapper', {
                'preview-panel-token-wrapper-ping-top': showTokenListShadowTop.value,
              })}
            >
              <div
                ref={cardWrapperRef}
                style={{ height: '100%', overflow: 'auto', padding: '0 16px' }}
              >
                <div>
                  {TOKEN_SORTS.filter(
                    type =>
                      type !== 'seed' &&
                      (mergedFilterTypes.value.includes(type) ||
                        mergedFilterTypes.value.length === 0) &&
                      (!search.value ||
                        groupedToken.value[type].some(item =>
                          item.toLowerCase().includes(search.value.toLowerCase()),
                        )),
                  ).map(key => (
                    <TokenCard
                      title={TextMap[key]}
                      icon={IconMap[key]}
                      key={key}
                      tokenPath={['token']}
                      tokenArr={groupedToken.value[key]}
                      keyword={search.value}
                      hideUseless={!showAll.value}
                      open={activeCards.value.includes(key)}
                      onOpenChange={open => {
                        activeCards.value = open
                          ? [...activeCards.value, key]
                          : activeCards.value.filter(item => item !== key);
                      }}
                      onTokenChange={handleAliasTokenChange}
                      activeToken={activeToken.value}
                      onActiveTokenChange={tokenName => (activeToken.value = tokenName)}
                      themes={themes.value}
                      selectedTokens={selectedTokens.value}
                      onTokenSelect={props.onTokenSelect}
                      enableTokenSelect={enableTokenSelect.value}
                      fallback={config => getDesignToken(config) as AliasToken}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    };
  },
});
