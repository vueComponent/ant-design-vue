import type { CSSProperties } from 'vue';
import {
  computed,
  watchEffect,
  onMounted,
  defineComponent,
  inject,
  onBeforeUnmount,
  ref,
} from 'vue';
import classNames from '../_util/classNames';
import VcCheckbox from '../vc-checkbox/Checkbox';
import { flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import type { EventHandler } from '../_util/EventInterface';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';

import type { CheckboxChangeEvent, CheckboxProps } from './interface';
import { CheckboxGroupContextKey, checkboxProps } from './interface';

// CSSINJS
import useStyle from './style';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: checkboxProps(),
  // emits: ['change', 'update:checked'],
  setup(props, { emit, attrs, slots, expose }) {
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const { prefixCls, direction, disabled } = useConfigInject('checkbox', props);

    const contextDisabled = useInjectDisabled();
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const checkboxGroup = inject(CheckboxGroupContextKey, undefined);
    const uniId = Symbol('checkboxUniId');
    const mergedDisabled = computed(() => {
      return checkboxGroup?.disabled.value || disabled.value;
    });
    watchEffect(() => {
      if (!props.skipGroup && checkboxGroup) {
        checkboxGroup.registerValue(uniId, props.value);
      }
    });
    onBeforeUnmount(() => {
      if (checkboxGroup) {
        checkboxGroup.cancelValue(uniId);
      }
    });
    onMounted(() => {
      warning(
        !!(props.checked !== undefined || checkboxGroup || props.value === undefined),
        'Checkbox',
        '`value` is not validate prop, do you mean `checked`?',
      );
    });

    const handleChange = (event: CheckboxChangeEvent) => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };
    const checkboxRef = ref();
    const focus = () => {
      checkboxRef.value?.focus();
    };
    const blur = () => {
      checkboxRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });
    return () => {
      const children = flattenChildren(slots.default?.());
      const { indeterminate, skipGroup, id = formItemContext.id.value, ...restProps } = props;
      const { onMouseenter, onMouseleave, onInput, class: className, style, ...restAttrs } = attrs;
      const checkboxProps: CheckboxProps = {
        ...restProps,
        id,
        prefixCls: prefixCls.value,
        ...restAttrs,
        disabled: mergedDisabled.value,
      };
      if (checkboxGroup && !skipGroup) {
        checkboxProps.onChange = (...args) => {
          emit('change', ...args);
          checkboxGroup.toggleOption({ label: children, value: props.value });
        };
        checkboxProps.name = checkboxGroup.name.value;
        checkboxProps.checked = checkboxGroup.mergedValue.value.includes(props.value);
        checkboxProps.disabled = mergedDisabled.value || contextDisabled.value;
        checkboxProps.indeterminate = indeterminate;
      } else {
        checkboxProps.onChange = handleChange;
      }
      const classString = classNames(
        {
          [`${prefixCls.value}-wrapper`]: true,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-wrapper-checked`]: checkboxProps.checked,
          [`${prefixCls.value}-wrapper-disabled`]: checkboxProps.disabled,
          [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput,
        },
        className,
        hashId.value,
      );
      const checkboxClass = classNames(
        {
          [`${prefixCls.value}-indeterminate`]: indeterminate,
        },
        hashId.value,
      );
      const ariaChecked = indeterminate ? 'mixed' : undefined;
      return wrapSSR(
        <label
          class={classString}
          style={style as CSSProperties}
          onMouseenter={onMouseenter as EventHandler}
          onMouseleave={onMouseleave as EventHandler}
        >
          <VcCheckbox
            aria-checked={ariaChecked}
            {...checkboxProps}
            class={checkboxClass}
            ref={checkboxRef}
          />
          {children.length ? <span>{children}</span> : null}
        </label>,
      );
    };
  },
});
