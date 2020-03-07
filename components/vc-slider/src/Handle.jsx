import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, getListeners } from '../../_util/props-util';
import addEventListener from '../../vc-util/Dom/addEventListener';

export default {
  name: 'Handle',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.bool,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    reverse: PropTypes.bool,
    // handleFocus: PropTypes.func.def(noop),
    // handleBlur: PropTypes.func.def(noop),
  },
  data() {
    return {
      clickFocused: false,
    };
  },
  mounted() {
    // mouseup won't trigger if mouse moved out of handle
    // so we listen on document here.
    this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp);
  },
  beforeDestroy() {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
  },
  methods: {
    setClickFocus(focused) {
      this.setState({ clickFocused: focused });
    },
    handleMouseUp() {
      if (document.activeElement === this.$refs.handle) {
        this.setClickFocus(true);
      }
    },
    handleBlur(e) {
      this.setClickFocus(false);
      this.__emit('blur', e);
    },
    handleKeyDown() {
      this.setClickFocus(false);
    },
    clickFocus() {
      this.setClickFocus(true);
      this.focus();
    },
    focus() {
      this.$refs.handle.focus();
    },
    blur() {
      this.$refs.handle.blur();
    },
    // when click can not focus in vue, use mousedown trigger focus
    handleMousedown(e) {
      this.focus();
      this.__emit('mousedown', e);
    },
  },
  render() {
    const {
      prefixCls,
      vertical,
      reverse,
      offset,
      disabled,
      min,
      max,
      value,
      tabIndex,
    } = getOptionProps(this);
    const className = classNames(this.$props.className, {
      [`${prefixCls}-handle-click-focused`]: this.clickFocused,
    });

    const positionStyle = vertical
      ? {
          [reverse ? 'top' : 'bottom']: `${offset}%`,
          [reverse ? 'bottom' : 'top']: 'auto',
          transform: `translateY(+50%)`,
        }
      : {
          [reverse ? 'right' : 'left']: `${offset}%`,
          [reverse ? 'left' : 'right']: 'auto',
          transform: `translateX(${reverse ? '+' : '-'}50%)`,
        };

    const ariaProps = {
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': value,
      'aria-disabled': !!disabled,
    };
    let _tabIndex = tabIndex || 0;
    if (disabled || tabIndex === null) {
      _tabIndex = null;
    }

    const handleProps = {
      attrs: {
        role: 'slider',
        tabIndex: _tabIndex,
        ...ariaProps,
      },
      class: className,
      on: {
        ...getListeners(this),
        blur: this.handleBlur,
        keydown: this.handleKeyDown,
        mousedown: this.handleMousedown,
      },
      ref: 'handle',
      style: positionStyle,
    };
    return <div {...handleProps} />;
  },
};
