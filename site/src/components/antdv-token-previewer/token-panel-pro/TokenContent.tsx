import { CaretRightOutlined, ExpandOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Checkbox,
  Collapse,
  // ConfigProvider,
  Popover,
  Switch,
  Tooltip,
  Typography,
} from 'ant-design-vue';
import type { MutableTheme } from '../interface';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import seed from 'ant-design-vue/es/theme/themes/seed';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import classNames from 'ant-design-vue/es/_util/classNames';

import { PropType, toRefs } from 'vue';
import { defineComponent, watchEffect, computed, watch, ref } from 'vue';
import { debounce } from 'lodash';

import type { ThemeCode } from '../hooks/useControlledTheme';
import { themeMap } from '../hooks/useControlledTheme';
import { CompactTheme, DarkTheme, Light, Pick } from '../icons';

import type { SelectedToken } from '../interface';
import { useInjectLocaleContext } from '../locale';
import type { TokenCategory, TokenGroup } from '../meta/interface';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import ColorPanel from '../ColorPanel';
import IconSwitch from '../IconSwitch';
import InputNumberPlus from './InputNumberPlus';
import TokenDetail from './TokenDetail';
import TokenPreview from './TokenPreview';

const { Panel } = Collapse;

const useStyle = makeStyle('ColorTokenContent', token => ({
  '.token-panel-pro-color': {
    height: '100%',
    display: 'flex',
    '.token-panel-pro-color-seeds': {
      height: '100%',
      flex: 1,
      width: 0,
      borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',

      '.token-panel-pro-color-themes': {
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flex: '0 0 60px',

        '> span': {
          fontSize: token.fontSizeLG,
          fontWeight: token.fontWeightStrong,
        },
      },
    },
    [`.token-panel-pro-token-collapse${token.rootCls}-collapse`]: {
      flex: 1,
      overflow: 'auto',
      [`> ${token.rootCls}-collapse-item-active`]: {
        backgroundColor: '#fff',
        boxShadow:
          '0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05), 0 12px 48px -8px rgba(0,0,0,0.03), inset 0 0 0 2px #1677FF',
        transition: 'box-shadow 0.2s ease-in-out',
        borderRadius: 8,
      },
      [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]:
        {
          paddingBlock: '0 12px',
        },

      '.token-panel-pro-token-collapse-description': {
        color: token.colorTextTertiary,
        marginBottom: 16,
      },

      '.token-panel-pro-token-collapse-subtitle': {
        color: token.colorTextSecondary,
        fontSize: 12,
      },

      '.token-panel-pro-token-collapse-seed-block': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',

        '+ .token-panel-pro-token-collapse-seed-block': {
          marginTop: 8,
        },

        '&-name-cn': {
          fontWeight: token.fontWeightStrong,
          marginInlineEnd: 4,
        },

        '&-name': {
          color: token.colorTextTertiary,
        },

        '&-sample': {
          flex: 'none',

          '&:not(:last-child)': {
            marginInlineEnd: 16,
          },

          '&-theme': {
            color: token.colorTextTertiary,
            marginBottom: 2,
            fontSize: '12px',
            textAlign: 'end',
          },

          '&-card': {
            cursor: 'pointer',
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',

            '&-value': {
              fontFamily: 'Monaco,'.concat(token.fontFamily),
            },
          },
        },
      },

      [`.token-panel-pro-token-collapse-map-collapse${token.rootCls}-collapse`]: {
        borderRadius: 4,
        backgroundColor: '#fff',

        [`> ${token.rootCls}-collapse-item`]: {
          '&:not(:first-child)': {
            [`> ${token.rootCls}-collapse-header`]: {
              [`> ${token.rootCls}-collapse-header-text`]: {
                '.token-panel-pro-token-collapse-map-collapse-preview': {
                  '.token-panel-pro-token-collapse-map-collapse-preview-color': {
                    marginTop: -1,
                  },
                },
              },
            },
          },
          [`> ${token.rootCls}-collapse-header`]: {
            padding: { value: '0 12px 0 16px', _skip_check_: true },

            [`> ${token.rootCls}-collapse-expand-icon`]: {
              alignSelf: 'center',
            },

            [`> ${token.rootCls}-collapse-header-text`]: {
              flex: 1,

              '.token-panel-pro-token-collapse-map-collapse-token': {
                color: token.colorTextSecondary,
                marginInlineStart: 4,
                marginInlineEnd: 8,
              },

              '.token-panel-pro-token-collapse-map-collapse-preview': {
                display: 'flex',
                flex: 'none',
                '.token-panel-pro-token-collapse-map-collapse-preview-color': {
                  height: 56,
                  width: 56,
                  position: 'relative',
                  borderInline: '1px solid #e8e8e8',
                },
                '> *': {
                  marginInlineEnd: 8,
                },
              },
            },
          },

          [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
            padding: '0',
          },
        },
      },
    },

    '.token-panel-pro-token-collapse-map-collapse-count': {
      color: token.colorTextSecondary,
      // display: 'inline-block',
      fontSize: '12px',
      lineHeight: '16px',
      padding: '0 6px',
      backgroundColor: token.colorFillAlter,
      borderRadius: 999,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    '.token-panel-pro-token-pick': {
      transition: 'color 0.3s',
    },

    '.token-panel-pro-token-picked': {
      color: token.colorPrimary,
    },

    [`.token-panel-pro-grouped-map-collapse${token.rootCls}-collapse`]: {
      borderRadius: '4px',
      [`> ${token.rootCls}-collapse-item`]: {
        [`> ${token.rootCls}-collapse-header`]: {
          padding: '6px 12px',
          color: token.colorIcon,
          fontSize: '12px',
          lineHeight: token.lineHeightSM,

          [`> ${token.rootCls}-collapse-header-text`]: {
            fontSize: '12px',
          },

          [`${token.rootCls}-collapse-expand-icon`]: {
            lineHeight: '20px',
            height: '20px',
          },
        },
        [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
          padding: 0,

          [`.token-panel-pro-token-collapse-map-collapse${token.rootCls}-collapse`]: {
            border: 'none',

            [`${token.rootCls}-collapse-item:last-child`]: {
              borderBottom: 'none',
            },
          },
        },
      },
    },
  },
}));

export type SeedTokenProps = {
  theme: MutableTheme;
  tokenName: string;
  disabled?: boolean;
};

const getSeedValue = (config: ThemeConfig, token: string) => {
  // @ts-ignore
  return config.token?.[token] || seed[token] || getDesignToken(config)[token];
};

const seedRange: Record<string, { min: number; max: number }> = {
  borderRadius: {
    min: 0,
    max: 16,
  },
  fontSize: {
    min: 12,
    max: 32,
  },
  sizeStep: {
    min: 0,
    max: 16,
  },
  sizeUnit: {
    min: 0,
    max: 16,
  },
};

const SeedTokenPreview = defineComponent({
  name: 'SeedTokenPreview',
  props: {
    theme: { type: Object as PropType<MutableTheme> },
    tokenName: { type: String },
    disabled: { type: Boolean },
  },
  setup(props) {
    const { theme, tokenName, disabled } = toRefs(props);

    const tokenPath = computed(() => ['token', tokenName.value]);
    const tokenValue = ref(getSeedValue(theme.value.config, tokenName.value));

    const locale = useInjectLocaleContext();

    const debouncedOnChange = debounce((newValue: number | string) => {
      theme.value.onThemeChange?.(
        {
          ...theme.value.config,
          token: {
            ...theme.value.config.token,
            [tokenName.value]: newValue,
          },
        },
        ['token', tokenName.value],
      );
    }, 500);

    const handleChange = (value: any) => {
      tokenValue.value = value;
      debouncedOnChange(value);
    };

    watchEffect(() => {
      tokenValue.value = getSeedValue(theme.value.config, tokenName.value);
    });

    const showReset = computed(() => theme.value.getCanReset?.(tokenPath.value));

    return () => {
      return (
        <div class="token-panel-pro-token-collapse-seed-block-sample">
          <div class="token-panel-pro-token-collapse-seed-block-sample-theme">
            <Typography.Link
              style={{
                fontSize: '12px',
                padding: 0,
                opacity: showReset.value ? 1 : 0,
                pointerEvents: showReset.value ? 'auto' : 'none',
              }}
              onClick={() => theme.value.onReset?.(tokenPath.value)}
            >
              {locale.value.reset}
            </Typography.Link>
          </div>
          {tokenName.value.startsWith('color') && (
            <Popover
              trigger="click"
              placement="bottomRight"
              overlayInnerStyle={{ padding: 0 }}
              v-slots={{
                content: () => (
                  <ColorPanel
                    color={tokenValue.value}
                    onChange={handleChange}
                    style={{ border: 'none' }}
                  />
                ),
              }}
            >
              <div
                class="token-panel-pro-token-collapse-seed-block-sample-card"
                style={{ pointerEvents: disabled.value ? 'none' : 'auto' }}
              >
                <div
                  style={{
                    backgroundColor: tokenValue.value,
                    width: '48px',
                    height: '32px',
                    borderRadius: '4px',
                    marginRight: '14px',
                    boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
                  }}
                />
                <div class="token-panel-pro-token-collapse-seed-block-sample-card-value">
                  {tokenValue.value}
                </div>
              </div>
            </Popover>
          )}
          {['fontSize', 'sizeUnit', 'sizeStep', 'borderRadius'].includes(tokenName.value) && (
            <InputNumberPlus
              value={tokenValue.value}
              onChange={handleChange}
              min={seedRange[tokenName.value].min}
              max={seedRange[tokenName.value].max}
            />
          )}
          {tokenName.value === 'wireframe' && (
            <Switch checked={tokenValue.value} onChange={handleChange} />
          )}
        </div>
      );
    };
  },
});

export type MapTokenCollapseContentProps = {
  mapTokens?: string[];
  theme: MutableTheme;
  selectedTokens?: SelectedToken;
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void;
  type?: string;
};

const MapTokenCollapseContent = defineComponent({
  name: 'MapTokenCollapseContent',
  props: {
    mapTokens: { type: Array as PropType<string[]> },
    theme: { type: Object as PropType<MutableTheme> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    onTokenSelect: {
      type: Function as PropType<(token: string | string[], type: keyof SelectedToken) => void>,
    },
    type: { type: String },
  },
  setup(props) {
    const { mapTokens, theme, selectedTokens, type } = toRefs(props);

    const locale = useInjectLocaleContext();

    return () => {
      return (
        <Collapse class="token-panel-pro-token-collapse-map-collapse">
          {mapTokens.value?.map(mapToken => (
            <Panel
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      width: 0,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: 8,
                    }}
                  >
                    {locale.value._lang === 'zh-CN' && (
                      <span style={{ fontWeight: 500, flex: 'none' }}>
                        {(tokenMeta as any)[mapToken]?.name}
                      </span>
                    )}
                    <span
                      class="token-panel-pro-token-collapse-map-collapse-token"
                      style={{ flex: 'none' }}
                    >
                      {mapToken}
                    </span>
                    <span class="token-panel-pro-token-collapse-map-collapse-count">
                      {(getDesignToken(theme.value.config) as any)[mapToken]}
                    </span>
                  </div>
                  <div class="token-panel-pro-token-collapse-map-collapse-preview">
                    <div class="token-panel-pro-token-collapse-map-collapse-preview-color">
                      <TokenPreview
                        theme={theme.value.config}
                        tokenName={mapToken}
                        type={type.value}
                      />
                    </div>
                  </div>
                  <div
                    style={{ flex: 'none', margin: '4px' }}
                    onClick={e => {
                      e.stopPropagation();
                      props.onTokenSelect(mapToken, 'map');
                    }}
                  >
                    <Pick
                      class={classNames('token-panel-pro-token-pick', {
                        'token-panel-pro-token-picked': (
                          selectedTokens.value as SelectedToken
                        )?.map?.includes(mapToken),
                      })}
                    />
                  </div>
                </div>
              }
              key={mapToken}
            >
              <TokenDetail
                style={{ margin: '8px' }}
                themes={[theme.value]}
                path={['token']}
                tokenName={mapToken}
              />
            </Panel>
          ))}
        </Collapse>
      );
    };
  },
});

export type MapTokenCollapseProps = {
  theme: MutableTheme;
  group: TokenGroup<string>;
  selectedTokens?: SelectedToken;
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void;
  groupFn?: (token: string) => string;
};

const MapTokenCollapse = defineComponent({
  name: 'MapTokenCollapse',
  props: {
    theme: { type: Object as PropType<MutableTheme> },
    group: { type: Object as PropType<TokenGroup<string>> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    onTokenSelect: {
      type: Function as PropType<(token: string | string[], type: keyof SelectedToken) => void>,
    },
    groupFn: { type: Function as PropType<(token: string) => string> },
  },
  setup(props) {
    const { theme, selectedTokens, groupFn, group } = toRefs(props);

    const locale = useInjectLocaleContext();

    const groupedTokens = computed(() => {
      const grouped: Record<string, string[]> = {};
      if (groupFn.value) {
        group.value.mapToken?.forEach(token => {
          const key = groupFn.value(token) ?? 'default';
          grouped[key] = [...(grouped[key] ?? []), token];
        });
      }
      return grouped;
    });

    return () => {
      if (groupFn.value) {
        return (
          <Collapse
            class="token-panel-pro-grouped-map-collapse"
            defaultActiveKey={Object.keys(groupedTokens.value)}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: '12px' }} />
            )}
          >
            {(group.value.mapTokenGroups ?? Object.keys(groupedTokens.value)).map(key => (
              <Panel key={key} header={(locale.value as any)[key] ?? ''}>
                <MapTokenCollapseContent
                  mapTokens={groupedTokens.value[key]}
                  theme={theme.value}
                  selectedTokens={selectedTokens.value}
                  onTokenSelect={props.onTokenSelect}
                  type={group.value.type}
                />
              </Panel>
            ))}
          </Collapse>
        );
      }

      if (group.value.groups) {
        return (
          <Collapse
            class="token-panel-pro-grouped-map-collapse"
            defaultActiveKey={group.value.groups.map(item => item.key)}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: '12px' }} />
            )}
          >
            {group.value.groups.map(item => (
              <Panel key={item.key} header={item.name}>
                <MapTokenCollapseContent
                  mapTokens={item.mapToken}
                  theme={theme.value}
                  selectedTokens={selectedTokens.value}
                  onTokenSelect={props.onTokenSelect}
                  type={item.type}
                />
              </Panel>
            ))}
          </Collapse>
        );
      }

      return (
        <MapTokenCollapseContent
          mapTokens={group.value.mapToken ?? []}
          theme={theme.value}
          selectedTokens={selectedTokens.value}
          onTokenSelect={props.onTokenSelect}
          type={group.value.type}
        />
      );
    };
  },
});

const groupMapToken = (token: string): string => {
  if (token.startsWith('colorFill')) {
    return 'fill';
  }
  if (token.startsWith('colorBorder') || token.startsWith('colorSplit')) {
    return 'border';
  }
  if (token.startsWith('colorBg')) {
    return 'background';
  }
  if (token.startsWith('colorText')) {
    return 'text';
  }
  return '';
};

export type ColorTokenContentProps = {
  category: TokenCategory<string>;
  theme: MutableTheme;
  selectedTokens?: SelectedToken;
  infoFollowPrimary?: boolean;
  activeGroup: string;
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void;
  onInfoFollowPrimaryChange?: (value: boolean) => void;
  onActiveGroupChange: (value: string) => void;
};

const TokenContent = defineComponent({
  name: 'TokenContent',
  inheritAttrs: false,
  props: {
    category: { type: Object as PropType<TokenCategory<string>> },
    theme: { type: Object as PropType<MutableTheme> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    infoFollowPrimary: { type: Boolean },
    activeGroup: { type: String },
    onTokenSelect: {
      type: Function as PropType<(token: string | string[], type: keyof SelectedToken) => void>,
    },
    onInfoFollowPrimaryChange: {
      type: Function as PropType<(value: boolean) => void>,
    },
    onActiveGroupChange: {
      type: Function as PropType<(value: string) => void>,
    },
  },
  emits: ['update:activeGroup'],
  setup(props, { attrs, emit }) {
    const { category, theme, selectedTokens, infoFollowPrimary, activeGroup } = toRefs(props);

    const curActiveGroup = ref('');

    watch(
      activeGroup,
      val => {
        curActiveGroup.value = val;
      },
      { immediate: true },
    );

    watch(curActiveGroup, val => {
      props.onActiveGroupChange?.(val);
      emit('update:activeGroup', val);
    });

    const [wrapSSR, hashId] = useStyle();

    const grouped = ref<boolean>(true);
    const locale = useInjectLocaleContext();

    const switchAlgorithm = (themeStr: 'dark' | 'compact') => () => {
      let newAlgorithm = theme.value.config.algorithm;
      if (!newAlgorithm) {
        newAlgorithm = themeMap[themeStr];
      } else if (Array.isArray(newAlgorithm)) {
        newAlgorithm = newAlgorithm.includes(themeMap[themeStr])
          ? newAlgorithm.filter(item => item !== themeMap[themeStr])
          : [...newAlgorithm, themeMap[themeStr]];
      } else {
        newAlgorithm =
          newAlgorithm === themeMap[themeStr] ? undefined : [newAlgorithm, themeMap[themeStr]];
      }
      theme.value.onThemeChange?.({ ...theme.value.config, algorithm: newAlgorithm }, [
        'config',
        'algorithm',
      ]);
    };

    const isLeftChecked = (str: ThemeCode) => {
      if (!theme.value.config.algorithm) {
        return true;
      }
      return Array.isArray(theme.value.config.algorithm)
        ? !theme.value.config.algorithm.includes(themeMap[str])
        : theme.value.config.algorithm !== themeMap[str];
    };

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, attrs.class, 'token-panel-pro-color')}>
          <div class="token-panel-pro-color-seeds">
            <div class="token-panel-pro-color-themes">
              <span style={{ marginRight: '12px' }}>
                {locale.value._lang === 'zh-CN' ? category.value.name : category.value.nameEn}
              </span>
              {category.value.nameEn === 'Color' && (
                <IconSwitch
                  onChange={switchAlgorithm('dark')}
                  leftChecked={isLeftChecked('dark')}
                  v-slots={{
                    leftIcon: () => <Light />,
                    rightIcon: () => <DarkTheme />,
                  }}
                  style={{ marginLeft: 'auto' }}
                />
              )}

              {category.value.nameEn === 'Size' && (
                <IconSwitch
                  onChange={switchAlgorithm('compact')}
                  leftChecked={isLeftChecked('compact')}
                  v-slots={{
                    leftIcon: () => <ExpandOutlined />,
                    rightIcon: () => <CompactTheme />,
                  }}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </div>
            {/* <ConfigProvider
              theme={{
                token: {
                  colorBorder: '#f0f0f0',
                },
              }}
            > */}
            <Collapse
              class="token-panel-pro-token-collapse"
              expandIconPosition={'end'}
              ghost
              accordion
              v-model={[curActiveGroup.value, 'activeKey']}
              v-slots={{
                expandIcon: ({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: '12px' }} />
                ),
              }}
            >
              {category.value.groups.map((group, index) => {
                return (
                  <Panel
                    header={
                      <span style={{ fontWeight: 500 }}>
                        {locale.value._lang === 'zh-CN' ? group.name : group.nameEn}
                      </span>
                    }
                    key={group.key}
                  >
                    <div>
                      <div class="token-panel-pro-token-collapse-description">
                        {locale.value._lang === 'zh-CN' ? group.desc : group.descEn}
                      </div>
                      {group.seedToken?.map(seedToken => (
                        <div key={seedToken} class="token-panel-pro-token-collapse-seed-block">
                          <div style={{ marginRight: 'auto' }}>
                            <div class="token-panel-pro-token-collapse-subtitle">
                              <span style={{ fontSize: '12px' }}>Seed Token</span>
                              <Tooltip
                                placement="topLeft"
                                arrowPointAtCenter
                                title={
                                  locale.value._lang === 'zh-CN'
                                    ? (tokenMeta as any)[seedToken]?.desc
                                    : (tokenMeta as any)[seedToken]?.descEn
                                }
                              >
                                <QuestionCircleOutlined
                                  style={{ fontSize: '14px', marginLeft: '8px' }}
                                />
                              </Tooltip>
                            </div>
                            <div>
                              <span class="token-panel-pro-token-collapse-seed-block-name-cn">
                                {locale.value._lang === 'zh-CN'
                                  ? (tokenMeta as any)[seedToken]?.name
                                  : (tokenMeta as any)[seedToken]?.nameEn}
                              </span>
                              {seedToken === 'colorInfo' && (
                                <Checkbox
                                  style={{ marginLeft: '12px' }}
                                  checked={infoFollowPrimary.value}
                                  onChange={e => props.onInfoFollowPrimaryChange(e.target.checked)}
                                >
                                  {locale.value.followPrimary}
                                </Checkbox>
                              )}
                            </div>
                          </div>
                          <SeedTokenPreview
                            theme={theme.value}
                            tokenName={seedToken}
                            disabled={seedToken === 'colorInfo' && infoFollowPrimary.value}
                          />
                        </div>
                      ))}
                      {(group.mapToken || group.groups) && (
                        <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                          <div
                            class="token-panel-pro-token-collapse-subtitle"
                            style={{
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span>Map Token</span>
                            <Tooltip
                              placement="topLeft"
                              arrowPointAtCenter
                              title="梯度变量（Map Token） 是基于 Seed 派生的梯度变量，我们精心设计的梯度变量模型具有良好的视觉设计语义，可在亮暗色模式切换时保证视觉梯度的一致性。"
                            >
                              <QuestionCircleOutlined
                                style={{ fontSize: '14px', marginLeft: '8px' }}
                              />
                            </Tooltip>
                            {group.mapTokenGroups && (
                              <div
                                style={{
                                  marginLeft: 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <label style={{ marginRight: '4px' }}>
                                  {locale.value.groupView}
                                </label>
                                <Switch
                                  checked={grouped.value}
                                  onChange={v => (grouped.value = v as boolean)}
                                  size="small"
                                />
                              </div>
                            )}
                          </div>
                          <MapTokenCollapse
                            group={group}
                            theme={theme.value}
                            selectedTokens={selectedTokens.value}
                            onTokenSelect={props.onTokenSelect}
                            groupFn={
                              group.mapTokenGroups && grouped.value ? groupMapToken : undefined
                            }
                          />
                        </div>
                      )}
                      {index < category.value.groups.length - 1 && (
                        <Button
                          type="primary"
                          style={{ borderRadius: '4px', marginBottom: '12px' }}
                          onClick={() => {
                            curActiveGroup.value = category.value.groups[index + 1]?.key;
                          }}
                        >
                          {locale.value.next}
                        </Button>
                      )}
                    </div>
                  </Panel>
                );
              })}
            </Collapse>
            {/* </ConfigProvider> */}
          </div>
        </div>,
      );
    };
  },
});

export default TokenContent;
