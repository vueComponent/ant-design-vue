import { useInjectTabs } from '../TabContext';
import type { TabPosition, AnimatedConfig } from '../interface';
import type { Key } from '../../../_util/type';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { cloneElement } from '../../../_util/vnode';

export interface TabPanelListProps {
  activeKey: Key;
  id: string;
  rtl: boolean;
  animated?: AnimatedConfig;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;
}
export default defineComponent({
  name: 'TabPanelList',
  inheritAttrs: false,
  props: {
    activeKey: { type: [String, Number] as PropType<Key> },
    id: { type: String },
    rtl: { type: Boolean },
    animated: { type: Object as PropType<AnimatedConfig>, default: undefined as AnimatedConfig },
    tabPosition: { type: String as PropType<TabPosition> },
    destroyInactiveTabPane: { type: Boolean },
  },
  setup(props) {
    const tabsContext = useInjectTabs();
    return () => {
      const { id, activeKey, animated, tabPosition, rtl, destroyInactiveTabPane } = props;
      const { prefixCls, tabs } = tabsContext;
      const tabPaneAnimated = animated.tabPane;

      const activeIndex = tabs.findIndex(tab => tab.key === activeKey);

      return (
        <div class={`${prefixCls}-content-holder`}>
          <div
            class={[
              `${prefixCls}-content`,
              `${prefixCls}-content-${tabPosition}`,
              {
                [`${prefixCls}-content-animated`]: tabPaneAnimated,
              },
            ]}
            style={
              activeIndex && tabPaneAnimated
                ? { [rtl ? 'marginRight' : 'marginLeft']: `-${activeIndex}00%` }
                : null
            }
          >
            {tabs.map(tab => {
              return cloneElement(tab.node, {
                key: tab.key,
                prefixCls,
                tabKey: tab.key,
                id,
                animated: tabPaneAnimated,
                active: tab.key === activeKey,
                destroyInactiveTabPane,
              });
            })}
          </div>
        </div>
      );
    };
  },
});
