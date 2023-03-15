import type { PropType } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';
import { BuildOutlined, CarOutlined } from '@ant-design/icons-vue';
import { ConfigProvider, Drawer, Empty, Tag, theme as antdTheme, Tooltip } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import ComponentDemos from '../component-demos';
import type { AliasToken, ComponentDemo, MutableTheme, TokenName, TokenValue } from '../interface';
import { useInjectLocaleContext } from '../locale';
import TokenCard from '../token-panel/token-card';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import { getComponentToken } from '../utils/statistic';
import ComponentCard from './ComponentCard';

const { defaultAlgorithm } = antdTheme;

const useStyle = makeStyle('ComponentTokenDrawer', token => ({
  '.previewer-component-token-drawer': {
    [`&${token.rootCls}-drawer ${token.rootCls}-drawer-body`]: {
      padding: '0 !important',
    },

    '.previewer-component-drawer-subtitle': {
      fontWeight: token.fontWeightStrong,
      marginBottom: token.marginSM,
      marginInlineStart: token.marginXS,
      color: token.colorText,
    },

    '.previewer-component-token-drawer-theme': {
      fontWeight: 'normal',
      marginInlineStart: 8,
      borderRadius: 4,
      backgroundColor: token.colorInfoBg,
      color: token.colorPrimary,
      borderColor: token.colorInfoBg,
    },
  },
}));

export type ComponentFullDemosProps = {
  demos: ComponentDemo[];
};

const useComponentFullDemosStyle = makeStyle('ComponentFullDemos', token => ({
  '.previewer-component-full-demos': {
    flex: 1,
    overflow: 'auto',
    padding: 24,
    backgroundColor: token.colorBgLayout,
    '> *:not(:last-child)': {
      marginBottom: 12,
    },
  },
}));

const ComponentFullDemos = defineComponent({
  name: 'ComponentFullDemos',
  inheritAttrs: false,
  props: {
    demos: { type: Array as PropType<ComponentDemo[]> },
  },
  setup(props, { attrs }) {
    const { demos } = toRefs(props);
    const [, hashId] = useComponentFullDemosStyle();
    const locale = useInjectLocaleContext();

    return () => {
      return (
        <div
          {...attrs}
          class={classNames('previewer-component-full-demos', hashId.value, attrs.class)}
        >
          {demos.value?.map(demo => (
            <ComponentCard
              key={demo.key}
              title={
                <Tooltip title={demo.tokens?.join(', ')}>
                  <span>
                    {locale.value.demo.relatedTokens}: {demo.tokens?.join(', ')}
                    {(demo.tokens?.length || 0) > 2 ? '...' : ''}
                  </span>
                </Tooltip>
              }
            >
              {demo.demo}
            </ComponentCard>
          ))}
        </div>
      );
    };
  },
});

export type ComponentTokenDrawerProps = {
  open?: boolean;
  component?: string;
  onClose?: () => void;
  theme: MutableTheme;
  onTokenClick?: (token: TokenName) => void;
};

const ComponentTokenDrawer = defineComponent({
  name: 'ComponentTokenDrawer',
  inheritAttrs: false,
  props: {
    open: { type: Boolean },
    component: { type: String, default: 'Button' },
    onClose: { type: Function },
    theme: { type: Object as PropType<MutableTheme> },
    onTokenClick: { type: Function as PropType<(token: TokenName) => void> },
  },
  setup(props) {
    const { open, component, theme } = toRefs(props);

    const [, hashId] = useStyle();

    const componentToken = computed(
      () =>
        getComponentToken(component.value) || {
          global: [],
        },
    );

    const componentTokenData = computed(() => Object.keys(componentToken.value.component ?? {}));

    const aliasTokenData = computed(() => {
      return componentToken.value.global.slice().sort();
    });

    const handleComponentTokenChange = (token: string, value: TokenValue) => {
      theme.value.onThemeChange?.(
        {
          ...theme.value.config,
          components: {
            ...theme.value.config.components,
            [component.value]: {
              ...(theme.value.config.components as any)?.[component.value],
              [token]: value,
            },
          },
        },
        ['components', component.value, token],
      );
    };

    return () => {
      return (
        <Drawer
          v-model={[open.value, 'open']}
          v-slots={{
            title: () => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{`${component.value} 组件 Token`}</span>
                <Tag class="previewer-component-token-drawer-theme">{theme.value.name}</Tag>
              </div>
            ),
          }}
          onClose={props.onClose as any}
          width={1200}
          class={classNames('previewer-component-token-drawer', hashId.value)}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <ConfigProvider theme={theme.value.config}>
              <ConfigProvider theme={theme.value.config}>
                <ComponentFullDemos demos={ComponentDemos[component.value]} />
              </ConfigProvider>
            </ConfigProvider>
            <div
              style={{ flex: '0 0 400px', overflow: 'auto', overflowX: 'hidden', padding: '24px' }}
            >
              <div class="previewer-component-drawer-subtitle">Related Tokens / 相关 token</div>
              <TokenCard
                icon={<BuildOutlined />}
                hideUsageCount
                defaultOpen
                title="Component Token"
                tokenArr={componentTokenData.value}
                tokenPath={['components', component.value]}
                themes={[theme.value]}
                fallback={() => componentToken.value.component}
                onTokenChange={(_, tokenName, value) =>
                  handleComponentTokenChange(tokenName, value)
                }
                placeholder={
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无相关 Component Token"
                    style={{
                      marginBlock: 0,
                      paddingBlock: '32px',
                    }}
                  />
                }
              />
              <TokenCard
                icon={<CarOutlined />}
                hideUsageCount
                themes={[theme.value]}
                defaultOpen
                title="Alias Token"
                tokenArr={aliasTokenData.value}
                tokenPath={['components', component.value]}
                fallback={themeConfig => getDesignToken(themeConfig) as AliasToken}
                onTokenChange={(_, tokenName, value) =>
                  handleComponentTokenChange(tokenName, value)
                }
                placeholder={
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无相关 Alias Token"
                    style={{
                      marginBlock: 0,
                      paddingBlock: '32px',
                    }}
                  />
                }
              />
            </div>
          </div>
        </Drawer>
      );
    };
  },
});

export default defineComponent({
  name: 'ComponentTokenDrawerProvider',
  inheritAttrs: false,
  props: {
    open: { type: Boolean },
    component: { type: String },
    onClose: { type: Function },
    theme: { type: Object as PropType<MutableTheme> },
  },
  setup(props, { attrs }) {
    return () => (
      <ConfigProvider
        theme={{
          algorithm: defaultAlgorithm,
          ...props.theme,
        }}
      >
        <ComponentTokenDrawer {...props} {...attrs} />
      </ConfigProvider>
    );
  },
});
