import { type PropType, computed, defineComponent, ref, watchEffect } from 'vue';
import inputProps from '../inputProps';
import { FormItemInputContext } from '../../form/FormItemContext';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import classNames from '../../_util/classNames';
import useStyle from '../style/otp';
import OTPInput from './OTPInput';
import { type InputStatus, getMergedStatus } from '../../_util/statusUtils';
import warning from '../../_util/warning';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AOTP',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    length: { type: Number, default: 6 },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
    formatter: { type: Function as PropType<(arg: string) => string>, default: undefined },
    defaultValue: { type: String, default: undefined },
    mask: { type: [String, Boolean], default: false },
    status: { type: String as PropType<InputStatus>, default: undefined },
  },
  setup(props, { attrs }) {
    const { prefixCls, direction, size } = useConfigInject('otp', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // ==================== Provider =========================
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(
      () => getMergedStatus(formItemInputContext.status, props.status) as InputStatus,
    );

    const refs = ref([]);
    const strToArr = (str: string) => (str || '').split('');
    // keep reactive
    const internalFormatter = (txt: string) => (props.formatter ? props.formatter(txt) : txt);
    const valueCells = ref<string[]>(strToArr(internalFormatter(props.defaultValue || '')));

    watchEffect(() => {
      if (typeof props.value !== 'undefined' && props.value !== null) {
        valueCells.value = strToArr(String(props.value));
      }
    });

    const patchValue = (index: number, txt: string) => {
      let nextCells = valueCells.value.slice();

      for (let i = 0; i < index; i += 1) {
        if (!nextCells[i]) {
          nextCells[i] = '';
        }
      }

      if (txt.length <= 1) {
        nextCells[index] = txt;
      } else {
        nextCells = nextCells.slice(0, index).concat(strToArr(txt));
      }

      nextCells = nextCells.slice(0, props.length);
      for (let i = nextCells.length - 1; i >= 0; i -= 1) {
        if (nextCells[i]) {
          break;
        }
        nextCells.pop();
      }

      const formattedValue = internalFormatter(nextCells.map(c => c || ' ').join(''));
      nextCells = strToArr(formattedValue).map((c, i) => {
        if (c === ' ' && !nextCells[i]) {
          return nextCells[i];
        }
        return c;
      });

      return nextCells;
    };

    // ======================= Change handlers =================
    const onInputActiveChange = (nextIndex: number) => {
      refs.value[nextIndex]?.focus();
    };

    const onInputChange = (index: number, value: string) => {
      const nextValueCells = patchValue(index, value);
      const nextIndex = Math.min(index + value.length, props.length);
      if (nextIndex !== index) {
        refs.value[nextIndex]?.focus();
      }

      if (
        props.onChange &&
        nextValueCells.length === props.length &&
        nextValueCells.every(v => v) &&
        nextValueCells.some((v, i) => v !== valueCells.value[i])
      ) {
        props.onChange(nextValueCells.join(''));
      }
      valueCells.value = nextValueCells.slice();
    };

    return () => {
      const cls = classNames(
        prefixCls.value,
        {
          [`${prefixCls}-sm`]: size.value === 'small',
          [`${prefixCls}-lg`]: size.value === 'large',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      );
      const { length, autofocus, disabled, mask } = props;
      const inputShardProps = {
        disabled,
        mask,
      };

      if (process.env.NODE_ENV !== 'production') {
        warning(
          !(typeof mask === 'string' && mask.length > 1),
          'Input.OTP',
          '`mask` prop should be a single character.',
        );
      }

      return wrapSSR(
        <div class={cls}>
          {Array.from({ length }).map((_, index) => {
            const key = `opt-${index}`;
            const singleValue = valueCells.value[index];
            return (
              <OTPInput
                ref={ref => (refs.value[index] = ref)}
                key={key}
                index={index}
                class={`${prefixCls.value}-input`}
                value={singleValue}
                htmlSize={1}
                onChange={onInputChange}
                status={mergedStatus.value}
                onActiveChange={onInputActiveChange}
                autofocus={index === 0 && autofocus}
                {...inputShardProps}
              />
            );
          })}
        </div>,
      );
    };
  },
});
