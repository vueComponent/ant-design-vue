import classNames from 'classnames';
import omit from 'omit.js';
import ResizeObserver from 'resize-observer-polyfill';
import inputProps from './inputProps';
import calculateNodeHeight from './calculateNodeHeight';
import hasProp from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

function onNextFrame(cb) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 1);
}

function clearNextFrameAction(nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId);
  } else {
    window.clearTimeout(nextFrameId);
  }
}
function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}
function noop() {}

export default {
  name: 'ATextarea',
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
    autosize: [Object, Boolean],
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const { value, defaultValue } = this.$props;
    return {
      stateValue: fixControlledValue(!hasProp(this, 'value') ? defaultValue : value),
      nextFrameActionId: undefined,
      textareaStyles: {},
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.$nextTick(() => {
        this.resizeOnNextFrame();
      });
      this.stateValue = fixControlledValue(val);
    },
    autosize(val) {
      if (!val && this.$refs.textArea) {
        this.textareaStyles = omit(this.textareaStyles, ['overflowY']);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeTextarea();
      this.updateResizeObserverHook();
      if (this.autoFocus) {
        this.focus();
      }
    });
  },
  updated() {
    this.updateResizeObserverHook();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    resizeOnNextFrame() {
      if (this.nextFrameActionId) {
        clearNextFrameAction(this.nextFrameActionId);
      }
      this.nextFrameActionId = onNextFrame(this.resizeTextarea);
    },
    // We will update hooks if `autosize` prop change
    updateResizeObserverHook() {
      if (!this.resizeObserver && this.$props.autosize) {
        // Add resize observer
        this.resizeObserver = new ResizeObserver(this.resizeOnNextFrame);
        this.resizeObserver.observe(this.$refs.textArea);
      } else if (this.resizeObserver && !this.$props.autosize) {
        // Remove resize observer
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    resizeTextarea() {
      const { autosize } = this.$props;
      if (!autosize || !this.$refs.textArea) {
        return;
      }
      const { minRows, maxRows } = autosize;
      const textareaStyles = calculateNodeHeight(this.$refs.textArea, false, minRows, maxRows);
      this.textareaStyles = textareaStyles;
    },

    handleTextareaChange(e) {
      if (!hasProp(this, 'value')) {
        this.stateValue = e.target.value;
        this.resizeTextarea();
      } else {
        this.$forceUpdate();
      }
      if (!e.target.composing) {
        this.$emit('change.value', e.target.value);
      }
      this.$emit('change', e);
      this.$emit('input', e);
    },

    focus() {
      this.$refs.textArea.focus();
    },

    blur() {
      this.$refs.textArea.blur();
    },
  },
  render() {
    const {
      stateValue,
      handleKeyDown,
      handleTextareaChange,
      textareaStyles,
      $attrs,
      $listeners,
      prefixCls: customizePrefixCls,
      disabled,
    } = this;
    const otherProps = omit(this.$props, [
      'prefixCls',
      'autosize',
      'type',
      'value',
      'defaultValue',
    ]);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);

    const cls = classNames(prefixCls, {
      [`${prefixCls}-disabled`]: disabled,
    });

    const textareaProps = {
      attrs: { ...otherProps, ...$attrs },
      on: {
        ...$listeners,
        keydown: handleKeyDown,
        input: handleTextareaChange,
        change: noop,
      },
    };
    if ($listeners['change.value']) {
      textareaProps.directives = [{ name: 'ant-input' }];
    }
    return (
      <textarea
        {...textareaProps}
        value={stateValue}
        class={cls}
        style={textareaStyles}
        ref="textArea"
      />
    );
  },
};
