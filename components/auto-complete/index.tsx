import type { App, VNode, ExtractPropTypes, CSSProperties, PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import Select, { selectProps } from '../select';
import { isValidElement, flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import Option from './Option';
import OptGroup from './OptGroup';
import omit from '../_util/omit';

import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { InputStatus } from '../_util/statusUtils';

import type { CustomSlotsType } from '../_util/type';

function isSelectOptionOrSelectOptGroup(child: any): boolean {
  return child?.type?.isSelectOption || child?.type?.isSelectOptGroup;
}

export const autoCompleteProps = () => ({
  ...omit(selectProps(), ['loading', 'mode', 'optionLabelProp', 'labelInValue']),
  dataSource: Array as PropType<{ value: any; text: any }[] | string[]>,
  dropdownMenuStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
  // optionLabelProp: String,
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
  prefixCls: String,
  showSearch: { type: Boolean, default: undefined },
  transitionName: String,
  choiceTransitionName: { type: String, default: 'zoom' },
  autofocus: { type: Boolean, default: undefined },
  backfill: { type: Boolean, default: undefined },
  // optionLabelProp: PropTypes.string.def('children'),
  filterOption: { type: [Boolean, Function], default: false },
  defaultActiveFirstOption: { type: Boolean, default: true },
  status: String as PropType<InputStatus>,
});

export type AutoCompleteProps = Partial<ExtractPropTypes<ReturnType<typeof autoCompleteProps>>>;

export const AutoCompleteOption = Option;

export const AutoCompleteOptGroup = OptGroup;

const AutoComplete = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAutoComplete',
  inheritAttrs: false,
  props: autoCompleteProps(),
  // emits: ['change', 'select', 'focus', 'blur'],
  slots: Object as CustomSlotsType<{
    option: any;
    // deprecated, should use props `options` instead, not slot
    options: any;
    default: any;
    notFoundContent: any;
    dataSource: any;
    clearIcon: any;
  }>,
  setup(props, { slots, attrs, expose }) {
    warning(
      !('dataSource' in slots),
      'AutoComplete',
      '`dataSource` slot is deprecated, please use props `options` instead.',
    );
    warning(
      !('options' in slots),
      'AutoComplete',
      '`options` slot is deprecated, please use props `options` instead.',
    );
    warning(
      !props.dropdownClassName,
      'AutoComplete',
      '`dropdownClassName` is deprecated, please use `popupClassName` instead.',
    );
    const selectRef = ref();
    const getInputElement = () => {
      const children = flattenChildren(slots.default?.());
      const element = children.length ? children[0] : undefined;
      return element;
    };

    const focus = () => {
      selectRef.value?.focus();
    };

    const blur = () => {
      selectRef.value?.blur();
    };

    expose({
      focus,
      blur,
    });
    const { prefixCls } = useConfigInject('select', props);
    return () => {
      const { size, dataSource, notFoundContent = slots.notFoundContent?.() } = props;
      let optionChildren: VNode[];
      const { class: className } = attrs;
      const cls = {
        [className as string]: !!className,
        [`${prefixCls.value}-lg`]: size === 'large',
        [`${prefixCls.value}-sm`]: size === 'small',
        [`${prefixCls.value}-show-search`]: true,
        [`${prefixCls.value}-auto-complete`]: true,
      };
      if (props.options === undefined) {
        const childArray = slots.dataSource?.() || slots.options?.() || [];
        if (childArray.length && isSelectOptionOrSelectOptGroup(childArray[0])) {
          optionChildren = childArray;
        } else {
          optionChildren = dataSource
            ? dataSource.map((item: any) => {
                if (isValidElement(item)) {
                  return item;
                }
                switch (typeof item) {
                  case 'string':
                    return (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    );
                  case 'object':
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  default:
                    throw new Error(
                      'AutoComplete[dataSource] only supports type `string[] | Object[]`.',
                    );
                }
              })
            : [];
        }
      }

      const selectProps = omit(
        {
          ...props,
          ...(attrs as any),
          mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
          // optionLabelProp,
          getInputElement,
          notFoundContent,
          // placeholder: '',
          class: cls,
          popupClassName: props.popupClassName || props.dropdownClassName,
          ref: selectRef,
        },
        ['dataSource', 'loading'],
      );
      return (
        <Select {...selectProps} v-slots={omit(slots, ['default', 'dataSource', 'options'])}>
          {optionChildren}
        </Select>
      );
    };
  },
});

/* istanbul ignore next */
export default Object.assign(AutoComplete, {
  Option,
  OptGroup,
  install(app: App) {
    app.component(AutoComplete.name, AutoComplete);
    app.component(Option.displayName, Option);
    app.component(OptGroup.displayName, OptGroup);
    return app;
  },
});
