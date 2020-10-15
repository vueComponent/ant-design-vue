import PropTypes from '../_util/vue-types';
import { getComponent, getSlot } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    duration: PropTypes.number.def(1.5),
    closable: PropTypes.looseBool,
    prefixCls: PropTypes.string,
    update: PropTypes.looseBool,
    closeIcon: PropTypes.any,
    onClose: PropTypes.func,
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

  beforeUnmount() {
    this.clearCloseTimer();
    this.willDestroy = true; // beforeUnmount调用后依然会触发onMouseleave事件
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
    const { prefixCls, closable, clearCloseTimer, startCloseTimer, close, $attrs } = this;
    const componentClass = `${prefixCls}-notice`;
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: closable,
    };
    const closeIcon = getComponent(this, 'closeIcon');
    return (
      <div
        class={className}
        style={$attrs.style || { right: '50%' }}
        onMouseenter={clearCloseTimer}
        onMouseleave={startCloseTimer}
      >
        <div class={`${componentClass}-content`}>{getSlot(this)}</div>
        {closable ? (
          <a tabindex="0" onClick={close} class={`${componentClass}-close`}>
            {closeIcon || <span class={`${componentClass}-close-x`} />}
          </a>
        ) : null}
      </div>
    );
  },
};
