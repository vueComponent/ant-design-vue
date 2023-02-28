import type { ShowSearchType, FieldNames, BaseOptionType, DefaultOptionType } from '../vc-cascader';
import VcCascader, {
  cascaderProps as vcCascaderProps,
  SHOW_CHILD,
  SHOW_PARENT,
} from '../vc-cascader';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import getIcons from '../select/utils/iconUtil';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import omit from '../_util/omit';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { SizeType } from '../config-provider';
import devWarning from '../vc-util/devWarning';
import type { SelectCommonPlacement } from '../_util/transition';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import { useInjectFormItemContext } from '../form';
import type { ValueType } from '../vc-cascader/Cascader';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { FormItemInputContext } from '../form/FormItemContext';
import { useCompactItemContext } from '../space/Compact';

import useSelectStyle from '../select/style';
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
// Align the design since we use `rc-select` in root. This help:
// - List search content will show all content
// - Hover opacity style
// - Search filter match case

export type { BaseOptionType, DefaultOptionType, ShowSearchType };

export type FieldNamesType = FieldNames;

export type FilledFieldNamesType = Required<FieldNamesType>;

function highlightKeyword(str: string, lowerKeyword: string, prefixCls?: string) {
  const cells = str
    .toLowerCase()
    .split(lowerKeyword)
    .reduce((list, cur, index) => (index === 0 ? [cur] : [...list, lowerKeyword, cur]), []);
  const fillCells: VueNode[] = [];
  let start = 0;

  cells.forEach((cell, index) => {
    const end = start + cell.length;
    let originWorld: VueNode = str.slice(start, end);
    start = end;

    if (index % 2 === 1) {
      originWorld = (
        <span class={`${prefixCls}-menu-item-keyword`} key="seperator">
          {originWorld}
        </span>
      );
    }

    fillCells.push(originWorld);
  });

  return fillCells;
}

const defaultSearchRender: ShowSearchType['render'] = ({
  inputValue,
  path,
  prefixCls,
  fieldNames,
}) => {
  const optionList: VueNode[] = [];

  // We do lower here to save perf
  const lower = inputValue.toLowerCase();

  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ');
    }

    let label = (node as any)[fieldNames.label!];
    const type = typeof label;
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower, prefixCls);
    }

    optionList.push(label);
  });
  return optionList;
};

export interface CascaderOptionType extends DefaultOptionType {
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
  [key: string]: any;
}
export function cascaderProps<DataNodeType extends CascaderOptionType = CascaderOptionType>() {
  return {
    ...omit(vcCascaderProps(), ['customSlots', 'checkable', 'options']),
    multiple: { type: Boolean, default: undefined },
    size: String as PropType<SizeType>,
    bordered: { type: Boolean, default: undefined },
    placement: { type: String as PropType<SelectCommonPlacement> },
    suffixIcon: PropTypes.any,
    status: String as PropType<InputStatus>,
    options: Array as PropType<DataNodeType[]>,
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    'onUpdate:value': Function as PropType<(value: ValueType) => void>,
  };
}

export type CascaderProps = Partial<ExtractPropTypes<ReturnType<typeof cascaderProps>>>;

export interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

const Cascader = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACascader',
  inheritAttrs: false,
  props: initDefaultProps(cascaderProps(), {
    bordered: true,
    choiceTransitionName: '',
    allowClear: true,
  }),
  setup(props, { attrs, expose, slots, emit }) {
    // ====================== Warning ======================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !props.dropdownClassName,
        'Cascader',
        '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
      );
    }
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      prefixCls: cascaderPrefixCls,
      rootPrefixCls,
      getPrefixCls,
      direction,
      getPopupContainer,
      renderEmpty,
      size: contextSize,
      disabled,
    } = useConfigInject('cascader', props);
    const prefixCls = computed(() => getPrefixCls('select', props.prefixCls));
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => compactSize.value || contextSize.value);
    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? contextDisabled.value);

    const [wrapSelectSSR, hashId] = useSelectStyle(prefixCls);
    const [wrapCascaderSSR] = useStyle(cascaderPrefixCls);

    const isRtl = computed(() => direction.value === 'rtl');
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        devWarning(
          !props.multiple || !props.displayRender || !slots.displayRender,
          'Cascader',
          '`displayRender` not work on `multiple`. Please use `tagRender` instead.',
        );
      });
    }
    // ==================== Search =====================
    const mergedShowSearch = computed(() => {
      if (!props.showSearch) {
        return props.showSearch;
      }

      let searchConfig: ShowSearchType = {
        render: defaultSearchRender,
      };

      if (typeof props.showSearch === 'object') {
        searchConfig = {
          ...searchConfig,
          ...props.showSearch,
        };
      }

      return searchConfig;
    });

    // =================== Dropdown ====================
    const mergedDropdownClassName = computed(() =>
      classNames(
        props.popupClassName || props.dropdownClassName,
        `${cascaderPrefixCls.value}-dropdown`,
        {
          [`${cascaderPrefixCls.value}-dropdown-rtl`]: isRtl.value,
        },
        hashId.value,
      ),
    );

    const selectRef = ref<CascaderRef>();
    expose({
      focus() {
        selectRef.value?.focus();
      },
      blur() {
        selectRef.value?.blur();
      },
    } as CascaderRef);

    const handleChange: CascaderProps['onChange'] = (...args) => {
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur: CascaderProps['onBlur'] = (...args) => {
      emit('blur', ...args);
      formItemContext.onFieldBlur();
    };
    const mergedShowArrow = computed(() =>
      props.showArrow !== undefined ? props.showArrow : props.loading || !props.multiple,
    );
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl'
        ? ('bottomRight' as SelectCommonPlacement)
        : ('bottomLeft' as SelectCommonPlacement);
    });
    return () => {
      const {
        notFoundContent = slots.notFoundContent?.(),
        expandIcon = slots.expandIcon?.(),
        multiple,
        bordered,
        allowClear,
        choiceTransitionName,
        transitionName,
        id = formItemContext.id.value,
        ...restProps
      } = props;
      // =================== No Found ====================
      const mergedNotFoundContent = notFoundContent || renderEmpty('Cascader');

      // ===================== Icon ======================
      let mergedExpandIcon = expandIcon;
      if (!expandIcon) {
        mergedExpandIcon = isRtl.value ? <LeftOutlined /> : <RightOutlined />;
      }

      const loadingIcon = (
        <span class={`${prefixCls.value}-menu-item-loading-icon`}>
          <LoadingOutlined spin />
        </span>
      );

      // ===================== Icons =====================
      const { suffixIcon, removeIcon, clearIcon } = getIcons(
        {
          ...props,
          hasFeedback: formItemInputContext.hasFeedback,
          feedbackIcon: formItemInputContext.feedbackIcon,
          multiple,
          prefixCls: prefixCls.value,
          showArrow: mergedShowArrow.value,
        },
        slots,
      );
      return wrapCascaderSSR(
        wrapSelectSSR(
          <VcCascader
            {...restProps}
            {...attrs}
            id={id}
            prefixCls={prefixCls.value}
            class={[
              cascaderPrefixCls.value,
              {
                [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
                [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
                [`${prefixCls.value}-rtl`]: isRtl.value,
                [`${prefixCls.value}-borderless`]: !bordered,
                [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput,
              },
              getStatusClassNames(
                prefixCls.value,
                mergedStatus.value,
                formItemInputContext.hasFeedback,
              ),
              compactItemClassnames.value,
              attrs.class,
              hashId.value,
            ]}
            disabled={mergedDisabled.value}
            direction={direction.value}
            placement={placement.value}
            notFoundContent={mergedNotFoundContent}
            allowClear={allowClear}
            showSearch={mergedShowSearch.value}
            expandIcon={mergedExpandIcon}
            inputIcon={suffixIcon}
            removeIcon={removeIcon}
            clearIcon={clearIcon}
            loadingIcon={loadingIcon}
            checkable={!!multiple}
            dropdownClassName={mergedDropdownClassName.value}
            dropdownPrefixCls={cascaderPrefixCls.value}
            choiceTransitionName={getTransitionName(rootPrefixCls.value, '', choiceTransitionName)}
            transitionName={getTransitionName(
              rootPrefixCls.value,
              getTransitionDirection(placement.value),
              transitionName,
            )}
            getPopupContainer={getPopupContainer?.value}
            customSlots={{
              ...slots,
              checkable: () => <span class={`${cascaderPrefixCls.value}-checkbox-inner`} />,
            }}
            tagRender={props.tagRender || slots.tagRender}
            displayRender={props.displayRender || slots.displayRender}
            maxTagPlaceholder={props.maxTagPlaceholder || slots.maxTagPlaceholder}
            showArrow={formItemInputContext.hasFeedback || props.showArrow}
            onChange={handleChange}
            onBlur={handleBlur}
            v-slots={slots}
            ref={selectRef}
          />,
        ),
      );
    };
  },
});
export default withInstall<
  typeof Cascader & {
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
  }
>(
  Object.assign(Cascader, {
    SHOW_CHILD,
    SHOW_PARENT,
  } as any),
);
