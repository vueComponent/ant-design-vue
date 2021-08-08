import classNames from '../../_util/classNames';
import { initDefaultProps, getSlot } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import warning from '../../_util/warning';
import BaseMixin from '../../_util/BaseMixin';
import { ITouchProps } from './PropTypes';
import { defineComponent } from 'vue';
import supportsPassive from '../../_util/supportsPassive';

export default defineComponent({
  name: 'TouchFeedback',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(ITouchProps, {
    disabled: false,
  }),
  data() {
    this.child = null;
    return {
      active: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.disabled && this.active) {
        this.setState({
          active: false,
        });
      }
    });
  },
  methods: {
    triggerEvent(type, isActive, ev) {
      const eventType = `on${type}`;
      const { child } = this;

      if (child.props[eventType]) {
        child.props[eventType](ev);
      }
      if (isActive !== this.active) {
        this.setState({
          active: isActive,
        });
      }
    },
    onTouchStart(e) {
      this.triggerEvent('Touchstart', true, e);
    },
    onTouchMove(e) {
      this.triggerEvent('Touchmove', false, e);
    },
    onTouchEnd(e) {
      this.triggerEvent('Touchend', false, e);
    },
    onTouchCancel(e) {
      this.triggerEvent('Touchcancel', false, e);
    },
    onMouseDown(e) {
      // pc simulate mobile
      this.triggerEvent('Mousedown', true, e);
    },
    onMouseUp(e) {
      this.triggerEvent('Mouseup', false, e);
    },
    onMouseLeave(e) {
      this.triggerEvent('Mouseleave', false, e);
    },
  },
  render() {
    const { disabled, activeClassName = '', activeStyle = {} } = this.$props;

    let child = getSlot(this);
    if (child.length !== 1) {
      warning(false, 'm-feedback组件只能包含一个子元素');
      return null;
    }
    const events = disabled
      ? undefined
      : {
          [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: this.onTouchStart,
          [supportsPassive ? 'onTouchmovePassive' : 'onTouchmove']: this.onTouchMove,
          onTouchend: this.onTouchEnd,
          onTouchcancel: this.onTouchCancel,
          onMousedown: this.onMouseDown,
          onMouseup: this.onMouseUp,
          onMouseleave: this.onMouseLeave,
        };

    child = child[0];
    this.child = child;
    if (!disabled && this.active) {
      let { style, class: className } = child.props;

      if (activeStyle !== false) {
        if (activeStyle) {
          style = { ...style, ...activeStyle };
        }
        className = classNames(className, activeClassName);
      }
      return cloneElement(child, {
        class: className,
        style,
        ...events,
      });
    }

    return cloneElement(child, events);
  },
});
