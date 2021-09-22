import { defineComponent, inject, nextTick } from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import inputProps from './inputProps';
import { hasProp, getOptionProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { fixControlledValue, resolveOnChange } from './Input';
import classNames from '../_util/classNames';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { useInjectFormItemContext } from '../form/FormItemContext';

const TextAreaProps = {
  ...inputProps,
  autosize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
  autoSize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
  showCount: PropTypes.looseBool,
  onCompositionstart: PropTypes.func,
  onCompositionend: PropTypes.func,
};

export default defineComponent({
  name: 'ATextarea',
  inheritAttrs: false,
  props: {
    ...TextAreaProps,
  },
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      resizableTextArea: null,
      clearableInput: null,
      formItemContext,
    };
  },
  data() {
    const value = typeof this.value === 'undefined' ? this.defaultValue : this.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  watch: {
    value(val: string) {
      this.stateValue = val;
    },
  },
  mounted() {
    nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.focus();
        }
      }
    });
  },
  methods: {
    setValue(value: string, callback?: Function) {
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      } else {
        (this as any).$forceUpdate();
      }
      nextTick(() => {
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
      this.formItemContext.onFieldChange();
    },
    handleChange(e: Event) {
      const { value, composing, isComposing } = e.target as any;
      if (((isComposing || composing) && this.lazy) || this.stateValue === value) return;

      this.setValue((e.target as HTMLTextAreaElement).value, () => {
        this.resizableTextArea?.resizeTextarea();
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

    saveClearableInput(clearableInput: HTMLTextAreaElement) {
      this.clearableInput = clearableInput;
    },
    handleReset(e: Event) {
      this.setValue('', () => {
        this.resizableTextArea.renderTextArea();
        this.focus();
      });
      resolveOnChange(this.resizableTextArea.textArea, e, this.triggerChange);
    },
    handleBlur(e: Event) {
      this.$emit('blur', e);
      this.formItemContext.onFieldBlur();
    },

    renderTextArea(prefixCls: string) {
      const props = getOptionProps(this);
      const { style, class: customClass } = this.$attrs;
      const resizeProps = {
        ...props,
        ...this.$attrs,
        style: !props.showCount && style,
        class: !props.showCount && customClass,
        showCount: null,
        prefixCls,
        onInput: this.handleChange,
        onChange: this.handleChange,
        onKeydown: this.handleKeyDown,
      };
      return (
        <ResizableTextArea
          {...resizeProps}
          id={resizeProps.id ?? this.formItemContext.id.value}
          ref={this.saveTextArea}
        />
      );
    },
  },
  render() {
    const { stateValue, prefixCls: customizePrefixCls, maxlength, showCount } = this;
    const { style, class: customClass } = this.$attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    let value = fixControlledValue(stateValue) as string;
    // Max length value
    const hasMaxlength = Number(maxlength) > 0;
    value = hasMaxlength ? value.slice(0, maxlength) : value;
    const props: any = {
      ...getOptionProps(this),
      ...this.$attrs,
      prefixCls,
      inputType: 'text',
      element: this.renderTextArea(prefixCls),
      handleReset: this.handleReset,
    };

    let textareaNode = (
      <ClearableLabeledInput {...props} value={value} ref={this.saveClearableInput} />
    );

    if (showCount) {
      const valueLength = [...value].length;
      const dataCount = `${valueLength}${hasMaxlength ? ` / ${maxlength}` : ''}`;
      textareaNode = (
        <div
          class={classNames(
            `${prefixCls}-textarea`,
            `${prefixCls}-textarea-show-count`,
            customClass,
          )}
          style={style}
          data-count={dataCount}
        >
          {textareaNode}
        </div>
      );
    }
    return textareaNode;
  },
});
