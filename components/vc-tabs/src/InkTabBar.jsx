import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import SaveRef from './SaveRef';
function noop() {}

export default {
  name: 'InkTabBar',
  functional: true,
  render(h, context) {
    const { props, listeners = {} } = context;
    return (
      <SaveRef
        children={(saveRef, getRef) => (
          <TabBarRootNode saveRef={saveRef} {...props}>
            <TabBarTabsNode
              onTabClick={listeners.tabClick || noop}
              saveRef={saveRef}
              {...{ props }}
            />
            <InkTabBarNode saveRef={saveRef} getRef={getRef} {...{ props }} />
          </TabBarRootNode>
        )}
      />
    );
  },
};
