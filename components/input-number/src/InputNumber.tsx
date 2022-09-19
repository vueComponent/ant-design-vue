// base rc-input-number@7.3.4
import type { DecimalClass, ValueType } from './utils/MiniDecimal';
import getMiniDecimal, { toFixed } from './utils/MiniDecimal';
import StepHandler from './StepHandler';
import { getNumberPrecision, num2str, validateNumber } from './utils/numberUtil';
import useCursor from './hooks/useCursor';
import useFrame from './hooks/useFrame';
import type { HTMLAttributes, PropType } from 'vue';
import { watch, computed, ref, defineComponent } from 'vue';
import type { ChangeEvent, KeyboardEventHandler } from '../../_util/EventInterface';
import KeyCode from '../../_util/KeyCode';
import classNames from '../../_util/classNames';

/**
 * We support `stringMode` which need handle correct type when user call in onChange
 * format max or min value
 * 1. if isInvalid return null
 * 2. if precision is undefined, return decimal
 * 3. format with precision
 *    I. if max > 0, round down with precision. Example: max= 3.5, precision=0  afterFormat: 3
 *    II. if max < 0, round up with precision. Example: max= -3.5, precision=0  afterFormat: -4
 *    III. if min > 0, round up with precision. Example: min= 3.5, precision=0  afterFormat: 4
 *    IV. if min < 0, round down with precision. Example: max= -3.5, precision=0  afterFormat: -3
 */
const getDecimalValue = (stringMode: boolean, decimalValue: DecimalClass) => {
  if (stringMode || decimalValue.isEmpty()) {
    return decimalValue.toString();
  }

  return decimalValue.toNumber();
};
const getDecimalIfValidate = (value: ValueType) => {
  const decimal = getMiniDecimal(value);
  return decimal.isInvalidate() ? null : decimal;
};

export const inputNumberProps = () => ({
  /** value will show as string */
  stringMode: { type: Boolean as PropType<boolean> },

  defaultValue: { type: [String, Number] as PropType<ValueType> },
  value: { type: [String, Number] as PropType<ValueType> },

  prefixCls: { type: String as PropType<string> },
  min: { type: [String, Number] as PropType<ValueType> },
  max: { type: [String, Number] as PropType<ValueType> },
  step: { type: [String, Number] as PropType<ValueType>, default: 1 },
  tabindex: { type: Number as PropType<number> },
  controls: { type: Boolean as PropType<boolean>, default: true },
  readonly: { type: Boolean as PropType<boolean> },
  disabled: { type: Boolean as PropType<boolean> },
  autofocus: { type: Boolean as PropType<boolean> },
  keyboard: { type: Boolean as PropType<boolean>, default: true },

  /** Parse display value to validate number */
  parser: { type: Function as PropType<(displayValue: string | undefined) => ValueType> },
  /** Transform `value` to display value show in input */
  formatter: {
    type: Function as PropType<
      (value: ValueType | undefined, info: { userTyping: boolean; input: string }) => string
    >,
  },
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision: { type: Number as PropType<number> },
  /** Syntactic sugar of `formatter`. Config decimal separator of display. */
  decimalSeparator: { type: String as PropType<string> },

  onInput: { type: Function as PropType<(text: string) => void> },
  onChange: { type: Function as PropType<(value: ValueType) => void> },
  onPressEnter: { type: Function as PropType<KeyboardEventHandler> },

  onStep: {
    type: Function as PropType<
      (value: ValueType, info: { offset: ValueType; type: 'up' | 'down' }) => void
    >,
  },
  onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
  onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'InnerInputNumber',
  inheritAttrs: false,
  props: {
    ...inputNumberProps(),
    lazy: Boolean,
  },
  slots: ['upHandler', 'downHandler'],
  setup(props, { attrs, slots, emit, expose }) {
    const inputRef = ref<HTMLInputElement>();
    const focus = ref(false);
    const userTypingRef = ref(false);
    const compositionRef = ref(false);
    const decimalValue = ref(getMiniDecimal(props.value));

    function setUncontrolledDecimalValue(newDecimal: DecimalClass) {
      if (props.value === undefined) {
        decimalValue.value = newDecimal;
      }
    }

    // ====================== Parser & Formatter ======================
    /**
     * `precision` is used for formatter & onChange.
     * It will auto generate by `value` & `step`.
     * But it will not block user typing.
     *
     * Note: Auto generate `precision` is used for legacy logic.
     * We should remove this since we already support high precision with BigInt.
     *
     * @param number  Provide which number should calculate precision
     * @param userTyping  Change by user typing
     */
    const getPrecision = (numStr: string, userTyping: boolean) => {
      if (userTyping) {
        return undefined;
      }

      if (props.precision >= 0) {
        return props.precision;
      }

      return Math.max(getNumberPrecision(numStr), getNumberPrecision(props.step));
    };

    // >>> Parser
    const mergedParser = (num: string | number) => {
      const numStr = String(num);

      if (props.parser) {
        return props.parser(numStr);
      }

      let parsedStr = numStr;
      if (props.decimalSeparator) {
        parsedStr = parsedStr.replace(props.decimalSeparator, '.');
      }

      // [Legacy] We still support auto convert `$ 123,456` to `123456`
      return parsedStr.replace(/[^\w.-]+/g, '');
    };

    // >>> Formatter
    const inputValue = ref<string | number>('');

    const mergedFormatter = (number: string, userTyping: boolean) => {
      if (props.formatter) {
        return props.formatter(number, { userTyping, input: String(inputValue.value) });
      }

      let str = typeof number === 'number' ? num2str(number) : number;

      // User typing will not auto format with precision directly
      if (!userTyping) {
        const mergedPrecision = getPrecision(str, userTyping);

        if (validateNumber(str) && (props.decimalSeparator || mergedPrecision >= 0)) {
          // Separator
          const separatorStr = props.decimalSeparator || '.';

          str = toFixed(str, separatorStr, mergedPrecision);
        }
      }

      return str;
    };
    // ========================== InputValue ==========================
    /**
     * Input text value control
     *
     * User can not update input content directly. It update with follow rules by priority:
     *  1. controlled `value` changed
     *    * [SPECIAL] Typing like `1.` should not immediately convert to `1`
     *  2. User typing with format (not precision)
     *  3. Blur or Enter trigger revalidate
     */
    const initValue = (() => {
      const initValue = props.value;
      if (decimalValue.value.isInvalidate() && ['string', 'number'].includes(typeof initValue)) {
        return Number.isNaN(initValue) ? '' : initValue;
      }
      return mergedFormatter(decimalValue.value.toString(), false);
    })();
    inputValue.value = initValue;

    // Should always be string
    function setInputValue(newValue: DecimalClass, userTyping: boolean) {
      inputValue.value = mergedFormatter(
        // Invalidate number is sometime passed by external control, we should let it go
        // Otherwise is controlled by internal interactive logic which check by userTyping
        // You can ref 'show limited value when input is not focused' test for more info.
        newValue.isInvalidate() ? newValue.toString(false) : newValue.toString(!userTyping),
        userTyping,
      );
    }

    // >>> Max & Min limit
    const maxDecimal = computed(() => getDecimalIfValidate(props.max));
    const minDecimal = computed(() => getDecimalIfValidate(props.min));

    const upDisabled = computed(() => {
      if (!maxDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }

      return maxDecimal.value.lessEquals(decimalValue.value);
    });

    const downDisabled = computed(() => {
      if (!minDecimal.value || !decimalValue.value || decimalValue.value.isInvalidate()) {
        return false;
      }

      return decimalValue.value.lessEquals(minDecimal.value);
    });

    // Cursor controller
    const [recordCursor, restoreCursor] = useCursor(inputRef, focus);

    // ============================= Data =============================
    /**
     * Find target value closet within range.
     * e.g. [11, 28]:
     *    3  => 11
     *    23 => 23
     *    99 => 28
     */
    const getRangeValue = (target: DecimalClass) => {
      // target > max
      if (maxDecimal.value && !target.lessEquals(maxDecimal.value)) {
        return maxDecimal.value;
      }

      // target < min
      if (minDecimal.value && !minDecimal.value.lessEquals(target)) {
        return minDecimal.value;
      }

      return null;
    };

    /**
     * Check value is in [min, max] range
     */
    const isInRange = (target: DecimalClass) => !getRangeValue(target);

    /**
     * Trigger `onChange` if value validated and not equals of origin.
     * Return the value that re-align in range.
     */
    const triggerValueUpdate = (newValue: DecimalClass, userTyping: boolean): DecimalClass => {
      let updateValue = newValue;

      let isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();

      // Skip align value when trigger value is empty.
      // We just trigger onChange(null)
      // This should not block user typing
      if (!updateValue.isEmpty() && !userTyping) {
        // Revert value in range if needed
        updateValue = getRangeValue(updateValue) || updateValue;
        isRangeValidate = true;
      }

      if (!props.readonly && !props.disabled && isRangeValidate) {
        const numStr = updateValue.toString();
        const mergedPrecision = getPrecision(numStr, userTyping);
        if (mergedPrecision >= 0) {
          updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));
        }

        // Trigger event
        if (!updateValue.equals(decimalValue.value)) {
          setUncontrolledDecimalValue(updateValue);
          props.onChange?.(
            updateValue.isEmpty() ? null : getDecimalValue(props.stringMode, updateValue),
          );

          // Reformat input if value is not controlled
          if (props.value === undefined) {
            setInputValue(updateValue, userTyping);
          }
        }

        return updateValue;
      }

      return decimalValue.value;
    };

    // ========================== User Input ==========================
    const onNextPromise = useFrame();

    // >>> Collect input value
    const collectInputValue = (inputStr: string) => {
      recordCursor();

      // Update inputValue incase input can not parse as number
      inputValue.value = inputStr;
      // Parse number
      if (!compositionRef.value) {
        const finalValue = mergedParser(inputStr);
        const finalDecimal = getMiniDecimal(finalValue);
        if (!finalDecimal.isNaN()) {
          triggerValueUpdate(finalDecimal, true);
        }
      }

      // Trigger onInput later to let user customize value if they want do handle something after onChange
      props.onInput?.(inputStr);

      // optimize for chinese input experience
      // https://github.com/ant-design/ant-design/issues/8196
      onNextPromise(() => {
        let nextInputStr = inputStr;
        if (!props.parser) {
          nextInputStr = inputStr.replace(/。/g, '.');
        }

        if (nextInputStr !== inputStr) {
          collectInputValue(nextInputStr);
        }
      });
    };

    // >>> Composition
    const onCompositionStart = () => {
      compositionRef.value = true;
    };

    const onCompositionEnd = () => {
      compositionRef.value = false;

      collectInputValue(inputRef.value.value);
    };

    // >>> Input
    const onInternalInput = (e: ChangeEvent) => {
      collectInputValue(e.target.value);
    };

    // ============================= Step =============================
    const onInternalStep = (up: boolean) => {
      // Ignore step since out of range
      if ((up && upDisabled.value) || (!up && downDisabled.value)) {
        return;
      }

      // Clear typing status since it may caused by up & down key.
      // We should sync with input value.
      userTypingRef.value = false;

      let stepDecimal = getMiniDecimal(props.step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }

      const target = (decimalValue.value || getMiniDecimal(0)).add(stepDecimal.toString());

      const updatedValue = triggerValueUpdate(target, false);

      props.onStep?.(getDecimalValue(props.stringMode, updatedValue), {
        offset: props.step,
        type: up ? 'up' : 'down',
      });

      inputRef.value?.focus();
    };

    // ============================ Flush =============================
    /**
     * Flush current input content to trigger value change & re-formatter input if needed
     */
    const flushInputValue = (userTyping: boolean) => {
      const parsedValue = getMiniDecimal(mergedParser(inputValue.value));
      let formatValue: DecimalClass = parsedValue;

      if (!parsedValue.isNaN()) {
        // Only validate value or empty value can be re-fill to inputValue
        // Reassign the formatValue within ranged of trigger control
        formatValue = triggerValueUpdate(parsedValue, userTyping);
      } else {
        formatValue = decimalValue.value;
      }

      if (props.value !== undefined) {
        // Reset back with controlled value first
        setInputValue(decimalValue.value, false);
      } else if (!formatValue.isNaN()) {
        // Reset input back since no validate value
        setInputValue(formatValue, false);
      }
    };

    const onKeyDown: KeyboardEventHandler = event => {
      const { which } = event;
      userTypingRef.value = true;

      if (which === KeyCode.ENTER) {
        if (!compositionRef.value) {
          userTypingRef.value = false;
        }
        flushInputValue(false);
        props.onPressEnter?.(event);
      }

      if (props.keyboard === false) {
        return;
      }

      // Do step
      if (!compositionRef.value && [KeyCode.UP, KeyCode.DOWN].includes(which)) {
        onInternalStep(KeyCode.UP === which);
        event.preventDefault();
      }
    };

    const onKeyUp = () => {
      userTypingRef.value = false;
    };

    // >>> Focus & Blur
    const onBlur = (e: FocusEvent) => {
      flushInputValue(false);
      focus.value = false;
      userTypingRef.value = false;
      emit('blur', e);
    };

    // ========================== Controlled ==========================
    // Input by precision
    watch(
      () => props.precision,
      () => {
        if (!decimalValue.value.isInvalidate()) {
          setInputValue(decimalValue.value, false);
        }
      },
      { flush: 'post' },
    );

    // Input by value
    watch(
      () => props.value,
      () => {
        const newValue = getMiniDecimal(props.value);
        decimalValue.value = newValue;

        const currentParsedValue = getMiniDecimal(mergedParser(inputValue.value));

        // When user typing from `1.2` to `1.`, we should not convert to `1` immediately.
        // But let it go if user set `formatter`
        if (!newValue.equals(currentParsedValue) || !userTypingRef.value || props.formatter) {
          // Update value as effect
          setInputValue(newValue, userTypingRef.value);
        }
      },
      { flush: 'post' },
    );

    // ============================ Cursor ============================
    watch(
      inputValue,
      () => {
        if (props.formatter) {
          restoreCursor();
        }
      },
      { flush: 'post' },
    );

    watch(
      () => props.disabled,
      val => {
        if (val) {
          focus.value = false;
        }
      },
    );

    expose({
      focus: () => {
        inputRef.value?.focus();
      },
      blur: () => {
        inputRef.value?.blur();
      },
    });

    return () => {
      const {
        prefixCls = 'rc-input-number',
        min,
        max,
        step = 1,
        defaultValue,
        value,
        disabled,
        readonly,
        keyboard,
        controls = true,
        autofocus,

        stringMode,

        parser,
        formatter,
        precision,
        decimalSeparator,

        onChange,
        onInput,
        onPressEnter,
        onStep,
        lazy,
        class: className,
        style,

        ...inputProps
      } = { ...(attrs as HTMLAttributes), ...props };
      const { upHandler, downHandler } = slots;
      const inputClassName = `${prefixCls}-input`;
      const eventProps = {} as any;
      if (lazy) {
        eventProps.onChange = onInternalInput;
      } else {
        eventProps.onInput = onInternalInput;
      }
      return (
        <div
          class={classNames(prefixCls, className, {
            [`${prefixCls}-focused`]: focus.value,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-readonly`]: readonly,
            [`${prefixCls}-not-a-number`]: decimalValue.value.isNaN(),
            [`${prefixCls}-out-of-range`]:
              !decimalValue.value.isInvalidate() && !isInRange(decimalValue.value),
          })}
          style={style}
          onKeydown={onKeyDown}
          onKeyup={onKeyUp}
        >
          {controls && (
            <StepHandler
              prefixCls={prefixCls}
              upDisabled={upDisabled.value}
              downDisabled={downDisabled.value}
              onStep={onInternalStep}
              v-slots={{ upNode: upHandler, downNode: downHandler }}
            />
          )}
          <div class={`${inputClassName}-wrap`}>
            <input
              autofocus={autofocus}
              autocomplete="off"
              role="spinbutton"
              aria-valuemin={min as any}
              aria-valuemax={max as any}
              aria-valuenow={
                decimalValue.value.isInvalidate() ? null : (decimalValue.value.toString() as any)
              }
              step={step}
              {...inputProps}
              ref={inputRef}
              class={inputClassName}
              value={inputValue.value}
              disabled={disabled}
              readonly={readonly}
              onFocus={(e: FocusEvent) => {
                focus.value = true;
                emit('focus', e);
              }}
              {...eventProps}
              onBlur={onBlur}
              onCompositionstart={onCompositionStart}
              onCompositionend={onCompositionEnd}
            />
          </div>
        </div>
      );
    };
  },
});
