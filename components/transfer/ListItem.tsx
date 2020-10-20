import PropTypes, { withUndefined } from '../_util/vue-types';
import classNames from '../_util/classNames';
import Lazyload from '../vc-lazy-load';
import Checkbox from '../checkbox';
import { defineComponent } from 'vue';

function noop() {}

export default defineComponent({
  name: 'ListItem',
  inheritAttrs: false,
  props: {
    renderedText: PropTypes.any,
    renderedEl: PropTypes.any,
    item: PropTypes.any,
    lazy: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
    checked: PropTypes.looseBool,
    prefixCls: PropTypes.string,
    disabled: PropTypes.looseBool,
    onClick: PropTypes.func,
  },
  render() {
    const { renderedText, renderedEl, item, lazy, checked, disabled, prefixCls } = this.$props;

    const className = classNames({
      [`${prefixCls}-content-item`]: true,
      [`${prefixCls}-content-item-disabled`]: disabled || item.disabled,
    });

    let title;
    if (typeof renderedText === 'string' || typeof renderedText === 'number') {
      title = String(renderedText);
    }

    const listItem = (
      <li
        class={className}
        title={title}
        onClick={
          disabled || item.disabled
            ? noop
            : () => {
                this.$emit('click', item);
              }
        }
      >
        <Checkbox checked={checked} disabled={disabled || item.disabled} />
        <span class={`${prefixCls}-content-item-text`}>{renderedEl}</span>
      </li>
    );
    let children = null;
    if (lazy) {
      const lazyProps = {
        height: 32,
        offset: 500,
        throttle: 0,
        debounce: false,
        ...(lazy as any),
      };
      children = <Lazyload {...lazyProps}>{listItem}</Lazyload>;
    } else {
      children = listItem;
    }
    return children;
  },
});
