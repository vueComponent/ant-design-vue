import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import { textAreaProps } from './inputProps';
import type { InputFocusOptions } from './Input';
import { fixControlledValue, resolveOnChange, triggerFocus } from './Input';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form/FormItemContext';
import type { FocusEventHandler } from '../_util/EventInterface';
import useConfigInject from '../_util/hooks/useConfigInject';
import omit from '../_util/omit';

function fixEmojiLength(value: string, maxLength: number) {
  return [...(value || '')].slice(0, maxLength).join('');
}

export default defineComponent({
  name: 'ATextarea',
  inheritAttrs: false,
  props: textAreaProps,
  setup(props, { attrs, expose, emit }) {
    const formItemContext = useInjectFormItemContext();
    const stateValue = ref(props.value === undefined ? props.defaultValue : props.value);
    const resizableTextArea = ref();
    const { prefixCls, size, direction } = useConfigInject('input', props);
    const showCount = computed(() => {
      return (props.showCount as any) === '' || props.showCount || false;
    });
    // Max length value
    const hasMaxLength = computed(() => Number(props.maxlength) > 0);
    const compositing = ref(false);
    const instance = getCurrentInstance();
    watch(
      () => props.value,
      () => {
        if ('value' in instance.vnode.props || {}) {
          stateValue.value = props.value ?? '';
        }
      },
    );

    const focus = (option?: InputFocusOptions) => {
      triggerFocus(resizableTextArea.value?.textArea, option);
    };

    const blur = () => {
      resizableTextArea.value?.textArea?.blur();
    };

    const setValue = (value: string | number, callback?: Function) => {
      if (stateValue.value === value) {
        return;
      }
      if (props.value === undefined) {
        stateValue.value = value;
      } else {
        resizableTextArea.value?.instance.update?.();
      }
      nextTick(() => {
        callback && callback();
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        emit('pressEnter', e);
      }
      emit('keydown', e);
    };

    const onBlur: FocusEventHandler = e => {
      const { onBlur } = props;
      onBlur?.(e);
      formItemContext.onFieldBlur();
    };
    const triggerChange = (e: Event) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };

    const handleReset = (e: MouseEvent) => {
      resolveOnChange(resizableTextArea.value.textArea, e, triggerChange);
      setValue('', () => {
        focus();
      });
    };

    const handleChange = (e: Event) => {
      const { value, composing } = e.target as any;
      compositing.value = (e as any).isComposing || composing;
      if ((compositing.value && props.lazy) || stateValue.value === value) return;
      let triggerValue = (e.currentTarget as any).value;
      if (hasMaxLength.value) {
        triggerValue = fixEmojiLength(triggerValue, props.maxlength!);
      }
      resolveOnChange(e.currentTarget as any, e, triggerChange, triggerValue);
      setValue(triggerValue);
    };
    const renderTextArea = () => {
      const { style, class: customClass } = attrs;
      const { bordered = true } = props;
      const resizeProps = {
        ...omit(props, ['allowClear']),
        ...attrs,
        style: showCount.value ? {} : style,
        class: {
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${customClass}`]: customClass && !showCount.value,
          [`${prefixCls.value}-sm`]: size.value === 'small',
          [`${prefixCls.value}-lg`]: size.value === 'large',
        },
        showCount: null,
        prefixCls: prefixCls.value,
        onInput: handleChange,
        onChange: handleChange,
        onBlur,
        onKeydown: handleKeyDown,
      };
      if (props.valueModifiers?.lazy) {
        delete resizeProps.onInput;
      }
      return (
        <ResizableTextArea
          {...resizeProps}
          id={resizeProps.id ?? formItemContext.id.value}
          ref={resizableTextArea}
          maxlength={props.maxlength}
        />
      );
    };

    onMounted(() => {
      if (process.env.NODE_ENV === 'test') {
        if (props.autofocus) {
          focus();
        }
      }
    });
    expose({
      focus,
      blur,
      resizableTextArea,
    });
    const mergedValue = ref('');
    watchEffect(() => {
      let val = fixControlledValue(stateValue.value) as string;
      if (
        !compositing.value &&
        hasMaxLength.value &&
        (props.value === null || props.value === undefined)
      ) {
        // fix #27612 将value转为数组进行截取，解决 '😂'.length === 2 等emoji表情导致的截取乱码的问题
        val = fixEmojiLength(val, props.maxlength);
      }
      mergedValue.value = val;
    });
    return () => {
      const { maxlength, bordered = true } = props;
      const { style, class: customClass } = attrs;

      const inputProps: any = {
        ...props,
        ...attrs,
        prefixCls: prefixCls.value,
        inputType: 'text',
        handleReset,
        direction: direction.value,
        bordered,
        style: showCount.value ? undefined : style,
      };

      let textareaNode = (
        <ClearableLabeledInput
          {...inputProps}
          value={mergedValue.value}
          v-slots={{ element: renderTextArea }}
        />
      );

      if (showCount.value) {
        const valueLength = [...mergedValue.value].length;
        let dataCount = '';
        if (typeof showCount.value === 'object') {
          dataCount = showCount.value.formatter({ count: valueLength, maxlength });
        } else {
          dataCount = `${valueLength}${hasMaxLength.value ? ` / ${maxlength}` : ''}`;
        }
        textareaNode = (
          <div
            class={classNames(
              `${prefixCls.value}-textarea`,
              {
                [`${prefixCls.value}-textarea-rtl`]: direction.value === 'rtl',
              },
              `${prefixCls.value}-textarea-show-count`,
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
    };
  },
});
