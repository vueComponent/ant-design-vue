import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import Lazyload from '../vc-lazy-load';
import Checkbox from '../checkbox';

function noop() {}

export default {
  name: 'Item',
  props: {
    renderedText: PropTypes.any,
    renderedEl: PropTypes.any,
    item: PropTypes.any,
    lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    checked: PropTypes.bool,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
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
        <span>{renderedEl}</span>
      </li>
    );
    let children = null;
    if (lazy) {
      const lazyProps = {
        props: {
          height: 32,
          offset: 500,
          throttle: 0,
          debounce: false,
          ...lazy,
          _propsSymbol: Symbol(),
        },
      };
      children = <Lazyload {...lazyProps}>{listItem}</Lazyload>;
    } else {
      children = listItem;
    }
    return children;
  },
};
