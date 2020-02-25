import PropTypes from '../_util/vue-types';
import { getStyle, getComponentFromProp, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

function noop() {}

export default {
  mixins: [BaseMixin],
  props: {
    duration: PropTypes.number.def(1.5),
    closable: PropTypes.bool,
    prefixCls: PropTypes.string,
    update: PropTypes.bool,
    closeIcon: PropTypes.any,
  },
  watch: {
    duration() {
      this.restartCloseTimer();
    },
  },

  mounted() {
    this.startCloseTimer();
  },
  updated() {
    if (this.update) {
      this.restartCloseTimer();
    }
  },

  beforeDestroy() {
    this.clearCloseTimer();
    this.willDestroy = true; // beforeDestroy调用后依然会触发onMouseleave事件
  },
  methods: {
    close(e) {
      if (e) {
        e.stopPropagation();
      }
      this.clearCloseTimer();
      this.__emit('close');
    },

    startCloseTimer() {
      this.clearCloseTimer();
      if (!this.willDestroy && this.duration) {
        this.closeTimer = setTimeout(() => {
          this.close();
        }, this.duration * 1000);
      }
    },

    clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    restartCloseTimer() {
      this.clearCloseTimer();
      this.startCloseTimer();
    },
  },

  render() {
    const { prefixCls, closable, clearCloseTimer, startCloseTimer, $slots, close } = this;
    const componentClass = `${prefixCls}-notice`;
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: closable,
    };
    const style = getStyle(this);
    const closeIcon = getComponentFromProp(this, 'closeIcon');
    return (
      <div
        class={className}
        style={style || { right: '50%' }}
        onMouseenter={clearCloseTimer}
        onMouseleave={startCloseTimer}
        onClick={getListeners(this).click || noop}
      >
        <div class={`${componentClass}-content`}>{$slots.default}</div>
        {closable ? (
          <a tabIndex="0" onClick={close} class={`${componentClass}-close`}>
            {closeIcon || <span class={`${componentClass}-close-x`} />}
          </a>
        ) : null}
      </div>
    );
  },
};
