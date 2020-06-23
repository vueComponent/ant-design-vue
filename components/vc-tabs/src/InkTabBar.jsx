import InkTabBarNode from './InkTabBarNode';
import TabBarTabsNode from './TabBarTabsNode';
import TabBarRootNode from './TabBarRootNode';
import SaveRef from './SaveRef';
function noop() {}

const InkTabBar = (_, { attrs }) => {
  const { onTabClick = noop, ...props } = attrs;
  return (
    <SaveRef
      children={(saveRef, getRef) => (
        <TabBarRootNode saveRef={saveRef} {...props}>
          <TabBarTabsNode onTabClick={onTabClick} saveRef={saveRef} {...props} />
          <InkTabBarNode saveRef={saveRef} getRef={getRef} {...props} />
        </TabBarRootNode>
      )}
    />
  );
};

InkTabBar.inheritAttrs = false;
export default InkTabBar;
