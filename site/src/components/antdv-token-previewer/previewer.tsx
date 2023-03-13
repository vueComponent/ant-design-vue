import { Button, Layout, message, theme as antdTheme } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import classNames from 'ant-design-vue/es/_util/classNames';
import { PropType } from 'vue';
import { defineComponent, toRefs, watchEffect, computed, ref } from 'vue';
import ComponentPanel from './component-panel';
import type { FilterMode } from './FilterPanel';
import FilterPanel from './FilterPanel';
import { Arrow, CompactTheme, DarkTheme } from './icons';
import type { MutableTheme, PreviewerProps, Theme } from './interface';
import type { ThemeSelectProps } from './ThemeSelect';
import ThemeSelect from './ThemeSelect';
import type { TokenPanelRef } from './token-panel';
import TokenPanel from './token-panel';
import type { TokenType } from './utils/classifyToken';
import makeStyle from './utils/makeStyle';

const { darkAlgorithm } = antdTheme;

const { Header, Sider, Content } = Layout;
const SIDER_WIDTH = 340;

const useStyle = makeStyle('layout', token => ({
  [`.previewer-layout${token.rootCls}-layout`]: {
    [`${token.rootCls}-layout-header`]: {
      backgroundColor: 'white !important',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      paddingInline: `${token.paddingLG}px !important`,
    },

    [`${token.rootCls}-layout-sider`]: {
      padding: 0,
      borderInlineEnd: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      transition: `all ${token.motionDurationSlow}`,
      overflow: 'visible !important',

      [`${token.rootCls}-btn${token.rootCls}-btn-circle.previewer-sider-collapse-btn`]: {
        position: 'absolute',
        transform: 'translateX(50%)',
        border: 'none',
        boxShadow:
          '0 2px 8px -2px rgba(0,0,0,0.05), 0 1px 4px -1px rgba(25,15,15,0.07), 0 0 1px 0 rgba(0,0,0,0.08)',
        marginTop: token.margin,
        insetInlineEnd: 0,
        color: 'rgba(0,0,0,0.25)',

        '&:hover': {
          color: 'rgba(0,0,0,0.45)',
          boxShadow:
            '0 2px 8px -2px rgba(0,0,0,0.18), 0 1px 4px -1px rgba(25,15,15,0.18), 0 0 1px 0 rgba(0,0,0,0.18)',
        },

        '.previewer-sider-collapse-btn-icon': {
          fontSize: 16,
          marginTop: 4,
          transition: 'transform 0.3s',
        },

        '&-collapsed': {
          borderRadius: { _skip_check_: true, value: '0 100px 100px 0' },
          transform: 'translateX(90%)',
          '.previewer-sider-collapse-btn-icon': {
            transform: 'rotate(180deg)',
          },
        },
      },

      '.previewer-sider-handler': {
        position: 'absolute',
        insetInlineEnd: 0,
        height: '100%',
        width: 8,
        transform: 'translateX(50%)',
        cursor: 'ew-resize',
        opacity: 0,
        backgroundColor: 'transparent',
      },
    },
  },
}));

const Previewer = defineComponent({
  name: 'Previewer',
  inheritAttrs: false,
  props: {
    onSave: { type: Function as PropType<(themeConfig: ThemeConfig) => void> },
    showTheme: { type: Boolean },
    theme: { type: Object as PropType<Theme> },
    onThemeChange: { type: Function as PropType<(config: ThemeConfig) => void> },
  },
  setup(props, { attrs }) {
    const { showTheme, theme } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const selectedTokens = ref<string[]>([]);
    const siderVisible = ref<boolean>(true);
    const siderWidth = ref<number>(SIDER_WIDTH);
    const filterMode = ref<FilterMode>('filter');
    const filterTypes = ref<TokenType[]>([]);

    const tokenPanelRef = ref<TokenPanelRef>(null);
    const dragRef = ref(false);
    const siderRef = ref<HTMLDivElement>(null);

    const defaultThemes = computed<ThemeSelectProps['themes']>(() => [
      {
        name: '默认主题',
        key: 'default',
        config: {},
        fixed: true,
      },
      {
        name: '暗色主题',
        key: 'dark',
        config: {
          algorithm: darkAlgorithm,
        },
        icon: <DarkTheme style={{ fontSize: '16px' }} />,
        closable: true,
      },
      {
        name: '紧凑主题',
        key: 'compact',
        config: {},
        icon: <CompactTheme style={{ fontSize: '16px' }} />,
        closable: true,
      },
    ]);

    const themes = ref<ThemeSelectProps['themes']>(
      theme.value
        ? [
            {
              ...theme.value,
              fixed: true,
            },
          ]
        : defaultThemes.value,
    );

    const shownThemes = ref<string[]>(
      showTheme.value && !theme.value ? ['default', 'dark'] : [themes.value[0].key],
    );
    const enabledThemes = ref<string[]>(
      showTheme.value && !theme.value ? ['default', 'dark'] : [themes.value[0].key],
    );

    watchEffect(() => {
      themes.value = theme.value
        ? [
            {
              ...theme.value,
              fixed: true,
            },
          ]
        : defaultThemes.value;
      shownThemes.value = theme.value ? [theme.value.key] : shownThemes.value;
      enabledThemes.value = theme.value ? [theme.value.key] : enabledThemes.value;
    });

    watchEffect(() => {
      const handleMouseUp = () => {
        dragRef.value = false;
        document.body.style.cursor = '';
        if (siderRef.value) {
          siderRef.value.style.transition = 'all 0.3s';
        }
      };
      const handleMouseMove = (e: MouseEvent) => {
        if (dragRef.value) {
          e.preventDefault();
          siderWidth.value = e.clientX > SIDER_WIDTH ? e.clientX : SIDER_WIDTH;
        }
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    });

    const handleTokenClick = (tokenName: string) => {
      tokenPanelRef.value?.scrollToToken(tokenName);
    };

    const mutableThemes = computed(() =>
      enabledThemes.value.map<MutableTheme>(item => {
        const themeEntity = themes.value.find(themeItem => themeItem.key === item)!;
        return {
          name: themeEntity.name,
          key: themeEntity.key,
          config: themeEntity.config,
          onThemeChange: newTheme => {
            if (themeEntity.key === theme.value?.key) {
              props.onThemeChange?.(newTheme);
            } else {
              themes.value = themes.value.map(themeItem =>
                themeItem.key === themeEntity.key
                  ? {
                      ...themeItem,
                      config: newTheme,
                    }
                  : themeItem,
              );
            }
          },
        };
      }),
    );

    const componentPanel = computed(() => (
      <ComponentPanel
        filterMode={filterMode.value}
        selectedTokens={selectedTokens.value}
        themes={mutableThemes.value}
        onTokenClick={handleTokenClick}
        style={{ flex: 1, height: 0, marginTop: '12px' }}
      />
    ));

    return () => {
      return wrapSSR(
        <Layout {...attrs} class={classNames('previewer-layout', hashId.value, attrs.class)}>
          <Header class="previewer-header">
            <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '16px' }}>
              主题预览器
            </span>
            {showTheme.value && (
              <div>
                <ThemeSelect
                  showAddTheme
                  enabledThemes={enabledThemes.value}
                  shownThemes={shownThemes.value}
                  themes={themes.value}
                  onEnabledThemeChange={value => {
                    if (value.length > 2) {
                      message.warning({
                        content: '最多同时展示两个主题',
                      });
                      return;
                    }
                    enabledThemes.value = value;
                  }}
                  onShownThemeChange={(value, selectTheme, { type }) => {
                    if (type === 'select' && enabledThemes.value.length < 2) {
                      enabledThemes.value = [...enabledThemes.value, selectTheme];
                    }
                    shownThemes.value = value;
                  }}
                />
              </div>
            )}
            <Button
              type="primary"
              style={{ marginLeft: 'auto' }}
              onClick={() => props.onSave?.(themes.value[0].config)}
            >
              保存
            </Button>
          </Header>
          <Layout
            style={{
              height: 'calc(100vh - 64px)',
            }}
          >
            <Sider
              style={{
                backgroundColor: 'white',
                height: '100%',
                overflow: 'auto',
                flex: `0 0 ${siderWidth.value}px`,
                willChange: 'auto',
              }}
              width={siderVisible.value ? siderWidth.value : 0}
              ref={siderRef}
            >
              <div
                class="previewer-sider-handler"
                onMousedown={() => {
                  dragRef.value = true;
                  document.body.style.cursor = 'ew-resize';
                  if (siderRef.value) {
                    siderRef.value.style.transition = 'none';
                  }
                }}
              />
              <Button
                onClick={() => (siderVisible.value = !siderVisible.value)}
                class={classNames(
                  'previewer-sider-collapse-btn',
                  !siderVisible.value && 'previewer-sider-collapse-btn-collapsed',
                )}
                size="small"
                icon={
                  <Arrow
                    rotate={siderVisible.value ? 0 : 180}
                    class="previewer-sider-collapse-btn-icon"
                  />
                }
                shape="circle"
              />
              <TokenPanel
                ref={tokenPanelRef}
                filterTypes={filterTypes.value}
                onFilterTypesChange={types => (filterTypes.value = types)}
                themes={mutableThemes.value}
                selectedTokens={selectedTokens.value}
                enableTokenSelect
                onTokenSelect={tokenName =>
                  (selectedTokens.value = selectedTokens.value.includes(tokenName)
                    ? selectedTokens.value.filter(item => item !== tokenName)
                    : [...selectedTokens.value, tokenName])
                }
              />
            </Sider>
            <Content
              style={{
                padding: '16px 20px 28px 24px',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <FilterPanel
                selectedTokens={selectedTokens.value}
                onSelectedTokensChange={tokens => (selectedTokens.value = tokens)}
                filterMode={filterMode.value}
                onFilterModeChange={mode => (filterMode.value = mode)}
                onTokenClick={handleTokenClick}
              />
              {componentPanel.value}
            </Content>
          </Layout>
        </Layout>,
      );
    };
  },
});

export { PreviewerProps };

export default Previewer;
