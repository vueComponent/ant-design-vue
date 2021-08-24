import type { App, Plugin, VNode, ExtractPropTypes } from 'vue';
import { defineComponent, inject, provide } from 'vue';
import Select, { SelectProps } from '../select';
import Input from '../input';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { getComponent, getOptionProps, isValidElement, getSlot } from '../_util/props-util';
import Omit from 'omit.js';
import warning from '../_util/warning';
import Option from './Option';
import OptGroup from './OptGroup';

function isSelectOptionOrSelectOptGroup(child: any): boolean {
  return child?.type?.isSelectOption || child?.type?.isSelectOptGroup;
}

const autoCompleteProps = {
  ...SelectProps(),
  dataSource: PropTypes.array,
  dropdownMenuStyle: PropTypes.style,
  optionLabelProp: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.looseBool,
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
  Option,
  OptGroup,
  setup(props, { slots }) {
    warning(
      !(props.dataSource !== undefined || 'dataSource' in slots),
      'AutoComplete',
      '`dataSource` is deprecated, please use `options` instead.',
    );
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      popupRef: null,
      select: null,
    };
  },
  created() {
    provide('savePopupRef', this.savePopupRef);
  },
  methods: {
    savePopupRef(ref: VNode) {
      this.popupRef = ref;
    },
    saveSelect(node: VNode) {
      this.select = node;
    },
    getInputElement() {
      const children = getSlot(this);
      const element = children.length ? children[0] : <Input lazy={false} />;
      return element;
    },

    focus() {
      if (this.select) {
        this.select.focus();
      }
    },

    blur() {
      if (this.select) {
        this.select.blur();
      }
    },
  },

  render() {
    const { size, prefixCls: customizePrefixCls, dataSource } = this;
    let optionChildren: VNode[];
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('select', customizePrefixCls);
    const { class: className } = this.$attrs;
    const cls = {
      [className as string]: !!className,
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-show-search`]: true,
      [`${prefixCls}-auto-complete`]: true,
    };
    let childArray = getSlot(this, 'dataSource');
    if ('options' in this.$slots) {
      childArray = getSlot(this, 'options');
    }
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
    const selectProps = {
      ...Omit(getOptionProps(this), ['dataSource', 'optionLabelProp']),
      ...this.$attrs,
      mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
      // optionLabelProp,
      getInputElement: this.getInputElement,
      notFoundContent: getComponent(this, 'notFoundContent'),
      // placeholder: '',
      class: cls,
      ref: this.saveSelect,
    };
    return <Select {...selectProps}>{optionChildren}</Select>;
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
