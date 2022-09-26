import type { App, ExtractPropTypes, PropType } from 'vue';
import { computed, ref, watchEffect, defineComponent } from 'vue';
import VcTreeSelect, {
  TreeNode,
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  treeSelectProps as vcTreeSelectProps,
} from '../vc-tree-select';
import classNames from '../_util/classNames';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { SizeType } from '../config-provider';
import type { FieldNames, Key } from '../vc-tree-select/interface';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import getIcons from '../select/utils/iconUtil';
import type { SwitcherIconProps } from '../tree/utils/iconUtil';
import renderSwitcherIcon from '../tree/utils/iconUtil';
import { warning } from '../vc-util/warning';
import { flattenChildren } from '../_util/props-util';
import { useInjectFormItemContext } from '../form/FormItemContext';
import type { BaseSelectRef } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-tree-select/TreeSelect';
import type { TreeProps } from '../tree';

const getTransitionName = (rootPrefixCls: string, motion: string, transitionName?: string) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};

type RawValue = string | number;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label?: any;
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];

export type RefTreeSelectProps = BaseSelectRef;

export function treeSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>() {
  return {
    ...omit(vcTreeSelectProps<ValueType, OptionType>(), [
      'showTreeIcon',
      'treeMotion',
      'inputIcon',
      'getInputElement',
      'treeLine',
      'customSlots',
    ]),
    suffixIcon: PropTypes.any,
    size: { type: String as PropType<SizeType> },
    bordered: { type: Boolean, default: undefined },
    treeLine: { type: [Boolean, Object] as PropType<TreeProps['showLine']>, default: undefined },
    replaceFields: { type: Object as PropType<FieldNames> },
    'onUpdate:value': { type: Function as PropType<(value: any) => void> },
    'onUpdate:treeExpandedKeys': { type: Function as PropType<(keys: Key[]) => void> },
    'onUpdate:searchValue': { type: Function as PropType<(value: string) => void> },
  };
}
export type TreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof treeSelectProps>>>;

const TreeSelect = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATreeSelect',
  inheritAttrs: false,
  props: initDefaultProps(treeSelectProps(), {
    choiceTransitionName: '',
    listHeight: 256,
    treeIcon: false,
    listItemHeight: 26,
    bordered: true,
  }),
  slots: [
    'title',
    'titleRender',
    'placeholder',
    'maxTagPlaceholder',
    'treeIcon',
    'switcherIcon',
    'notFoundContent',
  ],
  setup(props, { attrs, slots, expose, emit }) {
    warning(
      !(props.treeData === undefined && slots.default),
      '`children` of TreeSelect is deprecated. Please use `treeData` instead.',
    );
    watchEffect(() => {
      devWarning(
        props.multiple !== false || !props.treeCheckable,
        'TreeSelect',
        '`multiple` will always be `true` when `treeCheckable` is true',
      );
      devWarning(
        props.replaceFields === undefined,
        'TreeSelect',
        '`replaceFields` is deprecated, please use fieldNames instead',
      );
    });

    const formItemContext = useInjectFormItemContext();
    const {
      prefixCls,
      renderEmpty,
      direction,
      virtual,
      dropdownMatchSelectWidth,
      size,
      getPopupContainer,
      getPrefixCls,
    } = useConfigInject('select', props);
    const rootPrefixCls = computed(() => getPrefixCls());
    const transitionName = computed(() =>
      getTransitionName(rootPrefixCls.value, 'slide-up', props.transitionName),
    );
    const choiceTransitionName = computed(() =>
      getTransitionName(rootPrefixCls.value, '', props.choiceTransitionName),
    );
    const treePrefixCls = computed(() => getPrefixCls('select-tree', props.prefixCls));
    const treeSelectPrefixCls = computed(() => getPrefixCls('tree-select', props.prefixCls));

    const mergedDropdownClassName = computed(() =>
      classNames(props.dropdownClassName, `${treeSelectPrefixCls.value}-dropdown`, {
        [`${treeSelectPrefixCls.value}-dropdown-rtl`]: direction.value === 'rtl',
      }),
    );

    const isMultiple = computed(() => !!(props.treeCheckable || props.multiple));

    const treeSelectRef = ref();
    expose({
      focus() {
        treeSelectRef.value.focus?.();
      },

      blur() {
        treeSelectRef.value.blur?.();
      },
    });

    const handleChange: TreeSelectProps['onChange'] = (...args: any[]) => {
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleTreeExpand: TreeSelectProps['onTreeExpand'] = (keys: Key[]) => {
      emit('update:treeExpandedKeys', keys);
      emit('treeExpand', keys);
    };
    const handleSearch: TreeSelectProps['onSearch'] = (value: string) => {
      emit('update:searchValue', value);
      emit('search', value);
    };
    const handleBlur = (e: FocusEvent) => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    return () => {
      const {
        notFoundContent = slots.notFoundContent?.(),
        prefixCls: customizePrefixCls,
        bordered,
        listHeight,
        listItemHeight,
        multiple,
        treeIcon,
        treeLine,
        switcherIcon = slots.switcherIcon?.(),
        fieldNames = props.replaceFields,
        id = formItemContext.id.value,
      } = props;
      // ===================== Icons =====================
      const { suffixIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          multiple: isMultiple.value,
          prefixCls: prefixCls.value,
        },
        slots,
      );

      // ===================== Empty =====================
      let mergedNotFound;
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else {
        mergedNotFound = renderEmpty.value('Select');
      }
      // ==================== Render =====================
      const selectProps = omit(props as typeof props & { itemIcon: any; switcherIcon: any }, [
        'suffixIcon',
        'itemIcon',
        'removeIcon',
        'clearIcon',
        'switcherIcon',
        'bordered',
        'onUpdate:value',
        'onUpdate:treeExpandedKeys',
        'onUpdate:searchValue',
      ]);

      const mergedClassName = classNames(
        !customizePrefixCls && treeSelectPrefixCls.value,
        {
          [`${prefixCls.value}-lg`]: size.value === 'large',
          [`${prefixCls.value}-sm`]: size.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-borderless`]: !bordered,
        },
        attrs.class,
      );
      const otherProps: any = {};
      if (props.treeData === undefined && slots.default) {
        otherProps.children = flattenChildren(slots.default());
      }
      return (
        <VcTreeSelect
          {...attrs}
          {...selectProps}
          virtual={virtual.value}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth.value}
          id={id}
          fieldNames={fieldNames}
          ref={treeSelectRef}
          prefixCls={prefixCls.value}
          class={mergedClassName}
          listHeight={listHeight}
          listItemHeight={listItemHeight}
          treeLine={!!treeLine}
          inputIcon={suffixIcon}
          multiple={multiple}
          removeIcon={removeIcon}
          clearIcon={clearIcon}
          switcherIcon={(nodeProps: SwitcherIconProps) =>
            renderSwitcherIcon(treePrefixCls.value, switcherIcon, treeLine, nodeProps)
          }
          showTreeIcon={treeIcon as any}
          notFoundContent={mergedNotFound}
          getPopupContainer={getPopupContainer.value}
          treeMotion={null}
          dropdownClassName={mergedDropdownClassName.value}
          choiceTransitionName={choiceTransitionName.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onSearch={handleSearch}
          onTreeExpand={handleTreeExpand}
          v-slots={{
            ...slots,
            treeCheckable: () => <span class={`${prefixCls.value}-tree-checkbox-inner`} />,
          }}
          {...otherProps}
          transitionName={transitionName.value}
          customSlots={{
            ...slots,
            treeCheckable: () => <span class={`${prefixCls.value}-tree-checkbox-inner`} />,
          }}
          maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
        />
      );
    };
  },
});

/* istanbul ignore next */
export const TreeSelectNode = TreeNode;
export default Object.assign(TreeSelect, {
  TreeNode,
  SHOW_ALL: SHOW_ALL as typeof SHOW_ALL,
  SHOW_PARENT: SHOW_PARENT as typeof SHOW_PARENT,
  SHOW_CHILD: SHOW_CHILD as typeof SHOW_CHILD,
  install: (app: App) => {
    app.component(TreeSelect.name, TreeSelect);
    app.component(TreeSelectNode.displayName, TreeSelectNode);
    return app;
  },
});
