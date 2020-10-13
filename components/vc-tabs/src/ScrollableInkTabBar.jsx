import { defineComponent } from 'vue';
import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import ScrollableTabBarNode from './ScrollableTabBarNode';
import SaveRef from './SaveRef';

export default defineComponent({
  name: 'ScrollableInkTabBar',
  inheritAttrs: false,
  render() {
    const { children: renderTabBarNode } = this.$attrs;
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
});
