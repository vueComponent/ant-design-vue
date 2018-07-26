import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import VcSelect, { Option, OptGroup } from '../vc-select';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { getComponentFromProp, getOptionProps, filterEmpty } from '../_util/props-util';

var AbstractSelectProps = function AbstractSelectProps() {
  return {
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    notFoundContent: PropTypes.any,
    transitionName: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    showSearch: PropTypes.bool,
    allowClear: PropTypes.bool,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    placeholder: PropTypes.any,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.any,
    dropdownMenuStyle: PropTypes.any,
    // onSearch: (value: string) => any,
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    autoFocus: PropTypes.bool,
    backfill: PropTypes.bool,
    showArrow: PropTypes.bool
  };
};
var Value = PropTypes.shape({
  key: PropTypes.string
}).loose;

var SelectValue = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([Value, PropTypes.string, PropTypes.number])), Value]);

var SelectProps = _extends({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  optionLabelProp: PropTypes.string,
  // onChange?: (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  // onSelect?: (value: SelectValue, option: React.ReactElement<any>) => any;
  // onDeselect?: (value: SelectValue) => any;
  // onBlur?: () => any;
  // onFocus?: () => any;
  // onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.any,
  dropdownMatchSelectWidth: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  labelInValue: PropTypes.boolean,
  getPopupContainer: PropTypes.func,
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  options: PropTypes.array
});

var SelectPropTypes = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  combobox: PropTypes.bool,
  notFoundContent: PropTypes.any,
  showSearch: PropTypes.bool,
  optionLabelProp: PropTypes.string,
  transitionName: PropTypes.string,
  choiceTransitionName: PropTypes.string
};

export { AbstractSelectProps, SelectValue, SelectProps };

export default {
  Option: _extends({}, Option, { name: 'ASelectOption' }),
  OptGroup: _extends({}, OptGroup, { name: 'ASelectOptGroup' }),
  name: 'ASelect',
  props: _extends({}, SelectProps, {
    prefixCls: PropTypes.string.def('ant-select'),
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom')
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

      var notFoundContent = getComponentFromProp(this, 'notFoundContent');
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

      var _getOptionProps = getOptionProps(this),
          prefixCls = _getOptionProps.prefixCls,
          size = _getOptionProps.size,
          mode = _getOptionProps.mode,
          options = _getOptionProps.options,
          restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'size', 'mode', 'options']);

      var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _cls);

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
        props: _extends({}, restProps, modeConfig, {
          prefixCls: prefixCls,
          optionLabelProp: optionLabelProp || 'children',
          notFoundContent: this.getNotFoundContent(locale),
          maxTagPlaceholder: getComponentFromProp(this, 'maxTagPlaceholder'),
          placeholder: getComponentFromProp(this, 'placeholder')
        }),
        on: this.$listeners,
        'class': cls,
        ref: 'vcSelect'
      };

      return h(
        VcSelect,
        selectProps,
        [options ? options.map(function (option) {
          var key = option.key,
              _option$label = option.label,
              label = _option$label === undefined ? option.title : _option$label,
              restOption = _objectWithoutProperties(option, ['key', 'label']);

          return h(
            Option,
            _mergeJSXProps([{ key: key }, { props: restOption }]),
            [label]
          );
        }) : filterEmpty(this.$slots['default'])]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Select',
        defaultLocale: defaultLocale.Select,
        children: this.renderSelect
      }
    });
  }
};