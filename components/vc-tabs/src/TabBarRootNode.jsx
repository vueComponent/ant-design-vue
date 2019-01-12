import { cloneElement } from '../../_util/vnode';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
function noop() {}
export default {
  name: 'TabBarRootNode',
  mixins: [BaseMixin],
  props: {
    saveRef: PropTypes.func.def(noop),
    getRef: PropTypes.func.def(noop),
    prefixCls: PropTypes.string.def(''),
    tabBarPosition: PropTypes.string.def('top'),
    extraContent: PropTypes.any,
  },
  methods: {
    onKeyDown(e) {
      this.__emit('keydown', e);
    },
  },
  render() {
    const { prefixCls, onKeyDown, tabBarPosition, extraContent } = this;
    const cls = {
      [`${prefixCls}-bar`]: true,
    };
    const topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
    const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    const children = this.$slots.default;
    let newChildren = children;
    if (extraContent) {
      newChildren = [
        cloneElement(extraContent, {
          key: 'extra',
          style: {
            ...tabBarExtraContentStyle,
          },
        }),
        cloneElement(children, { key: 'content' }),
      ];
      newChildren = topOrBottom ? newChildren : newChildren.reverse();
    }

    return (
      <div
        role="tablist"
        class={cls}
        tabIndex="0"
        onKeydown={onKeyDown}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.saveRef('root'),
            },
          ],
        }}
      >
        {newChildren}
      </div>
    );
  },
};
