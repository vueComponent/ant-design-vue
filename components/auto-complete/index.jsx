import { Option, OptGroup } from '../vc-select';
import Select, { AbstractSelectProps, SelectValue } from '../select';
import Input from '../input';
import InputElement from './InputElement';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import {
  getComponentFromProp,
  getOptionProps,
  filterEmpty,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import Base from '../base';

// const DataSourceItemObject = PropTypes.shape({
//   value: String,
//   text: String,
// }).loose
// const DataSourceItemType = PropTypes.oneOfType([
//   PropTypes.string,
//   DataSourceItemObject,
// ]).isRequired

// export interface AutoCompleteInputProps {
//   onChange?: React.FormEventHandler<any>;
//   value: any;
// }

const AutoCompleteProps = {
  ...AbstractSelectProps(),
  value: SelectValue,
  defaultValue: SelectValue,
  dataSource: PropTypes.array,
  optionLabelProp: String,
  dropdownMatchSelectWidth: PropTypes.bool,
  // onChange?: (value: SelectValue) => void;
  // onSelect?: (value: SelectValue, option: Object) => any;
};

const AutoComplete = {
  name: 'AAutoComplete',
  props: {
    ...AutoCompleteProps,
    prefixCls: PropTypes.string.def('ant-select'),
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
    autoFocus: PropTypes.bool,
    backfill: PropTypes.bool,
    optionLabelProp: PropTypes.string.def('children'),
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(false),
    defaultActiveFirstOption: PropTypes.bool.def(true),
  },
  Option: { ...Option, name: 'AAutoCompleteOption' },
  OptGroup: { ...OptGroup, name: 'AAutoCompleteOptGroup' },
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  provide() {
    return {
      savePopupRef: this.savePopupRef,
    };
  },
  methods: {
    savePopupRef(ref) {
      this.popupRef = ref;
    },

    getInputElement() {
      const { $slots } = this;
      const children = filterEmpty($slots.default);
      const element = children.length ? children[0] : <Input lazy={false} />;
      return <InputElement>{element}</InputElement>;
    },

    focus() {
      if (this.$refs.select) {
        this.$refs.select.focus();
      }
    },

    blur() {
      if (this.$refs.select) {
        this.$refs.select.blur();
      }
    },
  },

  render() {
    const { size, prefixCls: customizePrefixCls, optionLabelProp, dataSource, $slots } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const cls = {
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-show-search`]: true,
      [`${prefixCls}-auto-complete`]: true,
    };

    let options;
    const childArray = filterEmpty($slots.dataSource);
    if (childArray.length) {
      options = childArray;
    } else {
      options = dataSource
        ? dataSource.map(item => {
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
      props: {
        ...getOptionProps(this),
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        optionLabelProp,
        getInputElement: this.getInputElement,
        notFoundContent: getComponentFromProp(this, 'notFoundContent'),
      },
      class: cls,
      ref: 'select',
      on: getListeners(this),
    };
    return <Select {...selectProps}>{options}</Select>;
  },
};

/* istanbul ignore next */
AutoComplete.install = function(Vue) {
  Vue.use(Base);
  Vue.component(AutoComplete.name, AutoComplete);
  Vue.component(AutoComplete.Option.name, AutoComplete.Option);
  Vue.component(AutoComplete.OptGroup.name, AutoComplete.OptGroup);
};

export default AutoComplete;
