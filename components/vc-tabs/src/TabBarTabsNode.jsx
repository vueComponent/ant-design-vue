import warning from 'warning';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getComponent, getPropsData } from '../../_util/props-util';
import { isVertical } from './utils';
function noop() {}
export default {
  name: 'TabBarTabsNode',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    panels: PropTypes.any.def([]),
    prefixCls: PropTypes.string.def(''),
    tabBarGutter: PropTypes.any.def(null),
    onTabClick: PropTypes.func,
    saveRef: PropTypes.func.def(noop),
    getRef: PropTypes.func.def(noop),
    renderTabBarNode: PropTypes.func,
    tabBarPosition: PropTypes.string,
    direction: PropTypes.string,
  },
  render() {
    const {
      panels: children,
      activeKey,
      prefixCls,
      tabBarGutter,
      saveRef,
      tabBarPosition,
      direction,
    } = this.$props;
    const rst = [];
    const renderTabBarNode = this.renderTabBarNode || this.$slots.renderTabBarNode;
    children.forEach((child, index) => {
      if (!child) {
        return;
      }
      const props = getPropsData(child);
      const key = child.key;
      let cls = activeKey === key ? `${prefixCls}-tab-active` : '';
      cls += ` ${prefixCls}-tab`;
      const events = {};
      const disabled = props.disabled;
      if (disabled) {
        cls += ` ${prefixCls}-tab-disabled`;
      } else {
        events.onClick = () => {
          this.__emit('tabClick', key);
        };
      }
      const tab = getComponent(child, 'tab');
      let gutter = tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter;
      gutter = typeof gutter === 'number' ? `${gutter}px` : gutter;
      const marginProperty = direction === 'rtl' ? 'marginLeft' : 'marginRight';
      const style = {
        [isVertical(tabBarPosition) ? 'marginBottom' : marginProperty]: gutter,
      };
      warning(tab !== undefined, 'There must be `tab` property or slot on children of Tabs.');
      let node = (
        <div
          role="tab"
          aria-disabled={disabled ? 'true' : 'false'}
          aria-selected={activeKey === key ? 'true' : 'false'}
          {...events}
          class={cls.trim()}
          key={key}
          style={style}
          ref={activeKey === key ? saveRef('activeTab') : noop}
        >
          {tab}
        </div>
      );
      if (renderTabBarNode) {
        node = renderTabBarNode(node);
      }

      rst.push(node);
    });

    return <div ref={this.saveRef('navTabsContainer')}>{rst}</div>;
  },
};
