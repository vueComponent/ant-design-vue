import type { App, PropType, Plugin, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import type { BaseSelectRef } from '../vc-select';
import RcSelect, { selectProps as vcSelectProps, Option, OptGroup } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-select/Select';
import type { OptionProps } from '../vc-select/Option';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';
import omit from '../_util/omit';
import { useInjectFormItemContext } from '../form/FormItemContext';
import { getTransitionName } from '../_util/transition';
import type { SizeType } from '../config-provider';
import { initDefaultProps } from '../_util/props-util';

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
    const { prefixCls, direction, configProvider, size, getPrefixCls } = useConfigInject(
      'select',
      props,
    );
    const rootPrefixCls = computed(() => getPrefixCls());
    const transitionName = computed(() =>
      getTransitionName(rootPrefixCls.value, 'slide-up', props.transitionName),
    );
    const mergedClassName = computed(() =>
      classNames({
        [`${prefixCls.value}-lg`]: size.value === 'large',
        [`${prefixCls.value}-sm`]: size.value === 'small',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-borderless`]: !props.bordered,
      }),
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
    return () => {
      const {
        notFoundContent,
        listHeight = 256,
        listItemHeight = 24,
        getPopupContainer,
        dropdownClassName,
        virtual,
        dropdownMatchSelectWidth,
        id = formItemContext.id.value,
        placeholder = slots.placeholder?.(),
      } = props;

      const { renderEmpty, getPopupContainer: getContextPopupContainer } = configProvider;

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
      ]);

      const rcSelectRtlDropDownClassName = classNames(dropdownClassName, {
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
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          dropdownClassName={rcSelectRtlDropDownClassName}
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
