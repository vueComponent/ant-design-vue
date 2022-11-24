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
  compatConfig: { MODE: 3 },
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
    const { tabs, prefixCls } = useInjectTabs();
    return () => {
      const { id, activeKey, animated, tabPosition, rtl, destroyInactiveTabPane } = props;
      const tabPaneAnimated = animated.tabPane;
      const pre = prefixCls.value;
      const activeIndex = tabs.value.findIndex(tab => tab.key === activeKey);
      return (
        <div class={`${pre}-content-holder`}>
          <div
            class={[
              `${pre}-content`,
              `${pre}-content-${tabPosition}`,
              {
                [`${pre}-content-animated`]: tabPaneAnimated,
              },
            ]}
            style={
              activeIndex && tabPaneAnimated
                ? { [rtl ? 'marginRight' : 'marginLeft']: `-${activeIndex}00%` }
                : null
            }
          >
            {tabs.value.map(tab => {
              return cloneElement(tab.node, {
                key: tab.key,
                prefixCls: pre,
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
