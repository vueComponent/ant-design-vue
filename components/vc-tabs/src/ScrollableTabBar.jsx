import ScrollableTabBarNode from './ScrollableTabBarNode';
import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

export default {
  name: 'ScrollableTabBar',
  functional: true,
  render(h, context) {
    const { props, listeners = {} } = context;
    return (
      <SaveRef
        children={(saveRef, getRef) => (
          <TabBarRootNode saveRef={saveRef} {...{ props, on: listeners }}>
            <ScrollableTabBarNode saveRef={saveRef} getRef={getRef} {...{ props, on: listeners }}>
              <TabBarTabsNode saveRef={saveRef} {...{ props, on: listeners }} />
            </ScrollableTabBarNode>
          </TabBarRootNode>
        )}
      />
    );
  },
};
