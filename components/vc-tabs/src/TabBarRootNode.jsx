import { cloneElement } from '../../_util/vnode';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getSlot } from '../../_util/props-util';
import { getDataAttr } from './utils';
function noop() {}
export default {
  name: 'TabBarRootNode',
  mixins: [BaseMixin],
  inheritAttrs: false,
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
    const { class: className, style, onKeydown, ...restProps } = this.$attrs;
    const cls = {
      [`${prefixCls}-bar`]: true,
      [className]: !!className,
    };
    const topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
    const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    const children = getSlot(this);
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
        tabindex="0"
        onKeydown={onKeyDown}
        style={style}
        ref={this.saveRef('root')}
        {...getDataAttr(restProps)}
      >
        {newChildren}
      </div>
    );
  },
};
