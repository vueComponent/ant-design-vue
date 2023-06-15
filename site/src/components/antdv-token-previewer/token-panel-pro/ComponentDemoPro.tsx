import { ConfigProvider, Segmented, Space, theme as antdTheme } from 'ant-design-vue';
import type { MutableTheme } from '../interface';
import type { PropType, CSSProperties } from 'vue';
import { defineComponent, toRefs, ref, computed } from 'vue';
import ComponentDemoGroup from '../component-panel/ComponentDemoGroup';
import { useInjectLocaleContext } from '../locale';
import { Error, Primary, Success, Warning } from '../overviews';

export type ComponentDemoProProps = {
  selectedTokens?: string[];
  theme: MutableTheme;
  components: Record<string, string[]>;
  activeComponents?: string[];
  componentDrawer?: boolean;
  showAll?: boolean;
};

const ComponentDemoPro = defineComponent({
  name: 'ComponentDemoPro',
  inheritAttrs: false,
  props: {
    selectedTokens: { type: Array as PropType<string[]> },
    theme: { type: Object as PropType<MutableTheme> },
    components: { type: Object as PropType<Record<string, string[]>> },
    activeComponents: { type: Array as PropType<string[]> },
    componentDrawer: { type: Boolean },
    showAll: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { selectedTokens, theme, components, activeComponents, componentDrawer, showAll } =
      toRefs(props);

    const mode = ref<'overview' | 'component'>('overview');

    const { token } = antdTheme.useToken();

    const locale = useInjectLocaleContext();

    const overviewDemo = computed(() => {
      if (showAll.value) {
        return (
          <Space direction="vertical">
            <Primary />
            <Success />
            <Error />
            <Warning />
          </Space>
        );
      }
      if (selectedTokens.value?.includes('colorError')) {
        return <Error />;
      }
      if (selectedTokens.value?.includes('colorSuccess')) {
        return <Success />;
      }
      if (selectedTokens.value?.includes('colorWarning')) {
        return <Warning />;
      }
      return <Primary />;
    });

    return () => {
      return (
        <div
          {...attrs}
          style={{
            ...(attrs.style as CSSProperties),
            background: token.value.colorBgLayout,
            paddingBottom: '24px',
          }}
        >
          <div style={{ margin: 'auto', maxWidth: '960px' }}>
            <Segmented
              options={[
                { value: 'overview', label: locale.value.demo.overview },
                { value: 'component', label: locale.value.demo.components },
              ]}
              value={mode.value}
              onChange={val => (mode.value = val as any)}
              style={{ margin: '12px 0 0 12px' }}
            />

            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    zIndexPopup: 10,
                  },
                  DatePicker: {
                    zIndexPopup: 10,
                  },
                  Dropdown: {
                    zIndexPopup: 10,
                  },
                  Mentions: {
                    zIndexPopup: 10,
                  },
                  Tooltip: {
                    zIndexPopup: 10,
                  },
                  Popover: {
                    zIndexPopup: 10,
                  },
                  Popconfirm: {
                    zIndexPopup: 10,
                  },
                },
              }}
            >
              {mode.value === 'overview' ? (
                <div style={{ margin: '12px' }}>{overviewDemo.value}</div>
              ) : (
                <ComponentDemoGroup
                  selectedTokens={selectedTokens.value}
                  themes={[theme.value]}
                  components={components.value}
                  activeComponents={activeComponents.value}
                  componentDrawer={componentDrawer.value}
                  hideTokens
                />
              )}
            </ConfigProvider>
          </div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: 'ComponentDemoProProvider',
  inheritAttrs: false,
  props: {
    selectedTokens: { type: Array as PropType<string[]> },
    theme: { type: Object as PropType<MutableTheme> },
    components: { type: Object as PropType<Record<string, string[]>> },
    activeComponents: { type: Array as PropType<string[]> },
    componentDrawer: { type: Boolean },
    showAll: { type: Boolean },
  },
  setup(props, { attrs }) {
    return () => (
      <ConfigProvider theme={props.theme.config}>
        <ComponentDemoPro {...props} {...attrs} />
      </ConfigProvider>
    );
  },
});
