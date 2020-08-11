import { inject } from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import inputProps from './inputProps';
import { hasProp, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import { fixControlledValue, resolveOnChange } from './Input';
import PropTypes from '../_util/vue-types';
import syncWatch from '../_util/syncWatch';

const TextAreaProps = {
  ...inputProps,
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean]),
};

export default {
  name: 'ATextarea',
  inheritAttrs: false,
  props: {
    ...TextAreaProps,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    const value = typeof this.value === 'undefined' ? this.defaultValue : this.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  watch: {
    value: syncWatch(function(val) {
      this.stateValue = val;
    }),
  },
  mounted() {
    this.$nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.focus();
        }
      }
    });
  },
  methods: {
    setValue(value, callback) {
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      } else {
        this.$forceUpdate();
      }
      this.$nextTick(() => {
        callback && callback();
      });
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    triggerChange(e) {
      this.$emit('update:value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleChange(e) {
      const { value, composing } = e.target;
      if (((e.isComposing || composing) && this.lazy) || this.stateValue === value) return;

      this.setValue(e.target.value, () => {
        this.resizableTextArea.resizeTextarea();
      });
      resolveOnChange(this.resizableTextArea.textArea, e, this.triggerChange);
    },

    focus() {
      this.resizableTextArea.textArea.focus();
    },

    blur() {
      this.resizableTextArea.textArea.blur();
    },
    saveTextArea(resizableTextArea) {
      this.resizableTextArea = resizableTextArea;
    },

    saveClearableInput(clearableInput) {
      this.clearableInput = clearableInput;
    },
    handleReset(e) {
      this.setValue('', () => {
        this.resizableTextArea.renderTextArea();
        this.focus();
      });
      resolveOnChange(this.resizableTextArea.textArea, e, this.triggerChange);
    },

    renderTextArea(prefixCls) {
      const props = getOptionProps(this);
      const resizeProps = {
        ...props,
        ...this.$attrs,
        prefixCls,
        onInput: this.handleChange,
        onChange: this.handleChange,
        onKeydown: this.handleKeyDown,
      };
      return <ResizableTextArea {...resizeProps} ref={this.saveTextArea} />;
    },
  },
  render() {
    const { stateValue, prefixCls: customizePrefixCls } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);

    const props = {
      ...getOptionProps(this),
      ...this.$attrs,
      prefixCls,
      inputType: 'text',
      value: fixControlledValue(stateValue),
      element: this.renderTextArea(prefixCls),
      handleReset: this.handleReset,
    };
    return <ClearableLabeledInput {...props} ref={this.saveClearableInput} />;
  },
};
