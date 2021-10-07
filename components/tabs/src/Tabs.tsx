// Accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
import TabNavList from './TabNavList';
import TabPanelList from './TabPanelList';
import type {
  TabPosition,
  RenderTabBar,
  TabsLocale,
  EditableConfig,
  AnimatedConfig,
  OnTabScroll,
  Tab,
} from './interface';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, computed, onMounted, watchEffect, camelize } from 'vue';
import { flattenChildren, initDefaultProps, isValidElement } from '../../_util/props-util';
import useConfigInject from '../../_util/hooks/useConfigInject';
import useState from '../../_util/hooks/useState';
import isMobile from '../../vc-util/isMobile';
import useMergedState from '../../_util/hooks/useMergedState';
import classNames from '../../_util/classNames';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons-vue';
import devWarning from '../../vc-util/devWarning';
import type { SizeType } from '../../config-provider';
import { useProvideTabs } from './TabContext';
import type { Key } from '../../_util/type';
import pick from 'lodash-es/pick';
import PropTypes from '../../_util/vue-types';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

// Used for accessibility
let uuid = 0;

export const tabsProps = () => {
  return {
    prefixCls: { type: String },
    id: { type: String },

    activeKey: { type: [String, Number] },
    defaultActiveKey: { type: [String, Number] },
    direction: { type: String as PropType<'ltr' | 'rtl'> },
    animated: { type: [Boolean, Object] as PropType<boolean | AnimatedConfig> },
    renderTabBar: { type: Function as PropType<RenderTabBar> },
    tabBarGutter: { type: Number },
    tabBarStyle: { type: Object as PropType<CSSProperties> },
    tabPosition: { type: String as PropType<TabPosition> },
    destroyInactiveTabPane: { type: Boolean },

    hideAdd: Boolean,
    type: { type: String as PropType<TabsType> },
    size: { type: String as PropType<SizeType> },
    centered: Boolean,
    onEdit: {
      type: Function as PropType<
        (e: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => void
      >,
    },
    onChange: { type: Function as PropType<(activeKey: Key) => void> },
    onTabClick: {
      type: Function as PropType<(activeKey: Key, e: KeyboardEvent | MouseEvent) => void>,
    },
    onTabScroll: { type: Function as PropType<OnTabScroll> },

    // Accessibility
    locale: { type: Object as PropType<TabsLocale>, default: undefined as TabsLocale },
    onPrevClick: Function,
    onNextClick: Function,
    tabBarExtraContent: PropTypes.any,
  };
};

export type TabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;

function parseTabList(children: any[]): Tab[] {
  return children
    .map(node => {
      if (isValidElement(node)) {
        const props = { ...(node.props || {}) };
        for (const [k, v] of Object.entries(props)) {
          delete props[k];
          props[camelize(k)] = v;
        }
        const slots = node.children || {};
        const key = node.key !== undefined ? node.key : undefined;
        const {
          tab = slots.tab,
          disabled,
          forceRender,
          closable,
          animated,
          active,
          destroyInactiveTabPane,
        } = props;
        return {
          key,
          ...props,
          node,
          closeIcon: slots.closeIcon,
          tab,
          disabled: disabled === '' || disabled,
          forceRender: forceRender === '' || forceRender,
          closable: closable === '' || closable,
          animated: animated === '' || animated,
          active: active === '' || active,
          destroyInactiveTabPane: destroyInactiveTabPane === '' || destroyInactiveTabPane,
        };
      }

      return null;
    })
    .filter(tab => tab);
}
const InternalTabs = defineComponent({
  name: 'InternalTabs',
  inheritAttrs: false,
  props: {
    ...initDefaultProps(tabsProps(), {
      tabPosition: 'top',
      animated: {
        inkBar: true,
        tabPane: false,
      },
    }),
    tabs: { type: Array as PropType<Tab[]> },
  },
  slots: [
    'tabBarExtraContent',
    'leftExtra',
    'rightExtra',
    'moreIcon',
    'addIcon',
    'removeIcon',
    'renderTabBar',
  ],
  emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, { attrs, slots }) {
    devWarning(
      !(props.onPrevClick !== undefined) && !(props.onNextClick !== undefined),
      'Tabs',
      '`onPrevClick / @prevClick` and `onNextClick / @nextClick` has been removed. Please use `onTabScroll / @tabScroll` instead.',
    );
    devWarning(
      !(props.tabBarExtraContent !== undefined),
      'Tabs',
      '`tabBarExtraContent` prop has been removed. Please use `rightExtra` slot instead.',
    );
    devWarning(
      !(slots.tabBarExtraContent !== undefined),
      'Tabs',
      '`tabBarExtraContent` slot is deprecated. Please use `rightExtra` slot instead.',
    );
    const { prefixCls, direction, size, rootPrefixCls } = useConfigInject('tabs', props);
    const rtl = computed(() => direction.value === 'rtl');
    const mergedAnimated = computed<AnimatedConfig>(() => {
      const { animated } = props;
      if (animated === false) {
        return {
          inkBar: false,
          tabPane: false,
        };
      } else if (animated === true) {
        return {
          inkBar: true,
          tabPane: true,
        };
      } else {
        return {
          inkBar: true,
          tabPane: false,
          ...(typeof animated === 'object' ? animated : {}),
        };
      }
    });

    // ======================== Mobile ========================
    const [mobile, setMobile] = useState(false);
    onMounted(() => {
      // Only update on the client side
      setMobile(isMobile());
    });

    // ====================== Active Key ======================
    const [mergedActiveKey, setMergedActiveKey] = useMergedState<Key>(() => props.tabs[0]?.key, {
      value: computed(() => props.activeKey),
      defaultValue: props.defaultActiveKey,
    });
    const [activeIndex, setActiveIndex] = useState(() =>
      props.tabs.findIndex(tab => tab.key === mergedActiveKey.value),
    );

    watchEffect(() => {
      let newActiveIndex = props.tabs.findIndex(tab => tab.key === mergedActiveKey.value);
      if (newActiveIndex === -1) {
        newActiveIndex = Math.max(0, Math.min(activeIndex.value, props.tabs.length - 1));
        mergedActiveKey.value = props.tabs[newActiveIndex]?.key;
      }
      setActiveIndex(newActiveIndex);
    });

    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = useMergedState(null, {
      value: computed(() => props.id),
    });

    const mergedTabPosition = computed(() => {
      if (mobile.value && !['left', 'right'].includes(props.tabPosition)) {
        return 'top';
      } else {
        return props.tabPosition;
      }
    });

    onMounted(() => {
      if (!props.id) {
        setMergedId(`rc-tabs-${process.env.NODE_ENV === 'test' ? 'test' : uuid}`);
        uuid += 1;
      }
    });

    // ======================== Events ========================
    const onInternalTabClick = (key: Key, e: MouseEvent | KeyboardEvent) => {
      props.onTabClick?.(key, e);

      setMergedActiveKey(key);
      props.onChange?.(key);
    };

    useProvideTabs({
      tabs: computed(() => props.tabs),
      prefixCls,
    });

    return () => {
      const {
        id,
        type,
        tabBarGutter,
        tabBarStyle,
        locale,
        destroyInactiveTabPane,
        renderTabBar = slots.renderTabBar,
        onTabScroll,
        hideAdd,
        centered,
      } = props;
      // ======================== Render ========================
      const sharedProps = {
        id: mergedId.value,
        activeKey: mergedActiveKey.value,
        animated: mergedAnimated.value,
        tabPosition: mergedTabPosition.value,
        rtl: rtl.value,
        mobile: mobile.value,
      };

      let editable: EditableConfig | undefined;
      if (type === 'editable-card') {
        editable = {
          onEdit: (editType, { key, event }) => {
            props.onEdit?.(editType === 'add' ? event : key!, editType);
          },
          removeIcon: () => <CloseOutlined />,
          addIcon: slots.addIcon ? slots.addIcon : () => <PlusOutlined />,
          showAdd: hideAdd !== true,
        };
      }

      let tabNavBar;

      const tabNavBarProps = {
        ...sharedProps,
        moreTransitionName: `${rootPrefixCls.value}-slide-up`,
        editable,
        locale,
        tabBarGutter,
        onTabClick: onInternalTabClick,
        onTabScroll,
        style: tabBarStyle,
      };

      if (renderTabBar) {
        tabNavBar = renderTabBar({ ...tabNavBarProps, DefaultTabBar: TabNavList });
      } else {
        tabNavBar = (
          <TabNavList
            {...tabNavBarProps}
            v-slots={pick(slots, ['moreIcon', 'leftExtra', 'rightExtra', 'tabBarExtraContent'])}
          />
        );
      }
      const pre = prefixCls.value;

      return (
        <div
          {...attrs}
          id={id}
          class={classNames(
            pre,
            `${pre}-${mergedTabPosition.value}`,
            {
              [`${pre}-${size.value}`]: size.value,
              [`${pre}-card`]: ['card', 'editable-card'].includes(type as string),
              [`${pre}-editable-card`]: type === 'editable-card',
              [`${pre}-centered`]: centered,
              [`${pre}-mobile`]: mobile.value,
              [`${pre}-editable`]: type === 'editable-card',
              [`${pre}-rtl`]: rtl.value,
            },
            attrs.class,
          )}
        >
          {tabNavBar}
          <TabPanelList
            destroyInactiveTabPane={destroyInactiveTabPane}
            {...sharedProps}
            animated={mergedAnimated.value}
          />
        </div>
      );
    };
  },
});

export default defineComponent({
  name: 'ATabs',
  inheritAttrs: false,
  props: initDefaultProps(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false,
    },
  }),
  slots: [
    'tabBarExtraContent',
    'leftExtra',
    'rightExtra',
    'moreIcon',
    'addIcon',
    'removeIcon',
    'renderTabBar',
  ],
  emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, { attrs, slots, emit }) {
    const handleChange = (key: string) => {
      emit('update:activeKey', key);
      emit('change', key);
    };
    return () => {
      const tabs = parseTabList(flattenChildren(slots.default?.()));
      return (
        <InternalTabs {...props} {...attrs} onChange={handleChange} tabs={tabs} v-slots={slots} />
      );
    };
  },
});
