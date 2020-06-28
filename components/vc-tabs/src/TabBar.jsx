import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';

export default {
  name: 'TabBar',
  inheritAttrs: false,
  render() {
    return (
      <SaveRef
        children={saveRef => (
          <TabBarRootNode saveRef={saveRef} {...this.$attrs}>
            <TabBarTabsNode saveRef={saveRef} {...this.$attrs} />
          </TabBarRootNode>
        )}
      />
    );
  },
};
