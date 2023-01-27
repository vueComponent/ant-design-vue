import type { PropType, ExtractPropTypes, HTMLAttributes, App } from 'vue';
import { watch, defineComponent, ref, computed } from 'vue';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import VcInputNumber, { inputNumberProps as baseInputNumberProps } from './src/InputNumber';
import type { SizeType } from '../config-provider';
import {
  FormItemInputContext,
  NoFormStatus,
  useInjectFormItemContext,
} from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { cloneElement } from '../_util/vnode';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import isValidValue from '../_util/isValidValue';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
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
  status: String as PropType<InputStatus>,
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
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
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
      const { hasFeedback, isFormItemInput, feedbackIcon } = formItemInputContext;
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
          [`${preCls}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(preCls, mergedStatus.value),
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
            upHandler: slots.upIcon
              ? () => <span class={`${preCls}-handler-up-inner`}>{slots.upIcon()}</span>
              : () => <UpOutlined class={`${preCls}-handler-up-inner`} />,
            downHandler: slots.downIcon
              ? () => <span class={`${preCls}-handler-down-inner`}>{slots.downIcon()}</span>
              : () => <DownOutlined class={`${preCls}-handler-down-inner`} />,
          }}
        />
      );
      const hasAddon = isValidValue(addonBefore) || isValidValue(addonAfter);
      const hasPrefix = isValidValue(prefix);
      if (hasPrefix || hasFeedback) {
        const affixWrapperCls = classNames(
          `${preCls}-affix-wrapper`,
          getStatusClassNames(`${preCls}-affix-wrapper`, mergedStatus.value, hasFeedback),
          {
            [`${preCls}-affix-wrapper-focused`]: focused.value,
            [`${preCls}-affix-wrapper-disabled`]: props.disabled,
            [`${preCls}-affix-wrapper-sm`]: size.value === 'small',
            [`${preCls}-affix-wrapper-lg`]: size.value === 'large',
            [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
            [`${preCls}-affix-wrapper-readonly`]: readonly,
            [`${preCls}-affix-wrapper-borderless`]: !bordered,
            // className will go to addon wrapper
            [`${className}`]: !hasAddon && className,
          },
        );
        element = (
          <div
            class={affixWrapperCls}
            style={style}
            onMouseup={() => inputNumberRef.value!.focus()}
          >
            {hasPrefix && <span class={`${preCls}-prefix`}>{prefix}</span>}
            {element}
            {hasFeedback && <span class={`${preCls}-suffix`}>{feedbackIcon}</span>}
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
          getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus.value, hasFeedback),
          className,
        );
        element = (
          <div class={mergedGroupClassName} style={style}>
            <div class={mergedWrapperClassName}>
              {addonBeforeNode && <NoFormStatus>{addonBeforeNode}</NoFormStatus>}
              {element}
              {addonAfterNode && <NoFormStatus>{addonAfterNode}</NoFormStatus>}
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
