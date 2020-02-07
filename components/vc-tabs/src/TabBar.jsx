import TabBarRootNode from './TabBarRootNode';
import TabBarTabsNode from './TabBarTabsNode';
import SaveRef from './SaveRef';
import { getAttrs, getListeners } from '../../_util/props-util';

export default {
  name: 'TabBar',
  inheritAttrs: false,
  render() {
    const props = getAttrs(this);
    const listeners = getListeners(this);
    return (
      <SaveRef
        children={saveRef => (
          <TabBarRootNode saveRef={saveRef} {...{ props, on: listeners }}>
            <TabBarTabsNode saveRef={saveRef} {...{ props, on: listeners }} />
          </TabBarRootNode>
        )}
      />
    );
  },
};
