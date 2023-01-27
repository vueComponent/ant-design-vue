import type { App, PropType, Plugin, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import type { BaseSelectRef } from '../vc-select';
import RcSelect, { selectProps as vcSelectProps, Option, OptGroup } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-select/Select';
import type { OptionProps } from '../vc-select/Option';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import type { SelectCommonPlacement } from '../_util/transition';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import type { SizeType } from '../config-provider';
import { initDefaultProps } from '../_util/props-util';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';

type RawValue = string | number;

export type OptionType = typeof Option;
export type { OptionProps, BaseSelectRef as RefSelectProps, BaseOptionType, DefaultOptionType };

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label?: any;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

export const selectProps = () => ({
  ...omit(vcSelectProps<SelectValue>(), [
    'inputIcon',
    'mode',
    'getInputElement',
    'getRawInputElement',
    'backfill',
  ]),
  value: {
    type: [Array, Object, String, Number] as PropType<SelectValue>,
  },
  defaultValue: {
    type: [Array, Object, String, Number] as PropType<SelectValue>,
  },
  notFoundContent: PropTypes.any,
  suffixIcon: PropTypes.any,
  itemIcon: PropTypes.any,
  size: String as PropType<SizeType>,
  mode: String as PropType<'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'>,
  bordered: { type: Boolean, default: true },
  transitionName: String,
  choiceTransitionName: { type: String, default: '' },
  placement: String as PropType<SelectCommonPlacement>,
  status: String as PropType<InputStatus>,
  'onUpdate:value': Function as PropType<(val: SelectValue) => void>,
});

export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const Select = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASelect',
  Option,
  OptGroup,
  inheritAttrs: false,
  props: initDefaultProps(selectProps(), {
    listHeight: 256,
    listItemHeight: 24,
  }),
  SECRET_COMBOBOX_MODE_DO_NOT_USE,
  // emits: ['change', 'update:value', 'blur'],
  slots: [
    'notFoundContent',
    'suffixIcon',
    'itemIcon',
    'removeIcon',
    'clearIcon',
    'dropdownRender',
    'option',
    'placeholder',
    'tagRender',
    'maxTagPlaceholder',
    'optionLabel', // donot use, maybe remove it
  ],
  setup(props, { attrs, emit, slots, expose }) {
    const selectRef = ref<BaseSelectRef>();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const focus = () => {
      selectRef.value?.focus();
    };

    const blur = () => {
      selectRef.value?.blur();
    };

    const scrollTo: BaseSelectRef['scrollTo'] = arg => {
      selectRef.value?.scrollTo(arg);
    };

    const mode = computed(() => {
      const { mode } = props;

      if ((mode as any) === 'combobox') {
        return undefined;
      }

      if (mode === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
        return 'combobox';
      }

      return mode;
    });
    const {
      prefixCls,
      direction,
      configProvider,
      renderEmpty,
      size,
      getPrefixCls,
      getPopupContainer,
    } = useConfigInject('select', props);
    const rootPrefixCls = computed(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl'
        ? ('bottomRight' as SelectCommonPlacement)
        : ('bottomLeft' as SelectCommonPlacement);
    });
    const transitionName = computed(() =>
      getTransitionName(
        rootPrefixCls.value,
        getTransitionDirection(placement.value),
        props.transitionName,
      ),
    );
    const mergedClassName = computed(() =>
      classNames(
        {
          [`${prefixCls.value}-lg`]: size.value === 'large',
          [`${prefixCls.value}-sm`]: size.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-borderless`]: !props.bordered,
          [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput,
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback),
      ),
    );
    const triggerChange: SelectProps['onChange'] = (...args) => {
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur: SelectProps['onBlur'] = e => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    expose({
      blur,
      focus,
      scrollTo,
    });
    const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags');
    const mergedShowArrow = computed(() =>
      props.showArrow !== undefined
        ? props.showArrow
        : props.loading || !(isMultiple.value || mode.value === 'combobox'),
    );

    return () => {
      const {
        notFoundContent,
        listHeight = 256,
        listItemHeight = 24,
        dropdownClassName,
        virtual,
        dropdownMatchSelectWidth,
        id = formItemContext.id.value,
        placeholder = slots.placeholder?.(),
        showArrow,
      } = props;
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const {} = configProvider;

      // ===================== Empty =====================
      let mergedNotFound: any;
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else if (slots.notFoundContent) {
        mergedNotFound = slots.notFoundContent();
      } else if (mode.value === 'combobox') {
        mergedNotFound = null;
      } else {
        mergedNotFound = renderEmpty('Select') as any;
      }

      // ===================== Icons =====================
      const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          multiple: isMultiple.value,
          prefixCls: prefixCls.value,
          hasFeedback,
          feedbackIcon,
          showArrow: mergedShowArrow.value,
        },
        slots,
      );

      const selectProps = omit(props, [
        'prefixCls',
        'suffixIcon',
        'itemIcon',
        'removeIcon',
        'clearIcon',
        'size',
        'bordered',
        'status',
      ]);

      const rcSelectRtlDropdownClassName = classNames(dropdownClassName, {
        [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl',
      });
      return (
        <RcSelect
          ref={selectRef}
          virtual={virtual}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          {...selectProps}
          {...attrs}
          placeholder={placeholder}
          listHeight={listHeight}
          listItemHeight={listItemHeight}
          mode={mode.value}
          prefixCls={prefixCls.value}
          direction={direction.value}
          inputIcon={suffixIcon}
          menuItemSelectedIcon={itemIcon}
          removeIcon={removeIcon}
          clearIcon={clearIcon}
          notFoundContent={mergedNotFound}
          class={[mergedClassName.value, attrs.class]}
          getPopupContainer={getPopupContainer.value}
          dropdownClassName={rcSelectRtlDropdownClassName}
          onChange={triggerChange}
          onBlur={handleBlur}
          id={id}
          dropdownRender={selectProps.dropdownRender || slots.dropdownRender}
          v-slots={{ option: slots.option }}
          transitionName={transitionName.value}
          children={slots.default?.()}
          tagRender={props.tagRender || slots.tagRender}
          optionLabelRender={slots.optionLabel}
          maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
          showArrow={hasFeedback || showArrow}
        ></RcSelect>
      );
    };
  },
});
/* istanbul ignore next */
Select.install = function (app: App) {
  app.component(Select.name, Select);
  app.component(Select.Option.displayName, Select.Option);
  app.component(Select.OptGroup.displayName, Select.OptGroup);
  return app;
};

export const SelectOption = Select.Option;
export const SelectOptGroup = Select.OptGroup;
export default Select as typeof Select &
  Plugin & {
    readonly Option: typeof Option;
    readonly OptGroup: typeof OptGroup;
    readonly SECRET_COMBOBOX_MODE_DO_NOT_USE: 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  };
