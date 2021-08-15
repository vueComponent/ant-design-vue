import type { VNodeChild, App, PropType, Plugin } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import omit from 'omit.js';
import classNames from '../_util/classNames';
import type { SelectProps as RcSelectProps } from '../vc-select';
import RcSelect, { Option, OptGroup, BaseProps } from '../vc-select';
import type { OptionProps as OptionPropsType } from '../vc-select/Option';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { SizeType } from '../config-provider';

type RawValue = string | number;

export type OptionProps = OptionPropsType;

export type OptionType = typeof Option;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: VNodeChild;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

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
  slots: [
    'notFoundContent',
    'suffixIcon',
    'itemIcon',
    'removeIcon',
    'clearIcon',
    'dropdownRender',
    'option',
  ],
  setup(props, { attrs, emit, slots, expose }) {
    const selectRef = ref(null);

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
    const { prefixCls, direction, configProvider } = useConfigInject('select', props);
    const mergedClassName = computed(() =>
      classNames({
        [`${prefixCls.value}-lg`]: props.size === 'large',
        [`${prefixCls.value}-sm`]: props.size === 'small',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-borderless`]: !props.bordered,
      }),
    );
    const triggerChange = (...args: any[]) => {
      emit('update:value', args[0]);
      emit('change', ...args);
    };
    expose({
      blur,
      focus,
    });
    return () => {
      const {
        notFoundContent,
        listHeight = 256,
        listItemHeight = 24,
        getPopupContainer,
        dropdownClassName,
        virtual,
        dropdownMatchSelectWidth,
      } = props;

      const { renderEmpty, getPopupContainer: getContextPopupContainer } = configProvider;

      const isMultiple = mode.value === 'multiple' || mode.value === 'tags';

      // ===================== Empty =====================
      let mergedNotFound: VNodeChild;
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
          multiple: isMultiple,
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
          dropdownRender={selectProps.dropdownRender || slots.dropdownRender}
          v-slots={{ option: slots.option }}
        >
          {slots.default?.()}
        </RcSelect>
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
