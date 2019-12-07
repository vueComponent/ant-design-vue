import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import SaveRef from './SaveRef';

export default {
  name: 'ScrollableInkTabBar',
  inheritAttrs: false,
  props: [
    'extraContent',
    'inkBarAnimated',
    'tabBarGutter',
    'prefixCls',
    'navWrapper',
    'tabBarPosition',
    'panels',
    'activeKey',
    'prevIcon',
    'nextIcon',
  ],
  render() {
    const props = { ...this.$props };
    const listeners = this.$listeners;
    const { default: renderTabBarNode } = this.$scopedSlots;
    return (
      <SaveRef
        children={(saveRef, getRef) => (
          <TabBarRootNode saveRef={saveRef} {...{ props, on: listeners }}>
            <ScrollableTabBarNode saveRef={saveRef} getRef={getRef} {...{ props, on: listeners }}>
              <TabBarTabsNode
                saveRef={saveRef}
                {...{ props: { ...props, renderTabBarNode }, on: listeners }}
              />
              <InkTabBarNode saveRef={saveRef} getRef={getRef} {...{ props, on: listeners }} />
            </ScrollableTabBarNode>
          </TabBarRootNode>
        )}
      />
    );
  },
};
