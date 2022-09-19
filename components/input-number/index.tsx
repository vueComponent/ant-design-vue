import type { PropType, ExtractPropTypes, HTMLAttributes, App } from 'vue';
import { watch, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import VcInputNumber, { inputNumberProps as baseInputNumberProps } from './src/InputNumber';
import type { SizeType } from '../config-provider';
import { useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../_util/hooks/useConfigInject';
import { cloneElement } from '../_util/vnode';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import isValidValue from '../_util/isValidValue';
const baseProps = baseInputNumberProps();
export const inputNumberProps = () => ({
  ...baseProps,
  size: { type: String as PropType<SizeType> },
  bordered: { type: Boolean, default: true },
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  'onUpdate:value': baseProps.onChange,
  valueModifiers: Object,
});

export type InputNumberProps = Partial<ExtractPropTypes<ReturnType<typeof inputNumberProps>>>;

const InputNumber = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps(),
  // emits: ['focus', 'blur', 'change', 'input', 'update:value'],
  slots: ['addonBefore', 'addonAfter', 'prefix'],
  setup(props, { emit, expose, attrs, slots }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, size, direction } = useConfigInject('input-number', props);
    const mergedValue = ref(props.value === undefined ? props.defaultValue : props.value);
    const focused = ref(false);
    watch(
      () => props.value,
      () => {
        mergedValue.value = props.value;
      },
    );
    const inputNumberRef = ref(null);
    const focus = () => {
      inputNumberRef.value?.focus();
    };
    const blur = () => {
      inputNumberRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });
    const handleChange = (val: number) => {
      if (props.value === undefined) {
        mergedValue.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = (e: FocusEvent) => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleFocus = (e: FocusEvent) => {
      focused.value = true;
      emit('focus', e);
    };
    return () => {
      const {
        class: className,
        bordered,
        readonly,
        style,
        addonBefore = slots.addonBefore?.(),
        addonAfter = slots.addonAfter?.(),
        prefix = slots.prefix?.(),
        valueModifiers = {},
        ...others
      } = { ...attrs, ...props } as InputNumberProps & HTMLAttributes;

      const preCls = prefixCls.value;

      const mergeSize = size.value;
      const inputNumberClass = classNames(
        {
          [`${preCls}-lg`]: mergeSize === 'large',
          [`${preCls}-sm`]: mergeSize === 'small',
          [`${preCls}-rtl`]: direction.value === 'rtl',
          [`${preCls}-readonly`]: readonly,
          [`${preCls}-borderless`]: !bordered,
        },
        className,
      );

      let element = (
        <VcInputNumber
          {...omit(others, ['size', 'defaultValue'])}
          ref={inputNumberRef}
          lazy={!!valueModifiers.lazy}
          value={mergedValue.value}
          class={inputNumberClass}
          prefixCls={preCls}
          readonly={readonly}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          v-slots={{
            upHandler: () => <UpOutlined class={`${preCls}-handler-up-inner`} />,
            downHandler: () => <DownOutlined class={`${preCls}-handler-down-inner`} />,
          }}
        />
      );
      const hasAddon = isValidValue(addonBefore) || isValidValue(addonAfter);
      if (isValidValue(prefix)) {
        const affixWrapperCls = classNames(`${preCls}-affix-wrapper`, {
          [`${preCls}-affix-wrapper-focused`]: focused.value,
          [`${preCls}-affix-wrapper-disabled`]: props.disabled,
          [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
          [`${preCls}-affix-wrapper-readonly`]: readonly,
          [`${preCls}-affix-wrapper-borderless`]: !bordered,
          // className will go to addon wrapper
          [`${className}`]: !hasAddon && className,
        });
        element = (
          <div
            class={affixWrapperCls}
            style={style}
            onMouseup={() => inputNumberRef.value!.focus()}
          >
            <span class={`${preCls}-prefix`}>{prefix}</span>
            {element}
          </div>
        );
      }

      if (hasAddon) {
        const wrapperClassName = `${preCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;
        const addonBeforeNode = addonBefore ? (
          <div class={addonClassName}>{addonBefore}</div>
        ) : null;
        const addonAfterNode = addonAfter ? <div class={addonClassName}>{addonAfter}</div> : null;

        const mergedWrapperClassName = classNames(`${preCls}-wrapper`, wrapperClassName, {
          [`${wrapperClassName}-rtl`]: direction.value === 'rtl',
        });

        const mergedGroupClassName = classNames(
          `${preCls}-group-wrapper`,
          {
            [`${preCls}-group-wrapper-sm`]: mergeSize === 'small',
            [`${preCls}-group-wrapper-lg`]: mergeSize === 'large',
            [`${preCls}-group-wrapper-rtl`]: direction.value === 'rtl',
          },
          className,
        );
        element = (
          <div class={mergedGroupClassName} style={style}>
            <div class={mergedWrapperClassName}>
              {addonBeforeNode}
              {element}
              {addonAfterNode}
            </div>
          </div>
        );
      }
      return cloneElement(element, { style });
    };
  },
});

export default Object.assign(InputNumber, {
  install: (app: App) => {
    app.component(InputNumber.name, InputNumber);
    return app;
  },
});
