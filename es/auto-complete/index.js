import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import { Option, OptGroup } from '../vc-select';
import Select, { AbstractSelectProps, SelectValue } from '../select';
import Input from '../input';
import InputElement from './InputElement';
import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getOptionProps, filterEmpty, isValidElement } from '../_util/props-util';

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

var AutoCompleteProps = _extends({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  dataSource: PropTypes.array,
  optionLabelProp: String,
  dropdownMatchSelectWidth: PropTypes.bool
  // onChange?: (value: SelectValue) => void;
  // onSelect?: (value: SelectValue, option: Object) => any;
});

export default {
  name: 'AAutoComplete',
  props: _extends({}, AutoCompleteProps, {
    prefixCls: PropTypes.string.def('ant-select'),
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
    optionLabelProp: PropTypes.string.def('children'),
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(false),
    defaultActiveFirstOption: PropTypes.bool.def(true)
  }),
  Option: _extends({}, Option, { name: 'AAutoCompleteOption' }),
  OptGroup: _extends({}, OptGroup, { name: 'AAutoCompleteOptGroup' }),
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    getInputElement: function getInputElement() {
      var h = this.$createElement;
      var $slots = this.$slots;

      var children = filterEmpty($slots['default']);
      var element = children.length ? children[0] : h(Input);
      return h(InputElement, [element]);
    },
    focus: function focus() {
      if (this.$refs.select) {
        this.$refs.select.focus();
      }
    },
    blur: function blur() {
      if (this.$refs.select) {
        this.$refs.select.blur();
      }
    }
  },

  render: function render() {
    var _cls;

    var h = arguments[0];
    var size = this.size,
        prefixCls = this.prefixCls,
        optionLabelProp = this.optionLabelProp,
        dataSource = this.dataSource,
        $slots = this.$slots,
        $listeners = this.$listeners;


    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _defineProperty(_cls, prefixCls + '-show-search', true), _defineProperty(_cls, prefixCls + '-auto-complete', true), _cls);

    var options = void 0;
    var childArray = filterEmpty($slots.dataSource);
    if (childArray.length) {
      options = childArray;
    } else {
      options = dataSource ? dataSource.map(function (item) {
        if (isValidElement(item)) {
          return item;
        }
        switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
          case 'string':
            return h(
              Option,
              { key: item },
              [item]
            );
          case 'object':
            return h(
              Option,
              { key: item.value },
              [item.text]
            );
          default:
            throw new Error('AutoComplete[dataSource] only supports type `string[] | Object[]`.');
        }
      }) : [];
    }
    var selectProps = {
      props: _extends({}, getOptionProps(this), {
        mode: 'combobox',
        optionLabelProp: optionLabelProp,
        getInputElement: this.getInputElement,
        notFoundContent: getComponentFromProp(this, 'notFoundContent')
      }),
      'class': cls,
      ref: 'select',
      on: _extends({}, $listeners)
    };
    return h(
      Select,
      selectProps,
      [options]
    );
  }
};