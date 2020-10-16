import { defineComponent, inject } from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import inputProps from './inputProps';
import { hasProp, getOptionProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { fixControlledValue, resolveOnChange } from './Input';
import PropTypes, { withUndefined } from '../_util/vue-types';

const TextAreaProps = {
  ...inputProps,
  autosize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
  autoSize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
};

export default defineComponent({
  name: 'ATextarea',
  inheritAttrs: false,
  props: {
    ...TextAreaProps,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      resizableTextArea: null,
      clearableInput: null,
    };
  },
  data() {
    const value = typeof this.value === 'undefined' ? this.defaultValue : this.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  watch: {
    value(val) {
      this.stateValue = val;
    },
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
    setValue(value: any, callback?: Function) {
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      } else {
        this.$forceUpdate();
      }
      this.$nextTick(() => {
        callback && callback();
      });
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    triggerChange(e: Event) {
      this.$emit('update:value', (e.target as any).value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleChange(e: Event) {
      const { value, composing, isComposing } = e.target as any;
      if (((isComposing || composing) && this.lazy) || this.stateValue === value) return;

      this.setValue((e.target as any).value, () => {
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
    saveTextArea(resizableTextArea: any) {
      this.resizableTextArea = resizableTextArea;
    },

    saveClearableInput(clearableInput: any) {
      this.clearableInput = clearableInput;
    },
    handleReset(e: Event) {
      this.setValue('', () => {
        this.resizableTextArea.renderTextArea();
        this.focus();
      });
      resolveOnChange(this.resizableTextArea.textArea, e, this.triggerChange);
    },

    renderTextArea(prefixCls: string) {
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

    const props: any = {
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
});
