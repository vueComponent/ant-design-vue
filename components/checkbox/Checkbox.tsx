import type { CSSProperties } from 'vue';
import { watchEffect, onMounted, defineComponent, inject, onBeforeUnmount, ref } from 'vue';
import classNames from '../_util/classNames';
import VcCheckbox from '../vc-checkbox/Checkbox';
import { flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import type { EventHandler } from '../_util/EventInterface';
import { useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../_util/hooks/useConfigInject';

import type { CheckboxChangeEvent, CheckboxProps } from './interface';
import { CheckboxGroupContextKey, checkboxProps } from './interface';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: checkboxProps(),
  // emits: ['change', 'update:checked'],
  setup(props, { emit, attrs, slots, expose }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction } = useConfigInject('checkbox', props);
    const checkboxGroup = inject(CheckboxGroupContextKey, undefined);
    const uniId = Symbol('checkboxUniId');

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
        props.checked !== undefined || checkboxGroup || props.value === undefined,
        'Checkbox',
        '`value` is not validate prop, do you mean `checked`?',
      );
    });

    const handleChange = (event: CheckboxChangeEvent) => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('change', event);
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
      };
      if (checkboxGroup && !skipGroup) {
        checkboxProps.onChange = (...args) => {
          emit('change', ...args);
          checkboxGroup.toggleOption({ label: children, value: props.value });
        };
        checkboxProps.name = checkboxGroup.name.value;
        checkboxProps.checked = checkboxGroup.mergedValue.value.indexOf(props.value) !== -1;
        checkboxProps.disabled = props.disabled || checkboxGroup.disabled.value;
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
        },
        className,
      );
      const checkboxClass = classNames({
        [`${prefixCls.value}-indeterminate`]: indeterminate,
      });
      return (
        <label
          class={classString}
          style={style as CSSProperties}
          onMouseenter={onMouseenter as EventHandler}
          onMouseleave={onMouseleave as EventHandler}
        >
          <VcCheckbox {...checkboxProps} class={checkboxClass} ref={checkboxRef} />
          {children.length ? <span>{children}</span> : null}
        </label>
      );
    };
  },
});
