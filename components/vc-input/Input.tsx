// base 0.0.1-alpha.7
import type { ComponentPublicInstance } from 'vue';
import { computed, onMounted, defineComponent, nextTick, shallowRef, watch } from 'vue';
import classNames from '../_util/classNames';
import type { ChangeEvent, FocusEventHandler } from '../_util/EventInterface';
import omit from '../_util/omit';
import type { InputProps } from './inputProps';
import { inputProps } from './inputProps';
import type { InputFocusOptions } from './utils/commonUtils';
import {
  fixControlledValue,
  hasAddon,
  hasPrefixSuffix,
  resolveOnChange,
  triggerFocus,
} from './utils/commonUtils';
import BaseInput from './BaseInput';
import BaseInputCore, { type BaseInputExpose } from '../_util/BaseInput';

export default defineComponent({
  name: 'VCInput',
  inheritAttrs: false,
  props: inputProps(),
  setup(props, { slots, attrs, expose, emit }) {
    const stateValue = shallowRef(props.value === undefined ? props.defaultValue : props.value);
    const focused = shallowRef(false);
    const inputRef = shallowRef<BaseInputExpose>();
    const rootRef = shallowRef<ComponentPublicInstance>();
    watch(
      () => props.value,
      () => {
        stateValue.value = props.value;
      },
    );
    watch(
      () => props.disabled,
      () => {
        if (props.disabled) {
          focused.value = false;
        }
      },
    );
    const focus = (option?: InputFocusOptions) => {
      if (inputRef.value) {
        triggerFocus(inputRef.value.input, option);
      }
    };

    const blur = () => {
      inputRef.value.input?.blur();
    };

    const setSelectionRange = (
      start: number,
      end: number,
      direction?: 'forward' | 'backward' | 'none',
    ) => {
      inputRef.value.input?.setSelectionRange(start, end, direction);
    };

    const select = () => {
      inputRef.value.input?.select();
    };

    expose({
      focus,
      blur,
      input: computed(() => (inputRef.value.input as any)?.input),
      stateValue,
      setSelectionRange,
      select,
    });
    const triggerChange = (e: Event) => {
      emit('change', e);
    };
    const setValue = (value: string | number, callback?: Function) => {
      if (stateValue.value === value) {
        return;
      }
      if (props.value === undefined) {
        stateValue.value = value;
      } else {
        nextTick(() => {
          if (inputRef.value.input.value !== stateValue.value) {
            rootRef.value?.$forceUpdate();
          }
        });
      }
      nextTick(() => {
        callback && callback();
      });
    };
    const handleChange = (e: ChangeEvent) => {
      const { value } = e.target as any;
      if (stateValue.value === value) return;
      const newVal = e.target.value;
      resolveOnChange(inputRef.value.input as HTMLInputElement, e, triggerChange);
      setValue(newVal);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        emit('pressEnter', e);
      }
      emit('keydown', e);
    };

    const handleFocus: FocusEventHandler = e => {
      focused.value = true;
      emit('focus', e);
    };

    const handleBlur: FocusEventHandler = e => {
      focused.value = false;
      emit('blur', e);
    };

    const handleReset = (e: MouseEvent) => {
      resolveOnChange(inputRef.value.input as HTMLInputElement, e, triggerChange);
      setValue('', () => {
        focus();
      });
    };

    const getInputElement = () => {
      const {
        addonBefore = slots.addonBefore,
        addonAfter = slots.addonAfter,
        disabled,
        valueModifiers = {},
        htmlSize,
        autocomplete,
        prefixCls,
        inputClassName,
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        allowClear,
        type = 'text',
      } = props;
      const otherProps = omit(props as InputProps & { placeholder: string }, [
        'prefixCls',
        'onPressEnter',
        'addonBefore',
        'addonAfter',
        'prefix',
        'suffix',
        'allowClear',
        // Input elements must be either controlled or uncontrolled,
        // specify either the value prop, or the defaultValue prop, but not both.
        'defaultValue',
        'size',
        'bordered',
        'htmlSize',
        'lazy',
        'showCount',
        'valueModifiers',
        'showCount',
        'affixWrapperClassName',
        'groupClassName',
        'inputClassName',
        'wrapperClassName',
      ]);
      const inputProps = {
        ...otherProps,
        ...attrs,
        autocomplete,
        onChange: handleChange,
        onInput: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeyDown,
        class: classNames(
          prefixCls,
          {
            [`${prefixCls}-disabled`]: disabled,
          },
          inputClassName,
          !hasAddon({ addonAfter, addonBefore }) &&
            !hasPrefixSuffix({ prefix, suffix, allowClear }) &&
            attrs.class,
        ),
        ref: inputRef,
        key: 'ant-input',
        size: htmlSize,
        type,
        lazy: props.lazy,
      };
      if (valueModifiers.lazy) {
        delete inputProps.onInput;
      }
      if (!inputProps.autofocus) {
        delete inputProps.autofocus;
      }
      const inputNode = <BaseInputCore {...omit(inputProps, ['size'])} />;
      return inputNode;
    };
    const getSuffix = () => {
      const { maxlength, suffix = slots.suffix?.(), showCount, prefixCls } = props;
      // Max length value
      const hasMaxLength = Number(maxlength) > 0;

      if (suffix || showCount) {
        const valueLength = [...fixControlledValue(stateValue.value)].length;
        const dataCount =
          typeof showCount === 'object'
            ? showCount.formatter({ count: valueLength, maxlength })
            : `${valueLength}${hasMaxLength ? ` / ${maxlength}` : ''}`;

        return (
          <>
            {!!showCount && (
              <span
                class={classNames(`${prefixCls}-show-count-suffix`, {
                  [`${prefixCls}-show-count-has-suffix`]: !!suffix,
                })}
              >
                {dataCount}
              </span>
            )}
            {suffix}
          </>
        );
      }
      return null;
    };
    onMounted(() => {
      if (process.env.NODE_ENV === 'test') {
        if (props.autofocus) {
          focus();
        }
      }
    });
    return () => {
      const { prefixCls, disabled, ...rest } = props;
      return (
        <BaseInput
          {...rest}
          {...attrs}
          ref={rootRef}
          prefixCls={prefixCls}
          inputElement={getInputElement()}
          handleReset={handleReset}
          value={fixControlledValue(stateValue.value)}
          focused={focused.value}
          triggerFocus={focus}
          suffix={getSuffix()}
          disabled={disabled}
          v-slots={slots}
        />
      );
    };
  },
});
