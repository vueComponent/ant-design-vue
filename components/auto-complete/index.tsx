import type { App, Plugin, VNode, ExtractPropTypes } from 'vue';
import { defineComponent, ref } from 'vue';
import Select, { selectProps } from '../select';
import PropTypes from '../_util/vue-types';
import { isValidElement, flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import Option from './Option';
import OptGroup from './OptGroup';
import omit from '../_util/omit';
import useConfigInject from '../_util/hooks/useConfigInject';

function isSelectOptionOrSelectOptGroup(child: any): boolean {
  return child?.type?.isSelectOption || child?.type?.isSelectOptGroup;
}

const autoCompleteProps = {
  ...selectProps(),
  dataSource: PropTypes.array,
  dropdownMenuStyle: PropTypes.style,
  optionLabelProp: PropTypes.string,
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
};

export type AutoCompleteProps = Partial<ExtractPropTypes<typeof autoCompleteProps>>;

export const AutoCompleteOption = Option;

export const AutoCompleteOptGroup = OptGroup;

const AutoComplete = defineComponent({
  name: 'AAutoComplete',
  inheritAttrs: false,
  props: {
    ...autoCompleteProps,
    prefixCls: PropTypes.string,
    showSearch: PropTypes.looseBool,
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
    autofocus: PropTypes.looseBool,
    backfill: PropTypes.looseBool,
    optionLabelProp: PropTypes.string.def('children'),
    filterOption: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(false),
    defaultActiveFirstOption: PropTypes.looseBool.def(true),
  },
  emits: ['change', 'select', 'focus', 'blur'],
  slots: ['option'],
  Option,
  OptGroup,
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

      const selectProps = {
        ...omit(props, ['dataSource', 'optionLabelProp']),
        ...attrs,
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        // optionLabelProp,
        getInputElement,
        notFoundContent,
        // placeholder: '',
        class: cls,
        ref: selectRef,
      };
      return (
        <Select {...selectProps} v-slots={{ option: slots.option }}>
          {optionChildren}
        </Select>
      );
    };
  },
});

/* istanbul ignore next */
AutoComplete.install = function (app: App) {
  app.component(AutoComplete.name, AutoComplete);
  app.component(AutoComplete.Option.displayName, AutoComplete.Option);
  app.component(AutoComplete.OptGroup.displayName, AutoComplete.OptGroup);
  return app;
};

export default AutoComplete as typeof AutoComplete &
  Plugin & {
    readonly Option: typeof Option;
    readonly OptGroup: typeof OptGroup;
  };
