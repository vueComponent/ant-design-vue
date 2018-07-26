'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectProps = exports.SelectValue = exports.AbstractSelectProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcSelect = require('../vc-select');

var _vcSelect2 = _interopRequireDefault(_vcSelect);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default = require('../locale-provider/default');

var _default2 = _interopRequireDefault(_default);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AbstractSelectProps = function AbstractSelectProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    size: _vueTypes2['default'].oneOf(['small', 'large', 'default']),
    notFoundContent: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    choiceTransitionName: _vueTypes2['default'].string,
    showSearch: _vueTypes2['default'].bool,
    allowClear: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    tabIndex: _vueTypes2['default'].number,
    placeholder: _vueTypes2['default'].any,
    defaultActiveFirstOption: _vueTypes2['default'].bool,
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].any,
    dropdownMenuStyle: _vueTypes2['default'].any,
    // onSearch: (value: string) => any,
    filterOption: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    autoFocus: _vueTypes2['default'].bool,
    backfill: _vueTypes2['default'].bool,
    showArrow: _vueTypes2['default'].bool
  };
};
var Value = _vueTypes2['default'].shape({
  key: _vueTypes2['default'].string
}).loose;

var SelectValue = _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([Value, _vueTypes2['default'].string, _vueTypes2['default'].number])), Value]);

var SelectProps = (0, _extends3['default'])({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  mode: _vueTypes2['default'].oneOf(['default', 'multiple', 'tags', 'combobox']),
  optionLabelProp: _vueTypes2['default'].string,
  // onChange?: (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  // onSelect?: (value: SelectValue, option: React.ReactElement<any>) => any;
  // onDeselect?: (value: SelectValue) => any;
  // onBlur?: () => any;
  // onFocus?: () => any;
  // onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxTagCount: _vueTypes2['default'].number,
  maxTagPlaceholder: _vueTypes2['default'].any,
  dropdownMatchSelectWidth: _vueTypes2['default'].bool,
  optionFilterProp: _vueTypes2['default'].string,
  labelInValue: _vueTypes2['default'].boolean,
  getPopupContainer: _vueTypes2['default'].func,
  tokenSeparators: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  getInputElement: _vueTypes2['default'].func,
  options: _vueTypes2['default'].array
});

var SelectPropTypes = {
  prefixCls: _vueTypes2['default'].string,
  size: _vueTypes2['default'].oneOf(['default', 'large', 'small']),
  combobox: _vueTypes2['default'].bool,
  notFoundContent: _vueTypes2['default'].any,
  showSearch: _vueTypes2['default'].bool,
  optionLabelProp: _vueTypes2['default'].string,
  transitionName: _vueTypes2['default'].string,
  choiceTransitionName: _vueTypes2['default'].string
};

exports.AbstractSelectProps = AbstractSelectProps;
exports.SelectValue = SelectValue;
exports.SelectProps = SelectProps;
exports['default'] = {
  Option: (0, _extends3['default'])({}, _vcSelect.Option, { name: 'ASelectOption' }),
  OptGroup: (0, _extends3['default'])({}, _vcSelect.OptGroup, { name: 'ASelectOptGroup' }),
  name: 'ASelect',
  props: (0, _extends3['default'])({}, SelectProps, {
    prefixCls: _vueTypes2['default'].string.def('ant-select'),
    showSearch: _vueTypes2['default'].bool.def(false),
    transitionName: _vueTypes2['default'].string.def('slide-up'),
    choiceTransitionName: _vueTypes2['default'].string.def('zoom')
  }),
  propTypes: SelectPropTypes,
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    focus: function focus() {
      this.$refs.vcSelect.focus();
    },
    blur: function blur() {
      this.$refs.vcSelect.blur();
    },
    getNotFoundContent: function getNotFoundContent(locale) {
      var mode = this.$props.mode;

      var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
      var isCombobox = mode === 'combobox';
      if (isCombobox) {
        // AutoComplete don't have notFoundContent defaultly
        return notFoundContent === undefined ? null : notFoundContent;
      }
      return notFoundContent === undefined ? locale.notFoundContent : notFoundContent;
    },
    renderSelect: function renderSelect(locale) {
      var _cls;

      var h = this.$createElement;

      var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
          prefixCls = _getOptionProps.prefixCls,
          size = _getOptionProps.size,
          mode = _getOptionProps.mode,
          options = _getOptionProps.options,
          restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'size', 'mode', 'options']);

      var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-sm', size === 'small'), _cls);

      var optionLabelProp = this.$props.optionLabelProp;

      var isCombobox = mode === 'combobox';
      if (isCombobox) {
        // children 带 dom 结构时，无法填入输入框
        optionLabelProp = optionLabelProp || 'value';
      }

      var modeConfig = {
        multiple: mode === 'multiple',
        tags: mode === 'tags',
        combobox: isCombobox
      };
      var selectProps = {
        props: (0, _extends3['default'])({}, restProps, modeConfig, {
          prefixCls: prefixCls,
          optionLabelProp: optionLabelProp || 'children',
          notFoundContent: this.getNotFoundContent(locale),
          maxTagPlaceholder: (0, _propsUtil.getComponentFromProp)(this, 'maxTagPlaceholder'),
          placeholder: (0, _propsUtil.getComponentFromProp)(this, 'placeholder')
        }),
        on: this.$listeners,
        'class': cls,
        ref: 'vcSelect'
      };

      return h(
        _vcSelect2['default'],
        selectProps,
        [options ? options.map(function (option) {
          var key = option.key,
              _option$label = option.label,
              label = _option$label === undefined ? option.title : _option$label,
              restOption = (0, _objectWithoutProperties3['default'])(option, ['key', 'label']);

          return h(
            _vcSelect.Option,
            (0, _babelHelperVueJsxMergeProps2['default'])([{ key: key }, { props: restOption }]),
            [label]
          );
        }) : (0, _propsUtil.filterEmpty)(this.$slots['default'])]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Select',
        defaultLocale: _default2['default'].Select,
        children: this.renderSelect
      }
    });
  }
};