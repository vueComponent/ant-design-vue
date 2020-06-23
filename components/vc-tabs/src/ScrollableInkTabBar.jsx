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
    const { default: renderTabBarNode } = this.$slots;
    return (
      <SaveRef
        children={(saveRef, getRef) => (
          <TabBarRootNode saveRef={saveRef} {...this.$attrs}>
            <ScrollableTabBarNode saveRef={saveRef} getRef={getRef} {...this.$attrs}>
              <TabBarTabsNode saveRef={saveRef} {...{ ...this.$attrs, renderTabBarNode }} />
              <InkTabBarNode saveRef={saveRef} getRef={getRef} {...this.$attrs} />
            </ScrollableTabBarNode>
          </TabBarRootNode>
        )}
      />
    );
  },
};
