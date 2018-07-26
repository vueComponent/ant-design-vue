'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcSelect = require('../vc-select');

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _InputElement = require('./InputElement');

var _InputElement2 = _interopRequireDefault(_InputElement);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var AutoCompleteProps = (0, _extends3['default'])({}, (0, _select.AbstractSelectProps)(), {
  value: _select.SelectValue,
  defaultValue: _select.SelectValue,
  dataSource: _vueTypes2['default'].array,
  optionLabelProp: String,
  dropdownMatchSelectWidth: _vueTypes2['default'].bool
  // onChange?: (value: SelectValue) => void;
  // onSelect?: (value: SelectValue, option: Object) => any;
});

exports['default'] = {
  name: 'AAutoComplete',
  props: (0, _extends3['default'])({}, AutoCompleteProps, {
    prefixCls: _vueTypes2['default'].string.def('ant-select'),
    showSearch: _vueTypes2['default'].bool.def(false),
    transitionName: _vueTypes2['default'].string.def('slide-up'),
    choiceTransitionName: _vueTypes2['default'].string.def('zoom'),
    optionLabelProp: _vueTypes2['default'].string.def('children'),
    filterOption: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]).def(false),
    defaultActiveFirstOption: _vueTypes2['default'].bool.def(true)
  }),
  Option: (0, _extends3['default'])({}, _vcSelect.Option, { name: 'AAutoCompleteOption' }),
  OptGroup: (0, _extends3['default'])({}, _vcSelect.OptGroup, { name: 'AAutoCompleteOptGroup' }),
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    getInputElement: function getInputElement() {
      var h = this.$createElement;
      var $slots = this.$slots;

      var children = (0, _propsUtil.filterEmpty)($slots['default']);
      var element = children.length ? children[0] : h(_input2['default']);
      return h(_InputElement2['default'], [element]);
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


    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_cls, prefixCls + '-show-search', true), (0, _defineProperty3['default'])(_cls, prefixCls + '-auto-complete', true), _cls);

    var options = void 0;
    var childArray = (0, _propsUtil.filterEmpty)($slots.dataSource);
    if (childArray.length) {
      options = childArray;
    } else {
      options = dataSource ? dataSource.map(function (item) {
        if ((0, _propsUtil.isValidElement)(item)) {
          return item;
        }
        switch (typeof item === 'undefined' ? 'undefined' : (0, _typeof3['default'])(item)) {
          case 'string':
            return h(
              _vcSelect.Option,
              { key: item },
              [item]
            );
          case 'object':
            return h(
              _vcSelect.Option,
              { key: item.value },
              [item.text]
            );
          default:
            throw new Error('AutoComplete[dataSource] only supports type `string[] | Object[]`.');
        }
      }) : [];
    }
    var selectProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        mode: 'combobox',
        optionLabelProp: optionLabelProp,
        getInputElement: this.getInputElement,
        notFoundContent: (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent')
      }),
      'class': cls,
      ref: 'select',
      on: (0, _extends3['default'])({}, $listeners)
    };
    return h(
      _select2['default'],
      selectProps,
      [options]
    );
  }
};
module.exports = exports['default'];