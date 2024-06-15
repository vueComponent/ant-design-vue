import { PropType, defineComponent, reactive, ref } from 'vue';
import inputProps from '../inputProps';
import { FormItemInputContext } from 'ant-design-vue/es/form/FormItemContext';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import classNames from 'ant-design-vue/es/_util/classNames';
import useStyle from '../style/otp';
import OTPInput from './OTPInput';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OTP',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    length: { type: Number, default: 6 },
    formatter: { type: Function as PropType<(arg: string) => string>, default: undefined },
    defaultValue: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    const { prefixCls, direction, size } = useConfigInject('otp', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const proxyFormContext = reactive({
      // TODO:
    });
    FormItemInputContext.useProvide(proxyFormContext);

    const { defaultValue } = props;
    const strToArr = (str: string) => (str || '').split('');
    // keep reactive
    const internalFormatter = (txt: string) => (props.formatter ? props.formatter(txt) : txt);

    const valueCells = ref<string[]>(strToArr(internalFormatter(defaultValue || '')));

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
      const { length } = props;
      return wrapSSR(
        <div class={cls}>
          {Array.from({ length }).map((_, index) => {
            const key = `opt-${index}`;
            const singleValue = valueCells.value[index];

            return (
              <OTPInput
                key={key}
                index={index}
                class={`${prefixCls.value}-input`}
                value={singleValue}
              />
            );
          })}
        </div>,
      );
    };
  },
});
