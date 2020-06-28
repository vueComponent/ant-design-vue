import ScrollableTabBarNode from './ScrollableTabBarNode';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

const ScrollableTabBar = (_, { attrs }) => {
  return (
    <SaveRef
      children={(saveRef, getRef) => (
        <TabBarRootNode saveRef={saveRef} {...attrs}>
          <ScrollableTabBarNode saveRef={saveRef} getRef={getRef} {...attrs}>
            <TabBarTabsNode saveRef={saveRef} {...attrs} />
          </ScrollableTabBarNode>
        </TabBarRootNode>
      )}
    />
  );
};
ScrollableTabBar.inheritAttrs = false;
export default ScrollableTabBar;
