import { defineComponent } from 'vue';
import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps } from '../../_util/props-util';
import addEventListener from '../../vc-util/Dom/addEventListener';

export default defineComponent({
  name: 'Handle',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.looseBool,
    offset: PropTypes.number,
    disabled: PropTypes.looseBool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reverse: PropTypes.looseBool,
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
  beforeUnmount() {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove();
    }
  },
  methods: {
    setHandleRef(node) {
      this.handle = node;
    },
    setClickFocus(focused) {
      this.setState({ clickFocused: focused });
    },
    handleMouseUp() {
      if (document.activeElement === this.handle) {
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
      this.handle.focus();
    },
    blur() {
      this.handle.blur();
    },
    // when click can not focus in vue, use mousedown trigger focus
    handleMousedown(e) {
      this.focus();
      this.__emit('mousedown', e);
    },
  },
  render() {
    const { prefixCls, vertical, reverse, offset, disabled, min, max, value, tabindex } =
      getOptionProps(this);
    const className = classNames(this.$attrs.class, {
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
    const elStyle = {
      ...this.$attrs.style,
      ...positionStyle,
    };
    let _tabIndex = tabindex || 0;
    if (disabled || tabindex === null) {
      _tabIndex = null;
    }

    const handleProps = {
      ...this.$attrs,
      role: 'slider',
      tabindex: _tabIndex,
      ...ariaProps,
      class: className,
      onBlur: this.handleBlur,
      onKeydown: this.handleKeyDown,
      onMousedown: this.handleMousedown,
      ref: this.setHandleRef,
      style: elStyle,
    };
    return <div {...handleProps} />;
  },
});
