import { computed, defineComponent, inject, ref, VNodeChild, App, PropType, Plugin } from 'vue';
import omit from 'omit.js';
import classNames from '../_util/classNames';
import RcSelect, { Option, OptGroup, SelectProps as RcSelectProps, BaseProps } from '../vc-select';
import { OptionProps as OptionPropsType } from '../vc-select/Option';
import { defaultConfigProvider } from '../config-provider';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';

type RawValue = string | number;

export type OptionProps = OptionPropsType;

export type OptionType = typeof Option;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: VNodeChild;
}
export type SizeType = 'small' | 'middle' | 'large' | undefined;
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];

export interface InternalSelectProps<VT> extends Omit<RcSelectProps<VT>, 'mode'> {
  suffixIcon?: VNodeChild;
  itemIcon?: VNodeChild;
  size?: SizeType;
  mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  bordered?: boolean;
}

export interface SelectPropsTypes<VT>
  extends Omit<
    InternalSelectProps<VT>,
    'inputIcon' | 'mode' | 'getInputElement' | 'backfill' | 'class' | 'style'
  > {
  mode?: 'multiple' | 'tags';
}
export type SelectTypes = SelectPropsTypes<SelectValue>;
export const SelectProps = () => ({
  ...(omit(BaseProps(), [
    'inputIcon',
    'mode',
    'getInputElement',
    'backfill',
    'class',
    'style',
  ]) as Omit<
    ReturnType<typeof BaseProps>,
    'inputIcon' | 'mode' | 'getInputElement' | 'backfill' | 'class' | 'style'
  >),
  value: {
    type: [Array, Object, String, Number] as PropType<SelectValue>,
  },
  defaultValue: {
    type: [Array, Object, String, Number] as PropType<SelectValue>,
  },
  notFoundContent: PropTypes.VNodeChild,
  suffixIcon: PropTypes.VNodeChild,
  itemIcon: PropTypes.VNodeChild,
  size: PropTypes.oneOf(tuple('small', 'middle', 'large', 'default')),
  mode: PropTypes.oneOf(tuple('multiple', 'tags', 'SECRET_COMBOBOX_MODE_DO_NOT_USE')),
  bordered: PropTypes.looseBool.def(true),
  transitionName: PropTypes.string.def('slide-up'),
  choiceTransitionName: PropTypes.string.def(''),
});

const Select = defineComponent({
  name: 'ASelect',
  Option,
  OptGroup,
  inheritAttrs: false,
  props: SelectProps(),
  SECRET_COMBOBOX_MODE_DO_NOT_USE: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
  emits: ['change', 'update:value'],
  setup(props: any, { attrs, emit }) {
    const selectRef = ref(null);

    const configProvider = inject('configProvider', defaultConfigProvider);

    const focus = () => {
      if (selectRef.value) {
        selectRef.value.focus();
      }
    };

    const blur = () => {
      if (selectRef.value) {
        selectRef.value.blur();
      }
    };

    const mode = computed(() => {
      const { mode } = props;

      if ((mode as any) === 'combobox') {
        return undefined;
      }

      if (mode === Select.SECRET_COMBOBOX_MODE_DO_NOT_USE) {
        return 'combobox';
      }

      return mode;
    });
    const prefixCls = computed(() => {
      return configProvider.getPrefixCls('select', props.prefixCls);
    });
    const mergedClassName = computed(() =>
      classNames(
        {
          [`${prefixCls.value}-lg`]: props.size === 'large',
          [`${prefixCls.value}-sm`]: props.size === 'small',
          [`${prefixCls.value}-rtl`]: props.direction === 'rtl',
          [`${prefixCls.value}-borderless`]: !props.bordered,
        },
        attrs.class,
      ),
    );
    const triggerChange = (...args: any[]) => {
      emit('update:value', ...args);
      emit('change', ...args);
    };
    return {
      selectRef,
      mergedClassName,
      mode,
      focus,
      blur,
      configProvider,
      triggerChange,
      prefixCls,
    };
  },
  render() {
    const {
      configProvider,
      mode,
      mergedClassName,
      triggerChange,
      prefixCls,
      $slots: slots,
      $props,
    } = this as any;
    const props: SelectTypes = $props;
    const {
      notFoundContent,
      listHeight = 256,
      listItemHeight = 24,
      getPopupContainer,
      dropdownClassName,
      direction,
      virtual,
      dropdownMatchSelectWidth,
    } = props;

    const { renderEmpty, getPopupContainer: getContextPopupContainer } = configProvider;

    const isMultiple = mode === 'multiple' || mode === 'tags';

    // ===================== Empty =====================
    let mergedNotFound: VNodeChild;
    if (notFoundContent !== undefined) {
      mergedNotFound = notFoundContent;
    } else if (slots.notFoundContent) {
      mergedNotFound = slots.notFoundContent();
    } else if (mode === 'combobox') {
      mergedNotFound = null;
    } else {
      mergedNotFound = renderEmpty('Select') as any;
    }

    // ===================== Icons =====================
    const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons(
      {
        ...this.$props,
        multiple: isMultiple,
        prefixCls,
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
    ]) as any;

    const rcSelectRtlDropDownClassName = classNames(dropdownClassName, {
      [`${prefixCls}-dropdown-${direction}`]: direction === 'rtl',
    });
    return (
      <RcSelect
        ref="selectRef"
        virtual={virtual}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        {...selectProps}
        {...this.$attrs}
        listHeight={listHeight}
        listItemHeight={listItemHeight}
        mode={mode}
        prefixCls={prefixCls}
        direction={direction}
        inputIcon={suffixIcon}
        menuItemSelectedIcon={itemIcon}
        removeIcon={removeIcon}
        clearIcon={clearIcon}
        notFoundContent={mergedNotFound}
        class={mergedClassName}
        getPopupContainer={getPopupContainer || getContextPopupContainer}
        dropdownClassName={rcSelectRtlDropDownClassName}
        onChange={triggerChange}
        dropdownRender={selectProps.dropdownRender || this.$slots.dropdownRender}
      >
        {slots.default?.()}
      </RcSelect>
    );
  },
});
/* istanbul ignore next */
Select.install = function(app: App) {
  app.component(Select.name, Select);
  app.component(Select.Option.displayName, Select.Option);
  app.component(Select.OptGroup.displayName, Select.OptGroup);
  return app;
};
export default Select as typeof Select &
  Plugin & {
    readonly Option: typeof Option;
    readonly OptGroup: typeof OptGroup;
    readonly SECRET_COMBOBOX_MODE_DO_NOT_USE: 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  };
