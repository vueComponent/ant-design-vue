import type { ExtractPropTypes, HTMLAttributes, App } from 'vue';
import { watch, defineComponent, shallowRef, computed } from 'vue';
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
import { booleanType, stringType } from '../_util/type';

// CSSINJS
import useStyle from './style';
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
import { useInjectDisabled } from '../config-provider/DisabledContext';

import type { CustomSlotsType } from '../_util/type';
const baseProps = baseInputNumberProps();
export const inputNumberProps = () => ({
  ...baseProps,
  size: stringType<SizeType>(),
  bordered: booleanType(true),
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  'onUpdate:value': baseProps.onChange,
  valueModifiers: Object,
  status: stringType<InputStatus>(),
});

export type InputNumberProps = Partial<ExtractPropTypes<ReturnType<typeof inputNumberProps>>>;

const InputNumber = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps(),
  // emits: ['focus', 'blur', 'change', 'input', 'update:value'],
  slots: Object as CustomSlotsType<{
    addonBefore?: any;
    addonAfter?: any;
    prefix?: any;
    default?: any;
    upIcon?: any;
    downIcon?: any;
  }>,

  setup(props, { emit, expose, attrs, slots }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const { prefixCls, size, direction, disabled } = useConfigInject('input-number', props);
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? disabledContext.value);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedSize = computed(() => compactSize.value || size.value);

    const mergedValue = shallowRef(props.value ?? props.defaultValue);
    const focused = shallowRef(false);
    watch(
      () => props.value,
      () => {
        mergedValue.value = props.value;
      },
    );
    const inputNumberRef = shallowRef(null);
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
      const id = props.id ?? formItemContext.id.value;
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
      } = { ...attrs, ...props, id, disabled: mergedDisabled.value } as InputNumberProps &
        HTMLAttributes;

      const preCls = prefixCls.value;

      const inputNumberClass = classNames(
        {
          [`${preCls}-lg`]: mergedSize.value === 'large',
          [`${preCls}-sm`]: mergedSize.value === 'small',
          [`${preCls}-rtl`]: direction.value === 'rtl',
          [`${preCls}-readonly`]: readonly,
          [`${preCls}-borderless`]: !bordered,
          [`${preCls}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(preCls, mergedStatus.value),
        className,
        compactItemClassnames.value,
        hashId.value,
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
            [`${preCls}-affix-wrapper-disabled`]: mergedDisabled.value,
            [`${preCls}-affix-wrapper-sm`]: mergedSize.value === 'small',
            [`${preCls}-affix-wrapper-lg`]: mergedSize.value === 'large',
            [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
            [`${preCls}-affix-wrapper-readonly`]: readonly,
            [`${preCls}-affix-wrapper-borderless`]: !bordered,
            // className will go to addon wrapper
            [`${className}`]: !hasAddon && className,
          },
          hashId.value,
        );
        element = (
          <div class={affixWrapperCls} style={style} onClick={focus}>
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

        const mergedWrapperClassName = classNames(
          `${preCls}-wrapper`,
          wrapperClassName,
          {
            [`${wrapperClassName}-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
        );

        const mergedGroupClassName = classNames(
          `${preCls}-group-wrapper`,
          {
            [`${preCls}-group-wrapper-sm`]: mergedSize.value === 'small',
            [`${preCls}-group-wrapper-lg`]: mergedSize.value === 'large',
            [`${preCls}-group-wrapper-rtl`]: direction.value === 'rtl',
          },
          getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus.value, hasFeedback),
          className,
          hashId.value,
        );
        element = (
          <div class={mergedGroupClassName} style={style}>
            <div class={mergedWrapperClassName}>
              {addonBeforeNode && (
                <NoCompactStyle>
                  <NoFormStatus>{addonBeforeNode}</NoFormStatus>
                </NoCompactStyle>
              )}
              {element}
              {addonAfterNode && (
                <NoCompactStyle>
                  <NoFormStatus>{addonAfterNode}</NoFormStatus>
                </NoCompactStyle>
              )}
            </div>
          </div>
        );
      }
      return wrapSSR(cloneElement(element, { style }));
    };
  },
});

export default Object.assign(InputNumber, {
  install: (app: App) => {
    app.component(InputNumber.name, InputNumber);
    return app;
  },
});
