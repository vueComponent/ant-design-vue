import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { Breadcrumb, Segmented, Switch } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { PropType } from 'vue';
import { defineComponent, ref, watch, watchEffect, computed, toRefs } from 'vue';
import type { FilterMode } from '../FilterPanel';
import type { Theme, TokenName } from '../interface';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';
import { getComponentDemoId } from './ComponentCard';
import ComponentDemoGroup from './ComponentDemoGroup';
import ComponentTree from './ComponentTree';

const BREADCRUMB_HEIGHT = 40;

const useStyle = makeStyle('ComponentPanel', token => ({
  '.component-panel': {
    boxShadow:
      '0 2px 4px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(25,15,15,0.07), 0 0 1px 0 rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    display: 'flex',
    borderRadius: 6,
    height: '100%',
    overflow: 'hidden',

    '.component-panel-main': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      width: 0,

      '.component-panel-head': {
        padding: `${token.paddingSM}px ${token.paddingSM}px`,
        flex: 'none',
        backgroundColor: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBgContainer}`,

        '> *:not(:first-child)': {
          marginInlineStart: token.margin,
        },

        [`${token.rootCls}-segmented-item`]: {
          minWidth: 52,
        },
      },

      '.component-panel-toggle-side-icon': {
        flex: 'none',
        cursor: 'pointer',
        marginInlineEnd: token.marginXS,

        '.anticon': {
          color: token.colorIcon,
          transition: `color ${token.motionDurationMid}`,

          '&:hover': {
            color: token.colorIconHover,
          },
        },
      },
    },

    '.component-panel-side': {
      flex: 'none',
      width: 200,
      overflow: 'hidden',
      transition: `transform ${token.motionDurationMid}, width ${token.motionDurationMid}`,
    },

    '.component-panel-side.component-panel-side-hidden': {
      width: 0,
      transform: 'translateX(-200px)',
    },

    '.component-demos-wrapper': {
      display: 'flex',
      flex: 1,
      height: 0,
      position: 'relative',

      '.component-demos-breadcrumb-wrapper': {
        position: 'absolute',
        top: 0,
        insetInlineStart: 0,
        width: '100%',
        height: BREADCRUMB_HEIGHT,
        zIndex: 20,
        backgroundColor: token.colorBgContainer,
        padding: '8px 16px',
        transition: 'opacity 0.3s',
        background: 'rgba(255, 255, 255, .6)',
        backdropFilter: 'blur(10px)',
        borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorBgContainer}`,
      },
    },

    '.component-demos': {
      height: '100%',
      overflow: 'auto',
      flex: 1,
    },
  },
}));

export const antdComponents = {
  General: ['Button', 'Icon', 'Typography'],
  Layout: ['Divider', 'Grid', 'Space'],
  Navigation: ['Breadcrumb', 'Dropdown', 'Menu', 'Pagination', 'Steps'],
  'Date Entry': [
    'AutoComplete',
    'Cascader',
    'Checkbox',
    'DatePicker',
    'Form',
    'Input',
    'InputNumber',
    'Mentions',
    'Radio',
    'Rate',
    'Select',
    'Slider',
    'Switch',
    'TimePicker',
    'Transfer',
    'TreeSelect',
    'Upload',
  ],
  'Data Display': [
    'Avatar',
    'Badge',
    'Calendar',
    'Card',
    'Carousel',
    'Collapse',
    'Descriptions',
    'Empty',
    'Image',
    'List',
    'Popover',
    'Segmented',
    'Statistic',
    'Table',
    'Tabs',
    'Tag',
    'Timeline',
    'Tooltip',
    'Tree',
  ],
  Feedback: [
    'Alert',
    'Drawer',
    'Message',
    'Modal',
    'Notification',
    'Popconfirm',
    'Progress',
    'Result',
    'Skeleton',
    'Spin',
  ],
  Other: ['Anchor'],
};

export type ComponentPanelProps = {
  themes: Theme[];
  selectedTokens?: string[];
  filterMode?: FilterMode;
  onTokenClick?: (token: TokenName) => void;
};

const Index = defineComponent({
  name: 'Index',
  inheritAttrs: false,
  props: {
    themes: { type: Array as PropType<Theme[]> },
    selectedTokens: { type: Array as PropType<string[]> },
    filterMode: { type: String as PropType<FilterMode> },
    onTokenClick: { type: Function as PropType<(token: TokenName) => void> },
  },
  setup(props, { attrs }) {
    const { themes, selectedTokens, filterMode } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const showSide = ref<boolean>(true);
    const demosRef = ref<HTMLDivElement>(null);
    const componentSize = ref<'large' | 'small' | 'middle'>('middle');
    const componentDisabled = ref<boolean>(false);
    const activeComponent = ref<string | undefined>();
    const showBreadcrumb = ref<boolean>(false);

    const relatedComponents = computed(() => {
      return selectedTokens.value ? getRelatedComponents(selectedTokens.value) : [];
    });

    watch(selectedTokens, () => {
      showSide.value = true;
    });

    watchEffect(() => {
      const handleScroll = () => {
        if (demosRef.value) {
          showBreadcrumb.value = demosRef.value.scrollTop > 10;
          for (let i = 0; i < demosRef.value.children.length; i++) {
            if (
              demosRef.value.children[i].getBoundingClientRect().top +
                demosRef.value.children[i].clientHeight -
                demosRef.value.getBoundingClientRect().top >
              BREADCRUMB_HEIGHT
            ) {
              activeComponent.value = demosRef.value.children[i]?.id.split('-').pop();
              break;
            }
          }
        }
      };

      demosRef.value?.addEventListener('scroll', handleScroll);
      const demosWrapper = demosRef.value;
      return () => {
        demosWrapper?.removeEventListener('scroll', handleScroll);
      };
    });

    const scrollToComponent = (component: string) => {
      demosRef.value?.scrollTo({
        top:
          (demosRef.value?.querySelector<HTMLElement>(`#${getComponentDemoId(component)}`)
            ?.offsetTop || 0) - 38,
        behavior: 'smooth',
      });
    };

    const activeComponentCategory = computed(() => {
      if (!activeComponent.value) {
        return undefined;
      }
      const key = Object.entries(antdComponents).find(([, value]) =>
        value.includes(activeComponent.value),
      )?.[0];
      if (key) {
        return (antdComponents as any)[key];
      } else {
        return undefined;
      }
    });

    return () => {
      const demoGroup = () => (
        <ComponentDemoGroup
          themes={themes.value}
          components={antdComponents}
          size={componentSize.value}
          disabled={componentDisabled.value}
          activeComponents={filterMode.value === 'highlight' ? undefined : relatedComponents.value}
          selectedTokens={selectedTokens.value}
          onTokenClick={props.onTokenClick}
        />
      );
      return wrapSSR(
        <div {...attrs} class={classNames('component-panel', hashId.value, attrs.class)}>
          <div
            class={classNames('component-panel-side', {
              'component-panel-side-hidden': !showSide.value,
            })}
          >
            <ComponentTree
              activeComponent={activeComponent.value}
              filterMode={filterMode.value}
              selectedTokens={selectedTokens.value}
              components={antdComponents}
              onSelect={component => {
                if (component.startsWith('type-')) {
                  scrollToComponent((antdComponents as any)[component.split('-')[1]][0]);
                } else {
                  scrollToComponent(component);
                }
              }}
            />
          </div>
          <div class="component-panel-main">
            <div class="component-panel-head">
              <div
                class="component-panel-toggle-side-icon"
                onClick={() => (showSide.value = !showSide.value)}
              >
                {showSide.value ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </div>
              <div>
                <span style={{ marginRight: '8px' }}>组件尺寸：</span>
                <Segmented
                  value={componentSize.value}
                  onChange={value => (componentSize.value = value as any)}
                  options={[
                    { label: '大', value: 'large' },
                    { label: '中', value: 'middle' },
                    { label: '小', value: 'small' },
                  ]}
                />
              </div>
              <div>
                <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>禁用：</span>
                <Switch
                  checked={componentDisabled.value}
                  onChange={checked => (componentDisabled.value = checked as boolean)}
                />
              </div>
            </div>
            <div class="component-demos-wrapper">
              {activeComponent.value && (
                <div
                  class="component-demos-breadcrumb-wrapper"
                  style={{ opacity: showBreadcrumb.value ? 1 : 0 }}
                >
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <a
                        onClick={() =>
                          activeComponentCategory.value &&
                          scrollToComponent(activeComponentCategory.value?.[0])
                        }
                      >
                        {
                          Object.entries(antdComponents).find(([, value]) =>
                            value.includes(activeComponent.value),
                          )?.[0]
                        }
                      </a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{activeComponent.value}</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              )}
              <div class="component-demos" ref={demosRef}>
                {demoGroup()}
              </div>
            </div>
          </div>
        </div>,
      );
    };
  },
});

export default Index;
