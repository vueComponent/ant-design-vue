import {
  CaretRightOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  ShrinkOutlined,
} from '@ant-design/icons-vue';
import { Button, Collapse, Empty, Tooltip } from 'ant-design-vue';
import type { MutableTheme, AliasToken, SelectedToken } from '../interface';
import classNames from 'ant-design-vue/es/_util/classNames';
import useMergedState from 'ant-design-vue/es/_util/hooks/useMergedState';
import { defineComponent, toRefs, computed } from 'vue';
import type { PropType, Ref } from 'vue';
import { Pick } from '../icons';
import { mapRelatedAlias, seedRelatedAlias } from '../meta/TokenRelation';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';
import TokenDetail from './TokenDetail';

const { Panel } = Collapse;

const useStyle = makeStyle('TokenPanelProAlias', token => ({
  '.token-panel-pro-color-alias': {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 45,
    borderTop: `1px solid ${token.colorSplit}`,

    '.token-panel-pro-color-alias-title': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      flex: '0 0 60px',

      '&-text': {
        fontSize: token.fontSizeLG,
        fontWeight: token.fontWeightStrong,
      },
    },

    '.token-panel-pro-color-alias-description': {
      color: token.colorTextTertiary,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeightSM,
      padding: '0 16px 12px',
    },

    [`.token-panel-pro-alias-collapse${token.rootCls}-collapse`]: {
      [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]:
        {
          paddingBlock: '0',
        },

      [`> ${token.rootCls}-collapse-item`]: {
        [`> ${token.rootCls}-collapse-header`]: {
          alignItems: 'center',
          padding: '8px 16px',
          [`> ${token.rootCls}-collapse-header-text`]: {
            flex: 1,

            '.token-panel-pro-token-collapse-map-collapse-count': {
              color: token.colorTextSecondary,
              display: 'inline-block',
              fontSize: 12,
              lineHeight: '16px',
              padding: '0 6px',
              backgroundColor: token.colorFillAlter,
              borderRadius: 999,
            },
          },

          '.token-panel-pro-token-picked': {
            color: token.colorPrimary,
          },
        },
      },
    },

    '.token-panel-pro-color-alias-expand': {
      height: '100%',
      width: 20,
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&:hover': {
        '.token-panel-pro-color-alias-expand-handler': {
          opacity: 1,
        },
      },

      '.token-panel-pro-color-alias-expand-handler': {
        height: 100,
        width: 16,
        borderRadius: 999,
        border: `1px solid ${token.colorSplit}`,
        backgroundColor: '#fff',
        margin: 'auto',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'box-shadow 0.2s',

        '&:hover': {
          boxShadow: token.boxShadow,
        },
      },
    },
  },
}));

export type AliasPanelProps = {
  theme: MutableTheme;
  activeSeeds?: string[];
  selectedTokens?: SelectedToken;
  onTokenSelect?: (token: string, type: keyof SelectedToken) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: string;
};

const AliasPanel = defineComponent({
  name: 'AliasPanel',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<MutableTheme> },
    activeSeeds: { type: Array as PropType<string[]> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    onTokenSelect: {
      type: Function as PropType<(token: string, type: keyof SelectedToken) => void>,
    },
    open: { type: Boolean },
    onOpenChange: { type: Function as PropType<(open: boolean) => void> },
    description: { type: String },
  },
  setup(props, { attrs }) {
    const { activeSeeds, theme, selectedTokens, open: customOpen, description } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const [open, setOpen] = useMergedState(customOpen.value ?? true, {
      value: customOpen,
      onChange: props.onOpenChange,
    });

    const shownAlias = computed(() =>
      (selectedTokens as Ref<SelectedToken>).value?.map?.length
        ? Array.from(
            new Set(
              (selectedTokens as Ref<SelectedToken>).value?.map.reduce<string[]>((result, map) => {
                return result.concat(...((mapRelatedAlias as any)[map] ?? []));
              }, []),
            ),
          )
        : activeSeeds.value?.reduce<(keyof AliasToken)[]>(
            (result, item) => result.concat((seedRelatedAlias as any)[item] ?? []),
            [],
          ),
    );

    return () => {
      return wrapSSR(
        <div
          {...attrs}
          class={classNames(attrs.class, 'token-panel-pro-color-alias', hashId.value)}
        >
          {open.value ? (
            <>
              <div class="token-panel-pro-color-alias-title">
                <span class="token-panel-pro-color-alias-title-text">Alias Token</span>
                <Tooltip
                  placement="topLeft"
                  arrowPointAtCenter
                  title="别名变量（Alias Token）是 Map Token 的别名。Alias Token 用于批量控制某些共性组件的样式。"
                >
                  <QuestionCircleOutlined style={{ fontSize: '14px', marginLeft: '4px' }} />
                </Tooltip>
                <Button
                  type="text"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => setOpen(false)}
                  v-slots={{
                    icon: () => <ShrinkOutlined />,
                  }}
                />
              </div>
              {description.value && (
                <div class="token-panel-pro-color-alias-description">{description.value}</div>
              )}
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Collapse
                  class="token-panel-pro-alias-collapse"
                  ghost
                  v-slots={{
                    expandIcon: ({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '12px' }} />
                    ),
                  }}
                >
                  {shownAlias.value?.map(aliasToken => (
                    <Panel
                      key={aliasToken}
                      v-slots={{
                        header: () => (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>{aliasToken}</span>
                            <span class="token-panel-pro-token-collapse-map-collapse-count">
                              {getRelatedComponents(aliasToken).length}
                            </span>
                            <div
                              style={{ padding: '4px', marginLeft: 'auto' }}
                              onClick={e => {
                                e.stopPropagation();
                                props.onTokenSelect?.(aliasToken, 'alias');
                              }}
                            >
                              <Pick
                                class={classNames('token-panel-pro-token-pick', {
                                  'token-panel-pro-token-picked': (
                                    selectedTokens as Ref<SelectedToken>
                                  ).value?.alias?.includes(aliasToken),
                                })}
                              />
                            </div>
                          </div>
                        ),
                      }}
                    >
                      <TokenDetail
                        style={{ paddingBottom: '10px' }}
                        themes={[theme.value]}
                        path={['token']}
                        tokenName={aliasToken as keyof AliasToken}
                      />
                    </Panel>
                  ))}
                </Collapse>
                {!shownAlias.value?.length && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无相关 Alias Token" />
                )}
              </div>
            </>
          ) : (
            <div class="token-panel-pro-color-alias-expand">
              <div class="token-panel-pro-color-alias-expand-handler" onClick={() => setOpen(true)}>
                <RightOutlined style={{ fontSize: '12px' }} />
              </div>
            </div>
          )}
        </div>,
      );
    };
  },
});

export default AliasPanel;
