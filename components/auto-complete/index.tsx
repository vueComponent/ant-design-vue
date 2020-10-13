import { App, defineComponent, inject, provide } from 'vue';
import { Option, OptGroup } from '../vc-select';
import Select, { AbstractSelectProps, SelectValue } from '../select';
import Input from '../input';
import InputElement from './InputElement';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import { getComponent, getOptionProps, isValidElement, getSlot } from '../_util/props-util';

function isSelectOptionOrSelectOptGroup(child: any): Boolean {
  return child && child.type && (child.type.isSelectOption || child.type.isSelectOptGroup);
}

const AutoCompleteProps = {
  ...AbstractSelectProps(),
  value: SelectValue,
  defaultValue: SelectValue,
  dataSource: PropTypes.array,
  dropdownMenuStyle: PropTypes.style,
  optionLabelProp: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.looseBool,
  // onChange?: (value: SelectValue) => void;
  // onSelect?: (value: SelectValue, option: Object) => any;
};

const AutoComplete = defineComponent({
  name: 'AAutoComplete',
  inheritAttrs: false,
  emits: ['change', 'select', 'focus', 'blur'],
  props: {
    ...AutoCompleteProps,
    prefixCls: PropTypes.string.def('ant-select'),
    showSearch: PropTypes.looseBool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
    autofocus: PropTypes.looseBool,
    backfill: PropTypes.looseBool,
    optionLabelProp: PropTypes.string.def('children'),
    filterOption: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(false),
    defaultActiveFirstOption: PropTypes.looseBool.def(true),
  },
  Option: { ...Option, name: 'AAutoCompleteOption' },
  OptGroup: { ...OptGroup, name: 'AAutoCompleteOptGroup' },
  setup() {
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
    savePopupRef(ref: any) {
      this.popupRef = ref;
    },
    saveSelect(node: any) {
      this.select = node;
    },
    getInputElement() {
      const children = getSlot(this);
      const element = children.length ? children[0] : <Input lazy={false} />;
      return (
        <InputElement placeholder={this.placeholder} {...element.props}>
          {element}
        </InputElement>
      );
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
    const { size, prefixCls: customizePrefixCls, optionLabelProp, dataSource } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('select', customizePrefixCls);
    const { class: className } = this.$attrs as any;
    const cls = {
      [className]: !!className,
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-show-search`]: true,
      [`${prefixCls}-auto-complete`]: true,
    };

    let options;
    const childArray = getSlot(this, 'dataSource');
    if (childArray.length && isSelectOptionOrSelectOptGroup(childArray[0])) {
      options = childArray;
    } else {
      options = dataSource
        ? dataSource.map((item: any) => {
            if (isValidElement(item)) {
              return item;
            }
            switch (typeof item) {
              case 'string':
                return <Option key={item}>{item}</Option>;
              case 'object':
                return <Option key={item.value}>{item.text}</Option>;
              default:
                throw new Error(
                  'AutoComplete[dataSource] only supports type `string[] | Object[]`.',
                );
            }
          })
        : [];
    }
    const selectProps = {
      ...getOptionProps(this),
      ...this.$attrs,
      mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
      optionLabelProp,
      getInputElement: this.getInputElement,
      notFoundContent: getComponent(this, 'notFoundContent'),
      placeholder: '',
      class: cls,
      ref: this.saveSelect,
    };
    return <Select {...selectProps}>{options}</Select>;
  },
});

/* istanbul ignore next */
AutoComplete.install = function(app: App) {
  app.component(AutoComplete.name, AutoComplete);
  app.component(AutoComplete.Option.name, AutoComplete.Option);
  app.component(AutoComplete.OptGroup.name, AutoComplete.OptGroup);
  return app;
};

export default AutoComplete;
