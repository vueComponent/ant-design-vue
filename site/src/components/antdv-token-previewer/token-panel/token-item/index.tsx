import { CaretRightOutlined } from '@ant-design/icons-vue';
import { Collapse, Space } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { PropType, CSSProperties } from 'vue';
import { defineComponent, toRefs, watch, computed, ref } from 'vue';
import ColorPreview from '../../ColorPreview';
import { Pick } from '../../icons';
import type { MutableTheme, TokenValue } from '../../interface';
import TokenInput from '../../TokenInput';
import getValueByPath from '../../utils/getValueByPath';
import isColor from '../../utils/isColor';
import makeStyle from '../../utils/makeStyle';
import { getRelatedComponents } from '../../utils/statistic';

const { Panel } = Collapse;

export interface TokenItemProps {
  tokenName: string;
  tokenPath: string[];
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  onTokenChange?: (theme: MutableTheme, tokenName: string, value: TokenValue) => void;
  themes: MutableTheme[];
  selectedTokens?: string[];
  onTokenSelect?: (token: string) => void;
  enableTokenSelect?: boolean;
  hideUsageCount?: boolean;
  fallback?: (config: ThemeConfig) => Record<string, TokenValue>;
}

const AdditionInfo = defineComponent({
  name: 'AdditionInfo',
  props: {
    info: { type: [String, Number] },
    visible: { type: Boolean },
    tokenName: { type: String },
    dark: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { info, visible, dark } = toRefs(props);

    return () => {
      if (typeof info.value === 'string' && isColor(info.value)) {
        return (
          <ColorPreview
            dark={dark.value}
            color={String(info.value)}
            style={{ display: visible.value ? 'block' : 'none', ...(attrs.style as CSSProperties) }}
          />
        );
      }

      if (info.value.toString().length < 6 && String(info.value) !== '') {
        return (
          <div
            {...attrs}
            style={{
              height: '20px',
              overflow: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.04)',
              borderRadius: '8px',
              display: visible.value ? 'block' : 'none',
              padding: '0 6px',
              lineHeight: '20px',
              ...(attrs.style as CSSProperties),
            }}
          >
            {info.value}
          </div>
        );
      }

      return null;
    };
  },
});

const ShowUsageButton = ({
  selected,
  toggleSelected,
}: {
  selected: boolean;
  toggleSelected: (v: boolean) => void;
}) => {
  return (
    <span
      style={{ marginInlineStart: '12px', verticalAlign: 'middle', cursor: 'pointer' }}
      onClick={() => toggleSelected(!selected)}
    >
      <Pick
        style={{
          color: selected ? '#1890ff' : undefined,
          fontSize: '16px',
          transition: 'color 0.3s',
        }}
      />
    </span>
  );
};

const useStyle = makeStyle('TokenItem', token => ({
  [`${token.rootCls}-collapse.previewer-token-item-collapse`]: {
    [`.previewer-token-item${token.rootCls}-collapse-item`]: {
      transition: `background-color ${token.motionDurationSlow}`,
      borderRadius: { _skip_check_: true, value: `4px !important` },

      [`&:not(${token.rootCls}-collapse-item-active):hover`]: {
        backgroundColor: '#f5f5f5',
      },

      [`> ${token.rootCls}-collapse-header`]: {
        padding: '12px 8px',
      },

      [`${token.rootCls}-collapse-header-text`]: {
        flex: 1,
        width: 0,
      },
      [`${token.rootCls}-collapse-content-box`]: {
        padding: '0 4px',
      },
      [`${token.rootCls}-collapse-expand-icon`]: {
        paddingInlineEnd: `${token.paddingXXS}px !important`,
      },
      '.previewer-token-count': {
        height: 16,
        fontSize: token.fontSizeSM,
        lineHeight: '16px',
        borderRadius: 100,
        paddingInline: token.paddingXXS * 1.5,
        color: token.colorTextSecondary,
        backgroundColor: token.colorFillAlter,
      },

      '.previewer-token-item-name': {
        transition: 'color 0.3s',
      },

      '.previewer-token-item-highlighted.previewer-token-item-name': {
        color: `${token.colorPrimary} !important`,
      },

      '&:hover .previewer-token-preview': {
        '> .previewer-color-preview:not(:last-child)': {
          transform: 'translateX(-100%)',
          marginInlineEnd: 4,
        },
      },

      '.previewer-token-preview': {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',

        '> .previewer-color-preview': {
          position: 'absolute',
          insetInlineEnd: 0,
          top: 0,
          bottom: 0,
          margin: 'auto',
        },

        '> .previewer-color-preview:not(:last-child)': {
          transform: 'translateX(-50%)',
          marginInlineEnd: 0,
          transition: 'transform 0.3s, margin-right 0.3s',
        },

        '> *:not(:last-child)': {
          marginInlineEnd: 4,
        },
      },
    },
  },
}));

export const getTokenItemId = (token: string) => `previewer-token-panel-item-${token}`;

export default defineComponent({
  name: 'TokenItem',
  props: {
    tokenName: { type: String },
    tokenPath: { type: Array as PropType<string[]> },
    active: { type: Boolean },
    themes: { type: Array as PropType<MutableTheme[]> },
    selectedTokens: { type: Array as PropType<string[]> },
    enableTokenSelect: { type: Boolean },
    hideUsageCount: { type: Boolean },
    onActiveChange: { type: Function as PropType<(active: boolean) => void> },
    onTokenChange: {
      type: Function as PropType<
        (theme: MutableTheme, tokenName: string, value: TokenValue) => void
      >,
    },
    onTokenSelect: { type: Function as PropType<(token: string) => void> },
    fallback: { type: Function as PropType<(config: ThemeConfig) => Record<string, TokenValue>> },
  },
  setup(props, { attrs }) {
    const {
      tokenName,
      active,
      tokenPath,
      selectedTokens,
      themes,
      enableTokenSelect,
      hideUsageCount,
    } = toRefs(props);

    const infoVisible = ref(false);
    const [wrapSSR, hashId] = useStyle();

    watch(
      active,
      val => {
        if (val) {
          infoVisible.value = true;
        }
      },
      { immediate: true },
    );

    const handleTokenChange = (theme: MutableTheme, value: TokenValue) => {
      props.onTokenChange?.(theme, tokenName.value, value);
    };

    const count = computed(() => getRelatedComponents(tokenName.value).length);

    return () => {
      return wrapSSR(
        <div {...attrs} onMouseenter={() => props.onActiveChange?.(false)}>
          <Collapse
            collapsible="header"
            ghost
            onChange={key => (infoVisible.value = Array.isArray(key) ? key.length > 0 : !!key)}
            class={classNames('previewer-token-item-collapse', hashId.value)}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                style={{ fontSize: '12px', cursor: 'pointer' }}
              />
            )}
            activeKey={infoVisible.value ? tokenName.value : undefined}
          >
            <Panel
              key={tokenName.value}
              class="previewer-token-item"
              header={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  id={getTokenItemId(tokenName.value)}
                >
                  <span
                    style={{
                      flex: 1,
                      width: 0,
                      display: 'flex',
                      overflow: 'hidden',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      title={tokenName.value}
                      class={classNames('previewer-token-item-name', {
                        'previewer-token-item-highlighted': active.value,
                      })}
                      style={{
                        marginInlineEnd: '5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tokenName.value}
                    </span>
                    {!hideUsageCount.value && (
                      <span class="previewer-token-count">{count.value}</span>
                    )}
                  </span>
                  {!infoVisible.value && (
                    <div
                      class="previewer-token-preview"
                      style={{
                        minWidth: themes.value.length * 20 + (themes.value.length - 1) * 4,
                      }}
                    >
                      {themes.value.map(({ config, key }, index) => {
                        return (
                          <AdditionInfo
                            key={key}
                            dark={key === 'dark'}
                            tokenName={tokenName.value}
                            info={
                              getValueByPath(config, [...tokenPath.value, tokenName.value]) ??
                              props.fallback?.(config)[tokenName.value] ??
                              ''
                            }
                            visible={!infoVisible.value}
                            style={{
                              zIndex: 10 - index,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              }
              extra={
                enableTokenSelect.value ? (
                  <ShowUsageButton
                    selected={!!selectedTokens.value?.includes(tokenName.value)}
                    toggleSelected={() => {
                      props.onTokenSelect?.(tokenName.value);
                    }}
                  />
                ) : undefined
              }
            >
              <Space
                direction="vertical"
                style={{
                  background: '#fafafa',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '100%',
                }}
              >
                {themes.value.map(theme => {
                  return (
                    <div key={theme.key}>
                      <TokenInput
                        hideTheme={themes.value.length === 1}
                        theme={theme}
                        onChange={value => handleTokenChange(theme, value)}
                        value={
                          getValueByPath(theme.config, [...tokenPath.value, tokenName.value]) ??
                          props.fallback?.(theme.config)[tokenName.value]
                        }
                      />
                    </div>
                  );
                })}
              </Space>
            </Panel>
          </Collapse>
        </div>,
      );
    };
  },
});
