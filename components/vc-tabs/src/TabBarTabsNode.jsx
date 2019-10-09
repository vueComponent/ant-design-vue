import warning from 'warning';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, getComponentFromProp } from '../../_util/props-util';
import { isVertical } from './utils';
function noop() {}
export default {
  name: 'TabBarTabsNode',
  mixins: [BaseMixin],
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
  },
  render() {
    const {
      panels: children,
      activeKey,
      prefixCls,
      tabBarGutter,
      saveRef,
      tabBarPosition,
    } = this.$props;
    const rst = [];
    const renderTabBarNode = this.renderTabBarNode || this.$scopedSlots.renderTabBarNode;
    children.forEach((child, index) => {
      if (!child) {
        return;
      }
      const props = getOptionProps(child);
      const key = child.key;
      let cls = activeKey === key ? `${prefixCls}-tab-active` : '';
      cls += ` ${prefixCls}-tab`;
      const events = { on: {} };
      const disabled = props.disabled || props.disabled === '';
      if (disabled) {
        cls += ` ${prefixCls}-tab-disabled`;
      } else {
        events.on.click = () => {
          this.__emit('tabClick', key);
        };
      }
      const directives = [];
      if (activeKey === key) {
        directives.push({
          name: 'ant-ref',
          value: saveRef('activeTab'),
        });
      }
      const tab = getComponentFromProp(child, 'tab');
      let gutter = tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter;
      gutter = typeof gutter === 'number' ? `${gutter}px` : gutter;
      const style = {
        [isVertical(tabBarPosition) ? 'marginBottom' : 'marginRight']: gutter,
      };
      warning(tab !== undefined, 'There must be `tab` property or slot on children of Tabs.');
      let node = (
        <div
          role="tab"
          aria-disabled={disabled ? 'true' : 'false'}
          aria-selected={activeKey === key ? 'true' : 'false'}
          {...events}
          class={cls}
          key={key}
          style={style}
          {...{ directives: directives }}
        >
          {tab}
        </div>
      );
      if (renderTabBarNode) {
        node = renderTabBarNode(node);
      }

      rst.push(node);
    });

    return (
      <div
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.saveRef('navTabsContainer'),
            },
          ],
        }}
      >
        {rst}
      </div>
    );
  },
};
