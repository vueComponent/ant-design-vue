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
import { defineComponent, computed, onMounted, watchEffect } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import {
  camelize,
  flattenChildren,
  initDefaultProps,
  isValidElement,
} from '../../_util/props-util';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import useState from '../../_util/hooks/useState';
import isMobile from '../../vc-util/isMobile';
import useMergedState from '../../_util/hooks/useMergedState';
import classNames from '../../_util/classNames';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import devWarning from '../../vc-util/devWarning';
import type { SizeType } from '../../config-provider';
import { useProvideTabs } from './TabContext';
import {
  arrayType,
  stringType,
  someType,
  functionType,
  objectType,
  booleanType,
} from '../../_util/type';
import type { CustomSlotsType, Key } from '../../_util/type';
import pick from 'lodash-es/pick';
import PropTypes from '../../_util/vue-types';
import type { MouseEventHandler } from '../../_util/EventInterface';
import omit from '../../_util/omit';
import useStyle from '../style';
export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

// Used for accessibility
let uuid = 0;

export const tabsProps = () => {
  return {
    prefixCls: { type: String },
    id: { type: String },
    popupClassName: String,
    getPopupContainer: functionType<
      ((triggerNode?: HTMLElement | undefined) => HTMLElement) | undefined
    >(),
    activeKey: { type: [String, Number] },
    defaultActiveKey: { type: [String, Number] },
    direction: stringType<'ltr' | 'rtl'>(),
    animated: someType<boolean | AnimatedConfig>([Boolean, Object]),
    renderTabBar: functionType<RenderTabBar>(),
    tabBarGutter: { type: Number },
    tabBarStyle: objectType<CSSProperties>(),
    tabPosition: stringType<TabPosition>(),
    destroyInactiveTabPane: booleanType(),

    hideAdd: Boolean,
    type: stringType<TabsType>(),
    size: stringType<SizeType>(),
    centered: Boolean,
    onEdit: functionType<(e: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => void>(),
    onChange: functionType<(activeKey: Key) => void>(),
    onTabClick: functionType<(activeKey: Key, e: KeyboardEvent | MouseEvent) => void>(),
    onTabScroll: functionType<OnTabScroll>(),
    'onUpdate:activeKey': functionType<(activeKey: Key) => void>(),
    // Accessibility
    locale: objectType<TabsLocale>(),
    onPrevClick: functionType<MouseEventHandler>(),
    onNextClick: functionType<MouseEventHandler>(),
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
  compatConfig: { MODE: 3 },
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
    tabs: arrayType<Tab[]>(),
  },
  slots: Object as CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default: any;
  }>,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
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
    const { prefixCls, direction, size, rootPrefixCls, getPopupContainer } = useConfigInject(
      'tabs',
      props,
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rtl = computed(() => direction.value === 'rtl');
    const mergedAnimated = computed<AnimatedConfig>(() => {
      const { animated, tabPosition } = props;
      if (animated === false || ['left', 'right'].includes(tabPosition)) {
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
        setMergedActiveKey(props.tabs[newActiveIndex]?.key);
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
      const isActiveChanged = key !== mergedActiveKey.value;
      setMergedActiveKey(key);
      if (isActiveChanged) {
        props.onChange?.(key);
      }
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
        getPopupContainer: getPopupContainer.value,
        popupClassName: classNames(props.popupClassName, hashId.value),
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

      return wrapSSR(
        <div
          {...attrs}
          id={id}
          class={classNames(
            pre,
            `${pre}-${mergedTabPosition.value}`,
            {
              [hashId.value]: true,
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
        </div>,
      );
    };
  },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATabs',
  inheritAttrs: false,
  props: initDefaultProps(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false,
    },
  }),
  slots: Object as CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default?: any;
  }>,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, { attrs, slots, emit }) {
    const handleChange = (key: string) => {
      emit('update:activeKey', key);
      emit('change', key);
    };
    return () => {
      const tabs = parseTabList(flattenChildren(slots.default?.()));
      return (
        <InternalTabs
          {...omit(props, ['onUpdate:activeKey'])}
          {...attrs}
          onChange={handleChange}
          tabs={tabs}
          v-slots={slots}
        />
      );
    };
  },
});
