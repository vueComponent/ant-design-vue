import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import inputProps from './inputProps';
import hasProp, { getListeners, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { fixControlledValue, resolveOnChange } from './Input';
import PropTypes from '../_util/vue-types';

const TextAreaProps = {
  ...inputProps,
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean]),
};

export default {
  name: 'ATextarea',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...TextAreaProps,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const value = typeof this.value === 'undefined' ? this.defaultValue : this.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.stateValue = val;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.focus();
      }
    });
  },
  methods: {
    setValue(value, callback) {
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
        this.$nextTick(() => {
          callback && callback();
        });
      } else {
        // 不在严格受控
        // https://github.com/vueComponent/ant-design-vue/issues/2207，modal 是 新 new 实例，更新队列和当前不在同一个更新队列中
        // this.$forceUpdate();
      }
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    onChange(e) {
      this.$emit('change.value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleChange(e) {
      const { value, composing } = e.target;
      if (((e.isComposing || composing) && this.lazy) || this.stateValue === value) return;

      this.setValue(e.target.value, () => {
        this.$refs.resizableTextArea.resizeTextarea();
      });
      resolveOnChange(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
    },

    focus() {
      this.$refs.resizableTextArea.$refs.textArea.focus();
    },

    blur() {
      this.$refs.resizableTextArea.$refs.textArea.blur();
    },
    handleReset(e) {
      this.setValue('', () => {
        this.$refs.resizableTextArea.renderTextArea();
        this.focus();
      });
      resolveOnChange(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
    },

    renderTextArea(prefixCls) {
      const props = getOptionProps(this);
      const resizeProps = {
        props: {
          ...props,
          prefixCls,
        },
        on: {
          ...getListeners(this),
          input: this.handleChange,
          keydown: this.handleKeyDown,
        },
        attrs: this.$attrs,
      };
      return <ResizableTextArea {...resizeProps} ref="resizableTextArea" />;
    },
  },
  render() {
    const { stateValue, prefixCls: customizePrefixCls } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);

    const props = {
      props: {
        ...getOptionProps(this),
        prefixCls,
        inputType: 'text',
        value: fixControlledValue(stateValue),
        element: this.renderTextArea(prefixCls),
        handleReset: this.handleReset,
      },
      on: getListeners(this),
    };
    return <ClearableLabeledInput {...props} />;
  },
};
