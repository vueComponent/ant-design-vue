import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import VcCascader from '../vc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';
import omit from 'omit.js';
import KeyCode from '../_util/KeyCode';
import Input from '../input';
import Icon from '../icon';
import { hasProp, filterEmpty, getOptionProps, getStyle, getClass, getAttrs } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

var CascaderOptionType = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.array,
  __IS_FILTERED_OPTION: PropTypes.bool
}).loose;

var CascaderExpandTrigger = PropTypes.oneOf(['click', 'hover']);

var ShowSearchType = PropTypes.shape({
  filter: PropTypes.func,
  render: PropTypes.func,
  sort: PropTypes.func,
  matchInputWidth: PropTypes.bool
}).loose;
function noop() {}

var CascaderProps = {
  /** 可选项数据源 */
  options: PropTypes.arrayOf(CascaderOptionType).def([]),
  /** 默认的选中项 */
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  /** 指定选中项 */
  value: PropTypes.arrayOf(PropTypes.string),
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def({}),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).def('bottomLeft'),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(['large', 'default', 'small']),
  /** 禁用*/
  disabled: PropTypes.bool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.bool.def(true),
  showSearch: PropTypes.oneOfType([Boolean, ShowSearchType]),
  notFoundContent: PropTypes.any.def('Not Found'),
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: CascaderExpandTrigger,
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.bool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string.def('ant-cascader'),
  inputPrefixCls: PropTypes.string.def('ant-input'),
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.bool,
  autoFocus: PropTypes.bool
};

function defaultFilterOption(inputValue, path) {
  return path.some(function (option) {
    return option.label.indexOf(inputValue) > -1;
  });
}

function defaultSortFilteredOption(a, b, inputValue) {
  function callback(elem) {
    return elem.label.indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

var defaultDisplayRender = function defaultDisplayRender(_ref) {
  var labels = _ref.labels;
  return labels.join(' / ');
};

export default {
  inheritAttrs: false,
  name: 'ACascader',
  mixins: [BaseMixin],
  props: CascaderProps,
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    this.cachedOptions = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        popupVisible = this.popupVisible,
        showSearch = this.showSearch,
        options = this.options,
        changeOnSelect = this.changeOnSelect,
        flattenTree = this.flattenTree;

    return {
      sValue: value || defaultValue || [],
      inputValue: '',
      inputFocused: false,
      sPopupVisible: popupVisible,
      flattenOptions: showSearch && flattenTree(options, changeOnSelect)
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus && !_this.showSearch && !_this.disabled) {
        _this.$refs.picker.focus();
      }
    });
  },

  watch: {
    value: function value(val) {
      this.setState({ sValue: val || [] });
    },
    popupVisible: function popupVisible(val) {
      this.setState({ sPopupVisible: val });
    },
    options: function options(val) {
      if (this.showSearch) {
        this.setState({ flattenOptions: this.flattenTree(this.options, this.changeOnSelect) });
      }
    }
  },
  methods: {
    highlightKeyword: function highlightKeyword(str, keyword, prefixCls) {
      var h = this.$createElement;

      return str.split(keyword).map(function (node, index) {
        return index === 0 ? node : [h(
          'span',
          { 'class': prefixCls + '-menu-item-keyword' },
          [keyword]
        ), node];
      });
    },
    defaultRenderFilteredOption: function defaultRenderFilteredOption(_ref2) {
      var _this2 = this;

      var inputValue = _ref2.inputValue,
          path = _ref2.path,
          prefixCls = _ref2.prefixCls;

      return path.map(function (_ref3, index) {
        var label = _ref3.label;

        var node = label.indexOf(inputValue) > -1 ? _this2.highlightKeyword(label, inputValue, prefixCls) : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    handleChange: function handleChange(value, selectedOptions) {
      this.setState({ inputValue: '' });
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        var unwrappedValue = value[0];
        var unwrappedSelectedOptions = selectedOptions[0].path;
        this.setValue(unwrappedValue, unwrappedSelectedOptions);
        return;
      }
      this.setValue(value, selectedOptions);
    },
    handlePopupVisibleChange: function handlePopupVisibleChange(popupVisible) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState({
          sPopupVisible: popupVisible,
          inputFocused: popupVisible,
          inputValue: popupVisible ? this.inputValue : ''
        });
      }
      this.$emit('popupVisibleChange', popupVisible);
    },
    handleInputFocus: function handleInputFocus(e) {
      this.$emit('focus', e);
    },
    handleInputBlur: function handleInputBlur(e) {
      this.setState({
        inputFocused: false
      });
      this.$emit('blur', e);
    },
    handleInputClick: function handleInputClick(e) {
      var inputFocused = this.inputFocused,
          sPopupVisible = this.sPopupVisible;
      // Prevent `Trigger` behaviour.

      if (inputFocused || sPopupVisible) {
        e.stopPropagation();
        e.nativeEvent && e.nativeEvent.stopImmediatePropagation();
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === KeyCode.BACKSPACE) {
        e.stopPropagation();
      }
    },
    handleInputChange: function handleInputChange(e) {
      var inputValue = e.target.value;
      this.setState({ inputValue: inputValue });
    },
    setValue: function setValue(value, selectedOptions) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      this.$emit('change', value, selectedOptions);
    },
    getLabel: function getLabel() {
      var options = this.options,
          $scopedSlots = this.$scopedSlots;

      var displayRender = this.displayRender || $scopedSlots.displayRender || defaultDisplayRender;
      var value = this.sValue;
      var unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
      var selectedOptions = arrayTreeFilter(options, function (o, level) {
        return o.value === unwrappedValue[level];
      });
      var labels = selectedOptions.map(function (o) {
        return o.label;
      });
      return displayRender({ labels: labels, selectedOptions: selectedOptions });
    },
    clearSelection: function clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.inputValue) {
        this.setValue([]);
        this.handlePopupVisibleChange(false);
      } else {
        this.setState({ inputValue: '' });
      }
    },
    flattenTree: function flattenTree(options, changeOnSelect) {
      var _this3 = this;

      var ancestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var flattenOptions = [];
      options.forEach(function (option) {
        var path = ancestor.concat(option);
        if (changeOnSelect || !option.children || !option.children.length) {
          flattenOptions.push(path);
        }
        if (option.children) {
          flattenOptions = flattenOptions.concat(_this3.flattenTree(option.children, changeOnSelect, path));
        }
      });
      return flattenOptions;
    },
    generateFilteredOptions: function generateFilteredOptions(prefixCls) {
      var showSearch = this.showSearch,
          notFoundContent = this.notFoundContent,
          flattenOptions = this.flattenOptions,
          inputValue = this.inputValue,
          $scopedSlots = this.$scopedSlots;
      var _showSearch$filter = showSearch.filter,
          filter = _showSearch$filter === undefined ? defaultFilterOption : _showSearch$filter,
          _showSearch$sort = showSearch.sort,
          sort = _showSearch$sort === undefined ? defaultSortFilteredOption : _showSearch$sort;

      var render = showSearch.render || $scopedSlots.showSearchRender || this.defaultRenderFilteredOption;
      var filtered = flattenOptions.filter(function (path) {
        return filter(inputValue, path);
      }).sort(function (a, b) {
        return sort(a, b, inputValue);
      });

      if (filtered.length > 0) {
        return filtered.map(function (path) {
          return {
            __IS_FILTERED_OPTION: true,
            path: path,
            label: render({ inputValue: inputValue, path: path, prefixCls: prefixCls }),
            value: path.map(function (o) {
              return o.value;
            }),
            disabled: path.some(function (o) {
              return o.disabled;
            })
          };
        });
      }
      return [{ label: notFoundContent, value: 'ANT_CASCADER_NOT_FOUND', disabled: true }];
    },
    focus: function focus() {
      if (this.showSearch) {
        this.$refs.input.focus();
      } else {
        this.$refs.picker.focus();
      }
    },
    blur: function blur() {
      if (this.showSearch) {
        this.$refs.input.blur();
      } else {
        this.$refs.picker.blur();
      }
    }
  },

  render: function render() {
    var _classNames, _classNames2, _classNames3;

    var h = arguments[0];
    var $slots = this.$slots,
        value = this.sValue,
        sPopupVisible = this.sPopupVisible,
        inputValue = this.inputValue,
        $listeners = this.$listeners;

    var props = getOptionProps(this);

    var prefixCls = props.prefixCls,
        inputPrefixCls = props.inputPrefixCls,
        placeholder = props.placeholder,
        size = props.size,
        disabled = props.disabled,
        allowClear = props.allowClear,
        _props$showSearch = props.showSearch,
        showSearch = _props$showSearch === undefined ? false : _props$showSearch,
        otherProps = _objectWithoutProperties(props, ['prefixCls', 'inputPrefixCls', 'placeholder', 'size', 'disabled', 'allowClear', 'showSearch']);

    var sizeCls = classNames((_classNames = {}, _defineProperty(_classNames, inputPrefixCls + '-lg', size === 'large'), _defineProperty(_classNames, inputPrefixCls + '-sm', size === 'small'), _classNames));
    var clearIcon = allowClear && !disabled && value.length > 0 || inputValue ? h(Icon, {
      attrs: {
        type: 'cross-circle'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      },

      key: 'clear-icon'
    }) : null;
    var arrowCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-picker-arrow', true), _defineProperty(_classNames2, prefixCls + '-picker-arrow-expand', sPopupVisible), _classNames2));
    var pickerCls = classNames(getClass(this), prefixCls + '-picker', (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-picker-with-value', inputValue), _defineProperty(_classNames3, prefixCls + '-picker-disabled', disabled), _defineProperty(_classNames3, prefixCls + '-picker-' + size, !!size), _classNames3));

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    var tempInputProps = omit(otherProps, ['options', 'popupPlacement', 'transitionName', 'displayRender', 'changeOnSelect', 'expandTrigger', 'popupVisible', 'getPopupContainer', 'loadData', 'popupClassName', 'filterOption', 'renderFilteredOption', 'sortFilteredOption', 'notFoundContent', 'defaultValue']);

    var options = this.options;
    if (inputValue) {
      options = this.generateFilteredOptions(prefixCls);
    }
    // Dropdown menu should keep previous status until it is fully closed.
    if (!sPopupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    var dropdownMenuColumnStyle = {};
    var isNotFound = (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    var resultListMatchInputWidth = showSearch.matchInputWidth !== false;
    if (resultListMatchInputWidth && inputValue && this.input) {
      dropdownMenuColumnStyle.width = this.input.input.offsetWidth;
    }
    // showSearch时，focus、blur在input上触发，反之在ref='picker'上触发
    var inputProps = {
      props: _extends({}, tempInputProps, {
        prefixCls: inputPrefixCls,
        placeholder: value && value.length > 0 ? undefined : placeholder,
        value: inputValue,
        disabled: disabled,
        readOnly: !showSearch,
        autoComplete: 'off'
      }),
      'class': prefixCls + '-input ' + sizeCls,
      ref: 'input',
      on: {
        focus: showSearch ? this.handleInputFocus : noop,
        click: showSearch ? this.handleInputClick : noop,
        blur: showSearch ? this.handleInputBlur : noop,
        keydown: this.handleKeyDown,
        change: showSearch ? this.handleInputChange : noop
      },
      attrs: getAttrs(this)
    };
    var children = filterEmpty($slots['default']);
    var input = children.length ? children : h(
      'span',
      {
        'class': pickerCls,
        style: getStyle(this),
        ref: 'picker'
      },
      [showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, h(Input, inputProps), !showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, clearIcon, h(Icon, {
        attrs: { type: 'down' },
        key: 'down-icon', 'class': arrowCls })]
    );
    var cascaderProps = {
      props: _extends({}, props, {
        options: options,
        value: value,
        popupVisible: sPopupVisible,
        dropdownMenuColumnStyle: dropdownMenuColumnStyle
      }),
      on: _extends({}, $listeners, {
        popupVisibleChange: this.handlePopupVisibleChange,
        change: this.handleChange
      })
    };
    return h(
      VcCascader,
      cascaderProps,
      [input]
    );
  }
};