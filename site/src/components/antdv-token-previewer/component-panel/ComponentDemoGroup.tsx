import type { CSSProperties, PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';
import { ConfigProvider, Tooltip } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import ComponentDemos from '../component-demos';
import type { ComponentDemo, MutableTheme, TokenName } from '../interface';
import { useInjectLocaleContext } from '../locale';
import makeStyle from '../utils/makeStyle';
import ComponentCard, { getComponentDemoId } from './ComponentCard';

const useStyle = makeStyle('ComponentDemoGroup', token => ({
  '.previewer-component-demo-group': {
    display: 'flex',
    width: '100%',
    overflow: 'hidden',

    '&:first-child': {
      '.previewer-component-demo-group-item': {
        paddingTop: token.padding,
      },
    },

    '&:last-child': {
      '.previewer-component-demo-group-item': {
        paddingBottom: token.padding,
      },
    },
  },
}));

const useDemoStyle = makeStyle('ComponentDemoBlock', token => ({
  '.previewer-component-demo-group-item': {
    flex: '1 1 50%',
    paddingInline: token.padding,
    paddingBlock: token.padding / 2,
    width: 0,
    backgroundColor: token.colorBgLayout,

    '.previewer-component-demo-group-item-relative-token': {
      color: token.colorTextSecondary,
      paddingBottom: 8,

      '&:not(:first-child)': {
        marginTop: 12,
      },
    },
  },
}));

export type ComponentDemoBlockProps = {
  component: string;
  onTokenClick?: (token: TokenName) => void;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  demos?: (ComponentDemo & { active?: boolean })[];
  theme: MutableTheme;
  componentDrawer?: boolean;
};

export const ComponentDemoBlock = defineComponent({
  name: 'ComponentDemoBlock',
  inheritAttrs: false,
  props: {
    component: { type: String },
    onTokenClick: { type: Function as PropType<(token: TokenName) => void> },
    size: { type: String as PropType<'small' | 'middle' | 'large'>, default: 'middle' },
    disabled: { type: Boolean, default: false },
    demos: {
      type: Object as PropType<(ComponentDemo & { active?: boolean })[]>,
      default: () => [],
    },
    theme: { type: Object as PropType<MutableTheme> },
    componentDrawer: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { component, size, disabled, demos, theme, componentDrawer } = toRefs(props);

    const [, hashId] = useDemoStyle();
    const locale = useInjectLocaleContext();

    return () => {
      return (
        <div {...attrs} class={classNames('previewer-component-demo-group-item', hashId.value)}>
          <ComponentCard
            title={component.value}
            component={component.value}
            onTokenClick={props.onTokenClick}
            drawer={componentDrawer.value}
            theme={theme.value}
          >
            <ConfigProvider componentSize={size.value} componentDisabled={disabled.value}>
              {demos.value.some(item => item.active)
                ? demos.value.map(demo => (
                    <div key={demo.key} style={{ display: demo.active ? '' : 'none' }}>
                      {demo.tokens && (
                        <div class="previewer-component-demo-group-item-relative-token">
                          <Tooltip title={demo.tokens.join(', ')}>
                            <span>
                              {locale.value.demo.relatedTokens}:{' '}
                              {demo.tokens.slice(0, 2).join(', ')}
                              {demo.tokens.length > 2 ? '...' : ''}
                            </span>
                          </Tooltip>
                        </div>
                      )}
                      {demo.demo}
                    </div>
                  ))
                : demos.value[0]?.demo}
            </ConfigProvider>
          </ComponentCard>
        </div>
      );
    };
  },
});

export type ComponentDemoGroupProps = {
  themes: MutableTheme[];
  components: Record<string, string[]>;
  activeComponents?: string[];
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  selectedTokens?: string[];
  onTokenClick?: (token: TokenName) => void;
  componentDrawer?: boolean;
  hideTokens?: boolean;
};

const ComponentDemoGroup = defineComponent({
  name: 'ComponentDemoGroup',
  inheritAttrs: false,
  props: {
    themes: { type: Array as PropType<MutableTheme[]> },
    components: { type: Object as PropType<Record<string, string[]>> },
    activeComponents: { type: Array as PropType<string[]> },
    size: { type: String as PropType<'small' | 'middle' | 'large'> },
    disabled: { type: Boolean },
    selectedTokens: { type: Array as PropType<string[]> },
    onTokenClick: { type: Function as PropType<(token: TokenName) => void> },
    componentDrawer: { type: Boolean },
    hideTokens: { type: Boolean },
  },
  setup(props, { attrs }) {
    const {
      themes,
      components,
      size,
      disabled,
      activeComponents,
      selectedTokens,
      componentDrawer,
      hideTokens,
    } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    return () => {
      return wrapSSR(
        <>
          {Object.entries(components.value)
            .reduce<string[]>((result, [, group]) => result.concat(group), [])
            .map(item => {
              const componentDemos = ComponentDemos[item];
              if (!componentDemos) {
                return null;
              }
              const demos: ComponentDemo[] = componentDemos.map((demo, index) => {
                return {
                  ...demo,
                  tokens: hideTokens.value ? undefined : demo.tokens,
                  active:
                    ((!selectedTokens.value || selectedTokens.value.length === 0) && index === 0) ||
                    selectedTokens.value?.some(token => demo.tokens?.includes(token as any)),
                };
              });

              return (
                <div
                  {...attrs}
                  class={classNames('previewer-component-demo-group', hashId.value, attrs.class)}
                  key={item}
                  id={getComponentDemoId(item)}
                  style={{
                    display:
                      !activeComponents.value ||
                      activeComponents.value.length === 0 ||
                      activeComponents.value.includes(item)
                        ? ''
                        : 'none',
                    ...(attrs.style as CSSProperties),
                  }}
                >
                  {themes.value.length > 1 ? (
                    themes.value.map(theme => (
                      <ConfigProvider key={theme.key} theme={theme.config}>
                        <ComponentDemoBlock
                          component={item}
                          onTokenClick={props.onTokenClick}
                          demos={demos}
                          disabled={disabled.value}
                          size={size.value}
                          theme={theme}
                          componentDrawer={componentDrawer.value}
                        />
                      </ConfigProvider>
                    ))
                  ) : (
                    <ComponentDemoBlock
                      component={item}
                      onTokenClick={props.onTokenClick}
                      demos={demos}
                      disabled={disabled.value}
                      size={size.value}
                      theme={themes.value[0]}
                      componentDrawer={componentDrawer.value}
                    />
                  )}
                </div>
              );
            })}
        </>,
      );
    };
  },
});

export default ComponentDemoGroup;
