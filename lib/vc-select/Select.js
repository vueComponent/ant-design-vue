'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _vcMenu = require('../vc-menu');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _vnode = require('../_util/vnode');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _PropTypes = require('./PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function chaining() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    // eslint-disable-line
    // eslint-disable-line
    for (var i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(this, args);
      }
    }
  };
}
exports['default'] = {
  inheritAttrs: false,
  name: 'Select',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends4['default'])({}, _PropTypes.SelectPropTypes, {
    prefixCls: _PropTypes.SelectPropTypes.prefixCls.def('rc-select'),
    defaultOpen: _vueTypes2['default'].bool.def(false),
    labelInValue: _PropTypes.SelectPropTypes.labelInValue.def(false),
    defaultActiveFirstOption: _PropTypes.SelectPropTypes.defaultActiveFirstOption.def(true),
    showSearch: _PropTypes.SelectPropTypes.showSearch.def(true),
    allowClear: _PropTypes.SelectPropTypes.allowClear.def(false),
    placeholder: _PropTypes.SelectPropTypes.placeholder.def(''),
    showArrow: _PropTypes.SelectPropTypes.showArrow.def(true),
    dropdownMatchSelectWidth: _vueTypes2['default'].bool.def(true),
    dropdownStyle: _PropTypes.SelectPropTypes.dropdownStyle.def({}),
    dropdownMenuStyle: _vueTypes2['default'].object.def({}),
    optionFilterProp: _PropTypes.SelectPropTypes.optionFilterProp.def('value'),
    optionLabelProp: _PropTypes.SelectPropTypes.optionLabelProp.def('value'),
    notFoundContent: _vueTypes2['default'].any.def('Not Found'),
    backfill: _vueTypes2['default'].bool.def(false),
    showAction: _PropTypes.SelectPropTypes.showAction.def(['click']),
    combobox: _vueTypes2['default'].bool.def(false),
    tokenSeparators: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string).def([])
    // onChange: noop,
    // onFocus: noop,
    // onBlur: noop,
    // onSelect: noop,
    // onSearch: noop,
    // onDeselect: noop,
    // onInputKeydown: noop,
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    this.labelMap = new Map();
    this.titleMap = new Map();
    var sValue = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        combobox = this.combobox,
        open = this.open,
        defaultOpen = this.defaultOpen;

    if ((0, _propsUtil.hasProp)(this, 'value')) {
      sValue = (0, _util.toArray)(value);
    } else {
      sValue = (0, _util.toArray)(defaultValue);
    }
    if (this.labelInValue) {
      sValue.forEach(function (v) {
        v.key = v.key !== undefined ? v.key : v.value;
      });
    } else {
      sValue = sValue.map(function (v) {
        return {
          key: v
        };
      });
    }
    this.initLabelAndTitleMap(sValue);
    var inputValue = '';
    if (combobox) {
      inputValue = sValue.length ? this.labelMap.get(sValue[0].key) : '';
    }
    var sOpen = open;
    if (sOpen === undefined) {
      sOpen = defaultOpen;
    }
    this._valueOptions = [];
    if (sValue.length > 0) {
      this._valueOptions = this.getOptionsByValue(sValue);
    }
    return {
      sValue: sValue,
      inputValue: inputValue,
      sOpen: sOpen
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.autoFocus && _this.focus();
    });
  },

  watch: {
    value: function value(val) {
      var _this2 = this;

      var sValue = (0, _util.toArray)(val);
      if (this.labelInValue) {
        sValue.forEach(function (v) {
          v.key = v.key !== undefined ? v.key : v.value;
        });
      } else {
        sValue = sValue.map(function (v) {
          return {
            key: v
          };
        });
      }
      this.sValue = sValue;

      sValue.forEach(function (val) {
        var key = val.key;
        var label = val.label,
            title = val.title;

        label = label === undefined ? _this2.labelMap.get(key) : label;
        title = title === undefined ? _this2.titleMap.get(key) : title;
        _this2.labelMap.set(key, label === undefined ? key : label);
        _this2.titleMap.set(key, title);
      });

      if (this.combobox) {
        this.setState({
          inputValue: sValue.length ? this.labelMap.get(sValue[0].key) : ''
        });
      }
    },
    combobox: function combobox(val) {
      if (val) {
        this.setState({
          inputValue: this.sValue.length ? this.labelMap.get(this.sValue[0].key) : ''
        });
      }
    }
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      if ((0, _util.isMultipleOrTags)(_this3.$props)) {
        var inputNode = _this3.getInputDOMNode();
        var mirrorNode = _this3.getInputMirrorDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = mirrorNode.clientWidth + 10 + 'px';
        } else {
          inputNode.style.width = '';
        }
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearFocusTime();
    this.clearBlurTime();
    this.clearAdjustTimer();
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  methods: {
    initLabelAndTitleMap: function initLabelAndTitleMap(sValue) {
      var _this4 = this;

      // 保留已选中的label and title
      var labelArr = [];
      var titleArr = [];
      var values = sValue || this.sValue;
      values.forEach(function (val) {
        var key = val.key;
        var label = val.label,
            title = val.title;

        label = label === undefined ? _this4.labelMap.get(key) : label;
        title = title === undefined ? _this4.titleMap.get(key) : title;
        title = typeof title === 'string' ? title.trim() : title;
        labelArr.push([key, label === undefined ? key : label]);
        titleArr.push([key, title]);
      });
      this.labelMap = new Map(labelArr);
      this.titleMap = new Map(titleArr);

      this.updateLabelAndTitleMap(this.$slots['default']);
    },
    updateLabelAndTitleMap: function updateLabelAndTitleMap() {
      var _this5 = this;

      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          _this5.updateLabelAndTitleMap(child.componentOptions.children);
        } else {
          var key = (0, _util.getValuePropValue)(child);
          _this5.titleMap.set(key, (0, _propsUtil.getValueByProp)(child, 'title'));
          _this5.labelMap.set(key, _this5.getLabelFromOption(child));
        }
      });
    },
    onInputChange: function onInputChange(event) {
      var tokenSeparators = this.tokenSeparators;

      var val = event.target.value;
      if ((0, _util.isMultipleOrTags)(this.$props) && tokenSeparators.length && (0, _util.includesSeparators)(val, tokenSeparators)) {
        var nextValue = this.getValueByInput(val);
        this.fireChange(nextValue);
        this.setOpenState(false, true);
        this.setInputValue('', false);
        return;
      }
      this.setInputValue(val);
      this.setState({
        sOpen: true
      });
      if ((0, _util.isCombobox)(this.$props)) {
        this.fireChange([{
          key: val
        }]);
      }
    },
    onDropdownVisibleChange: function onDropdownVisibleChange(open) {
      if (open && !this._focused) {
        this.clearBlurTime();
        this.timeoutFocus();
        this._focused = true;
        this.updateFocusClassName();
      }
      this.setOpenState(open);
    },


    // combobox ignore
    onKeyDown: function onKeyDown(event) {
      var disabled = this.disabled,
          openStatus = this.openStatus;

      if (disabled) {
        return;
      }
      var keyCode = event.keyCode;
      if (openStatus && !this.getInputDOMNode()) {
        this.onInputKeydown(event);
      } else if (keyCode === _KeyCode2['default'].ENTER || keyCode === _KeyCode2['default'].DOWN) {
        this.setOpenState(true);
        event.preventDefault();
      }
    },
    onInputKeydown: function onInputKeydown(event) {
      var disabled = this.disabled,
          openStatus = this.openStatus,
          sValue = this.sValue,
          $props = this.$props;

      if (disabled) {
        return;
      }
      var keyCode = event.keyCode;
      if ((0, _util.isMultipleOrTags)($props) && !event.target.value && keyCode === _KeyCode2['default'].BACKSPACE) {
        event.preventDefault();
        if (sValue.length) {
          this.removeSelected(sValue[sValue.length - 1].key);
        }
        return;
      }
      if (keyCode === _KeyCode2['default'].DOWN) {
        if (!openStatus) {
          this.openIfHasChildren();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      } else if (keyCode === _KeyCode2['default'].ESC) {
        if (openStatus) {
          this.setOpenState(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (openStatus) {
        var menu = this.$refs.selectTriggerRef.getInnerMenu();
        if (menu && menu.onKeyDown(event, this.handleBackfill)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    onMenuSelect: function onMenuSelect(_ref) {
      var _this6 = this;

      var item = _ref.item;

      var sValue = this.sValue;
      var props = this.$props;
      var selectedValue = (0, _util.getValuePropValue)(item);
      var selectedLabel = this.labelMap.get(selectedValue);
      var lastValue = sValue[sValue.length - 1];
      this.fireSelect({
        key: selectedValue,
        label: selectedLabel
      });
      var selectedTitle = this.titleMap.get(selectedValue);
      if ((0, _util.isMultipleOrTags)(props)) {
        if ((0, _util.findIndexInValueByKey)(sValue, selectedValue) !== -1) {
          return;
        }
        sValue = sValue.concat([{
          key: selectedValue,
          label: selectedLabel,
          title: selectedTitle
        }]);
      } else {
        if ((0, _util.isCombobox)(props)) {
          this.skipAdjustOpen = true;
          this.clearAdjustTimer();
          this.skipAdjustOpenTimer = setTimeout(function () {
            _this6.skipAdjustOpen = false;
          }, 0);
        }
        if (lastValue && lastValue.key === selectedValue && !lastValue.backfill) {
          this.setOpenState(false, true);
          return;
        }
        sValue = [{
          key: selectedValue,
          label: selectedLabel,
          title: selectedTitle
        }];
        this.setOpenState(false, true);
      }
      this.fireChange(sValue);
      var inputValue = void 0;
      if ((0, _util.isCombobox)(props)) {
        inputValue = selectedValue;
      } else {
        inputValue = '';
      }
      this.setInputValue(inputValue, false);
    },
    onMenuDeselect: function onMenuDeselect(_ref2) {
      var item = _ref2.item,
          domEvent = _ref2.domEvent;

      if (domEvent.type === 'click') {
        this.removeSelected((0, _util.getValuePropValue)(item));
      }
      this.setInputValue('', false);
    },
    onArrowClick: function onArrowClick(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this.disabled) {
        this.setOpenState(!this.openStatus, !this.openStatus);
      }
    },
    onPlaceholderClick: function onPlaceholderClick(e) {
      if (this.openStatus) {
        e.stopPropagation();
      }
      if (this.getInputDOMNode()) {
        this.getInputDOMNode().focus();
      }
    },


    // onOuterFocus (e) {
    //   if (this.disabled) {
    //     e.preventDefault()
    //     return
    //   }
    //   this.clearBlurTime()
    //   if (
    //     !isMultipleOrTagsOrCombobox(this.$props) &&
    //   e.target === this.getInputDOMNode()
    //   ) {
    //     return
    //   }
    //   if (this._focused) {
    //     return
    //   }
    //   this._focused = true
    //   this.updateFocusClassName()
    //   this.timeoutFocus()
    // },

    onPopupFocus: function onPopupFocus() {
      // fix ie scrollbar, focus element again
      this.maybeFocus(true, true);
    },


    // onOuterBlur (e) {
    //   if (this.disabled) {
    //     e.preventDefault()
    //     return
    //   }
    //   this.blurTimer = setTimeout(() => {
    //     this._focused = false
    //     this.updateFocusClassName()
    //     const props = this.$props
    //     let { sValue } = this
    //     const { inputValue } = this
    //     if (
    //       isSingleMode(props) &&
    //     props.showSearch &&
    //     inputValue &&
    //     props.defaultActiveFirstOption
    //     ) {
    //       const options = this._options || []
    //       if (options.length) {
    //         const firstOption = findFirstMenuItem(options)
    //         if (firstOption) {
    //           sValue = [
    //             {
    //               key: firstOption.key,
    //               label: this.getLabelFromOption(firstOption),
    //             },
    //           ]
    //           this.fireChange(sValue)
    //         }
    //       }
    //     } else if (isMultipleOrTags(props) && inputValue) {
    //       this.inputValue = this.getInputDOMNode().value = ''
    //     }
    //     this.$emit('blur', this.getVLForOnChange(sValue))
    //     this.setOpenState(false)
    //   }, 10)
    // },

    onClearSelection: function onClearSelection(event) {
      var inputValue = this.inputValue,
          sValue = this.sValue,
          disabled = this.disabled;

      if (disabled) {
        return;
      }
      if (inputValue || sValue.length) {
        if (sValue.length) {
          this.fireChange([]);
        }
        this.setOpenState(false, true);
        if (inputValue) {
          this.setInputValue('');
        }
        if (this._focused) {
          this._focused = false;
        } else {
          event.stopPropagation();
        }
      } else {
        event.stopPropagation();
      }
    },
    onChoiceAnimationLeave: function onChoiceAnimationLeave() {
      this.$refs.selectTriggerRef.$refs.triggerRef.forcePopupAlign();
    },
    getOptionsFromChildren: function getOptionsFromChildren(value) {
      var _this7 = this;

      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var h = this.$createElement;

      var values = value;
      if (!Array.isArray(value)) {
        values = [value];
      }
      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          _this7.getOptionsFromChildren(child.componentOptions.children, options);
        } else {
          var index = (0, _util.findIndexInValueByKey)(values, (0, _util.getValuePropValue)(child));
          if (index !== -1) {
            options[index] = child;
          }
        }
      });
      values.forEach(function (v, i) {
        if (!options[i]) {
          for (var j = 0; j < _this7._valueOptions.length; j++) {
            var item = _this7._valueOptions[j];
            if ((0, _util.getValuePropValue)(item) === v.key) {
              options[i] = item;
              break;
            }
          }
          if (!options[i]) {
            options[i] = h(
              _Option2['default'],
              {
                attrs: { value: v.key },
                key: v.key },
              [_this7.labelMap.get(v.key)]
            );
          }
        }
      });
      if (!Array.isArray(value)) {
        return options[0];
      }
      return options;
    },
    getSingleOptionByValueKey: function getSingleOptionByValueKey(key) {
      return this.getOptionsFromChildren({
        key: key,
        label: key
      }, this.$slots['default']);
    },
    getOptionsByValue: function getOptionsByValue(value) {
      if (value === undefined) {
        return undefined;
      }
      if (value.length === 0) {
        return [];
      }
      return this.getOptionsFromChildren(value, this.$slots['default']);
    },
    getLabelBySingleValue: function getLabelBySingleValue() {
      var _this8 = this;

      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var value = arguments[1];

      if (value === undefined) {
        return null;
      }
      var label = null;
      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          var maybe = _this8.getLabelBySingleValue(child.componentOptions.children, value);
          if (maybe !== null) {
            label = maybe;
          }
        } else if ((0, _util.getValuePropValue)(child) === value) {
          label = _this8.getLabelFromOption(child);
        }
      });
      return label;
    },
    getValueByLabel: function getValueByLabel() {
      var _this9 = this;

      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var label = arguments[1];

      if (label === undefined) {
        return null;
      }
      var value = null;
      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          var maybe = _this9.getValueByLabel(child.componentOptions.children, label);
          if (maybe !== null) {
            value = maybe;
          }
        } else if ((0, _util.toArray)(_this9.getLabelFromOption(child)).join('') === label) {
          value = (0, _util.getValuePropValue)(child);
        }
      });
      return value;
    },
    getLabelFromOption: function getLabelFromOption(child) {
      var label = (0, _util.getPropValue)(child, this.optionLabelProp);
      if (Array.isArray(label) && label.length === 1 && !label[0].tag) {
        label = label[0].text;
      }
      return label;
    },
    getLabelFromProps: function getLabelFromProps(value) {
      return this.getLabelByValue(this.$slots['default'] || [], value);
    },
    getVLForOnChange: function getVLForOnChange(vls_) {
      var _this10 = this;

      var vls = vls_;
      if (vls !== undefined) {
        if (!this.labelInValue) {
          vls = vls.map(function (v) {
            return v.key;
          });
        } else {
          vls = vls.map(function (vl) {
            return { key: vl.key, label: _this10.labelMap.get(vl.key) };
          });
        }
        return (0, _util.isMultipleOrTags)(this.$props) ? vls : vls[0];
      }
      return vls;
    },
    getLabelByValue: function getLabelByValue(children, value) {
      var label = this.getLabelBySingleValue(children, value);
      if (label === null) {
        return value;
      }
      return label;
    },
    getDropdownContainer: function getDropdownContainer() {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div');
        document.body.appendChild(this.dropdownContainer);
      }
      return this.dropdownContainer;
    },
    getPlaceholderElement: function getPlaceholderElement() {
      var h = this.$createElement;

      // const { props, state } = this
      var inputValue = this.inputValue,
          sValue = this.sValue,
          placeholder = this.placeholder,
          prefixCls = this.prefixCls,
          $props = this.$props;

      var hidden = false;
      if (inputValue) {
        hidden = true;
      }
      if (sValue.length) {
        hidden = true;
      }
      if ((0, _util.isCombobox)($props) && sValue.length === 1 && !sValue[0].key) {
        hidden = false;
      }
      if (placeholder) {
        var p = {
          on: {
            mousedown: _util.preventDefaultEvent,
            click: this.onPlaceholderClick
          },
          attrs: _util.UNSELECTABLE_ATTRIBUTE,
          style: (0, _extends4['default'])({
            display: hidden ? 'none' : 'block'
          }, _util.UNSELECTABLE_STYLE),
          'class': prefixCls + '-selection__placeholder'
        };
        return h(
          'div',
          p,
          [placeholder]
        );
      }
      return null;
    },
    inputClick: function inputClick(e) {
      if (this.openStatus) {
        this.clearBlurTime();
        e.stopPropagation();
      } else {
        this._focused = false;
      }
    },
    inputBlur: function inputBlur(e) {
      var _this11 = this;

      this.clearBlurTime();
      if (this.disabled) {
        return;
      }
      this.blurTimer = setTimeout(function () {
        _this11._focused = false;
        _this11.updateFocusClassName();
        var props = _this11.$props;
        var sValue = _this11.sValue;
        var inputValue = _this11.inputValue;

        if ((0, _util.isSingleMode)(props) && props.showSearch && inputValue && props.defaultActiveFirstOption) {
          var options = _this11._options || [];
          if (options.length) {
            var firstOption = (0, _util.findFirstMenuItem)(options);
            if (firstOption) {
              sValue = [{
                key: firstOption.key,
                label: _this11.labelMap.get(firstOption.key)
              }];
              _this11.fireChange(sValue);
            }
          }
        } else if ((0, _util.isMultipleOrTags)(props) && inputValue) {
          _this11.inputValue = _this11.getInputDOMNode().value = '';
          sValue = _this11.getValueByInput(inputValue);
          _this11.fireChange(sValue);
        }
        _this11.$emit('blur', _this11.getVLForOnChange(sValue));
        _this11.setOpenState(false);
      }, 10);
    },
    inputFocus: function inputFocus(e) {
      this.clearBlurTime();
      this.clearFocusTime();
      this.timeoutFocus();
    },
    _getInputElement: function _getInputElement() {
      var h = this.$createElement;

      var props = this.$props;
      var attrs = (0, _propsUtil.getAttrs)(this);
      var inputElement = props.getInputElement ? props.getInputElement() : h('input', {
        attrs: { id: attrs.id, autoComplete: 'off' }
      });
      var inputCls = (0, _classnames3['default'])((0, _propsUtil.getClass)(inputElement), (0, _defineProperty3['default'])({}, props.prefixCls + '-search__field', true));
      var inputEvents = (0, _propsUtil.getEvents)(inputElement);
      // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
      // Add space to the end of the inputValue as the width measurement tolerance
      inputElement.data = inputElement.data || {};
      return h(
        'div',
        { 'class': props.prefixCls + '-search__field__wrap', on: {
            'click': this.inputClick
          }
        },
        [(0, _vnode.cloneElement)(inputElement, {
          props: {
            disabled: props.disabled,
            value: this.inputValue
          },
          attrs: (0, _extends4['default'])({}, inputElement.data.attrs || {}, {
            disabled: props.disabled,
            value: this.inputValue
          }),
          domProps: {
            value: this.inputValue
          },
          'class': inputCls,
          ref: 'inputRef',
          on: {
            input: this.onInputChange,
            keydown: chaining(this.onInputKeydown, inputEvents.keydown, this.$listeners.inputKeydown),
            focus: chaining(this.inputFocus, inputEvents.focus),
            blur: chaining(this.inputBlur, inputEvents.blur)
          }
        }), h(
          'span',
          {
            ref: 'inputMirrorRef',
            'class': props.prefixCls + '-search__field__mirror'
          },
          [this.inputValue, '\xA0']
        )]
      );
    },
    getInputDOMNode: function getInputDOMNode() {
      return this.$refs.topCtrlRef ? this.$refs.topCtrlRef.querySelector('input,textarea,div[contentEditable]') : this.$refs.inputRef;
    },
    getInputMirrorDOMNode: function getInputMirrorDOMNode() {
      return this.$refs.inputMirrorRef;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.selectTriggerRef.getPopupDOMNode();
    },
    getPopupMenuComponent: function getPopupMenuComponent() {
      return this.$refs.selectTriggerRef.getInnerMenu();
    },
    setOpenState: function setOpenState(open, needFocus) {
      var _this12 = this;

      var props = this.$props,
          openStatus = this.openStatus;

      if (openStatus === open) {
        this.maybeFocus(open, needFocus);
        return;
      }
      var nextState = {
        sOpen: open
        // clear search input value when open is false in singleMode.
      };if (!open && (0, _util.isSingleMode)(props) && props.showSearch) {
        this.setInputValue('');
      }
      if (!open) {
        this.maybeFocus(open, needFocus);
      }
      this.setState(nextState, function () {
        if (open) {
          _this12.maybeFocus(open, needFocus);
        }
      });
    },
    setInputValue: function setInputValue(inputValue) {
      var fireSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (inputValue !== this.inputValue) {
        this.setState({
          inputValue: inputValue
        });
        if (fireSearch) {
          this.$emit('search', inputValue);
        }
      }
    },
    getValueByInput: function getValueByInput(string) {
      var _this13 = this;

      var multiple = this.multiple,
          tokenSeparators = this.tokenSeparators,
          $slots = this.$slots;

      var nextValue = this.sValue;
      (0, _util.splitBySeparators)(string, tokenSeparators).forEach(function (label) {
        var selectedValue = { key: label, label: label };
        if ((0, _util.findIndexInValueByLabel)(nextValue, label) === -1) {
          if (multiple) {
            var value = _this13.getValueByLabel($slots['default'], label);
            if (value) {
              selectedValue.key = value;
              nextValue = nextValue.concat(selectedValue);
            }
          } else {
            nextValue = nextValue.concat(selectedValue);
          }
        }
        _this13.fireSelect({
          key: label,
          label: label
        });
      });
      return nextValue;
    },
    focus: function focus() {
      if ((0, _util.isSingleMode)(this.$props)) {
        this.$refs.selectionRef.focus();
      } else {
        this.getInputDOMNode().focus();
      }
    },
    blur: function blur() {
      if ((0, _util.isSingleMode)(this.$props)) {
        this.$refs.selectionRef.blur();
      } else {
        this.getInputDOMNode().blur();
      }
    },
    handleBackfill: function handleBackfill(item) {
      if (!this.backfill || !((0, _util.isSingleMode)(this.$props) || (0, _util.isCombobox)(this.$props))) {
        return;
      }

      var key = (0, _util.getValuePropValue)(item);
      var label = this.labelMap.get(key);
      var backfillValue = {
        key: key,
        label: label,
        backfill: true
      };

      if ((0, _util.isCombobox)(this.$props)) {
        this.setInputValue(key, false);
      }

      this.setState({
        sValue: [backfillValue]
      });
    },
    _filterOption: function _filterOption(input, child) {
      var defaultFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _util.defaultFilterFn;
      var sValue = this.sValue;

      var lastValue = sValue[sValue.length - 1];
      if (!input || lastValue && lastValue.backfill) {
        return true;
      }
      var filterFn = this.filterOption;
      if ((0, _propsUtil.hasProp)(this, 'filterOption')) {
        if (this.filterOption === true) {
          filterFn = defaultFilter;
        }
      } else {
        filterFn = defaultFilter;
      }
      if (!filterFn) {
        return true;
      } else if (typeof filterFn === 'function') {
        return filterFn.call(this, input, child);
      } else if ((0, _propsUtil.getValueByProp)(child, 'disabled')) {
        return false;
      }
      return true;
    },
    timeoutFocus: function timeoutFocus() {
      var _this14 = this;

      if (this.focusTimer) {
        this.clearFocusTime();
      }
      this.focusTimer = setTimeout(function () {
        _this14._focused = true;
        _this14.updateFocusClassName();
        _this14.$emit('focus');
      }, 10);
    },
    clearFocusTime: function clearFocusTime() {
      if (this.focusTimer) {
        clearTimeout(this.focusTimer);
        this.focusTimer = null;
      }
    },
    clearBlurTime: function clearBlurTime() {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      }
    },
    clearAdjustTimer: function clearAdjustTimer() {
      if (this.skipAdjustOpenTimer) {
        clearTimeout(this.skipAdjustOpenTimer);
        this.skipAdjustOpenTimer = null;
      }
    },
    updateFocusClassName: function updateFocusClassName() {
      var rootRef = this.$refs.rootRef,
          prefixCls = this.prefixCls;
      // avoid setState and its side effect

      if (this._focused) {
        (0, _componentClasses2['default'])(rootRef).add(prefixCls + '-focused');
      } else {
        (0, _componentClasses2['default'])(rootRef).remove(prefixCls + '-focused');
      }
    },
    maybeFocus: function maybeFocus(open, needFocus) {
      if (needFocus || open) {
        var input = this.getInputDOMNode();
        var _document = document,
            activeElement = _document.activeElement;

        if (input && (open || (0, _util.isMultipleOrTagsOrCombobox)(this.$props))) {
          if (activeElement !== input) {
            input.focus();
            this._focused = true;
          }
        } else {
          if (activeElement !== this.$refs.selectionRef) {
            this.$refs.selectionRef.focus();
            this._focused = true;
          }
        }
      }
    },


    // addLabelToValue (value_) {
    //   let value = value_
    //   if (this.labelInValue) {
    //     value.forEach(v => {
    //       v.label = v.label || this.getLabelFromProps(v.key)
    //     })
    //   } else {
    //     value = value.map(v => {
    //       return {
    //         key: v,
    //         label: this.getLabelFromProps(v),
    //       }
    //     })
    //   }
    //   return value
    // },

    // addTitleToValue (children = [], values) {
    //   let nextValues = values
    //   const keys = values.map(v => v.key)
    //   children.forEach(child => {
    //     if (!child) {
    //       return
    //     }
    //     if (getSlotOptions(child).isSelectOptGroup) {
    //       nextValues = this.addTitleToValue(child.componentOptions.children, nextValues)
    //     } else {
    //       const value = getValuePropValue(child)
    //       const valueIndex = keys.indexOf(value)
    //       if (valueIndex > -1) {
    //         nextValues[valueIndex].title = getValue(child, 'title')
    //       }
    //     }
    //   })
    //   return nextValues
    // },

    removeSelected: function removeSelected(selectedKey) {
      var _this15 = this;

      var props = this.$props;
      if (props.disabled || this.isChildDisabled(selectedKey)) {
        return;
      }
      var label = void 0;
      var value = this.sValue.filter(function (singleValue) {
        if (singleValue.key === selectedKey) {
          label = _this15.labelMap.get(selectedKey);
        }
        return singleValue.key !== selectedKey;
      });
      var canMultiple = (0, _util.isMultipleOrTags)(props);

      if (canMultiple) {
        var event = selectedKey;
        if (props.labelInValue) {
          event = {
            key: selectedKey,
            label: label
          };
        }
        this.$emit('deselect', event, this.getSingleOptionByValueKey(selectedKey));
      }
      this.fireChange(value);
    },
    openIfHasChildren: function openIfHasChildren() {
      var $props = this.$props,
          $slots = this.$slots;

      if ($slots['default'] && $slots['default'].length || (0, _util.isSingleMode)($props)) {
        this.setOpenState(true);
      }
    },
    fireSelect: function fireSelect(value) {
      var labelInValue = this.labelInValue;

      this.$emit('select', labelInValue ? value : value.key, this.getSingleOptionByValueKey(value.key));
    },
    fireChange: function fireChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      var vls = this.getVLForOnChange(value);
      var options = this.getOptionsByValue(value);
      this._valueOptions = options;
      this.$emit('change', vls, (0, _util.isMultipleOrTags)(this.$props) ? options : options[0]);
    },
    isChildDisabled: function isChildDisabled(key) {
      return (this.$slots['default'] || []).some(function (child) {
        var childValue = (0, _util.getValuePropValue)(child);
        return childValue === key && (0, _propsUtil.getValueByProp)(child, 'disabled');
      });
    },
    getOptionsAndOpenStatus: function getOptionsAndOpenStatus() {
      var sOpen = this.sOpen;
      if (this.skipAdjustOpen) {
        this.openStatus = sOpen;
        return {
          options: this._options,
          open: sOpen
        };
      }
      var $props = this.$props,
          showSearch = this.showSearch;

      var options = [];
      // If hidden menu due to no options, then it should be calculated again
      if (sOpen || this.hiddenForNoOptions) {
        options = this.renderFilterOptions();
      }
      this._options = options;

      if ((0, _util.isMultipleOrTagsOrCombobox)($props) || !showSearch) {
        if (sOpen && !options.length) {
          sOpen = false;
          this.hiddenForNoOptions = true;
        }
        // Keep menu open if there are options and hidden for no options before
        if (this.hiddenForNoOptions && options.length) {
          sOpen = true;
          this.hiddenForNoOptions = false;
        }
      }
      this.openStatus = sOpen;
      return {
        options: options,
        open: sOpen
      };
    },
    renderFilterOptions: function renderFilterOptions() {
      var _this16 = this;

      var h = this.$createElement;
      var inputValue = this.inputValue;
      var $slots = this.$slots,
          tags = this.tags,
          filterOption = this.filterOption,
          notFoundContent = this.notFoundContent;

      var menuItems = [];
      var childrenKeys = [];
      var options = this.renderFilterOptionsFromChildren($slots['default'], childrenKeys, menuItems);
      if (tags) {
        // tags value must be string
        var value = this.sValue || [];
        value = value.filter(function (singleValue) {
          return childrenKeys.indexOf(singleValue.key) === -1 && (!inputValue || String(singleValue.key).indexOf(String(inputValue)) > -1);
        });
        value.forEach(function (singleValue) {
          var key = singleValue.key;
          var menuItem = h(
            _vcMenu.Item,
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              style: _util.UNSELECTABLE_STYLE
            }, { attrs: _util.UNSELECTABLE_ATTRIBUTE }, {
              attrs: {
                value: key
              },
              key: key
            }]),
            [key]
          );
          options.push(menuItem);
          menuItems.push(menuItem);
        });
        if (inputValue) {
          var notFindInputItem = menuItems.every(function (option) {
            // this.filterOption return true has two meaning,
            // 1, some one exists after filtering
            // 2, filterOption is set to false
            // condition 2 does not mean the option has same value with inputValue
            var filterFn = function filterFn() {
              return (0, _util.getValuePropValue)(option) === inputValue;
            };
            if (filterOption !== false) {
              return !_this16._filterOption(inputValue, option, filterFn);
            }
            return !filterFn();
          });
          if (notFindInputItem) {
            var p = {
              attrs: _util.UNSELECTABLE_ATTRIBUTE,
              key: inputValue,
              props: {
                value: inputValue
              },
              style: _util.UNSELECTABLE_STYLE
            };
            options.unshift(h(
              _vcMenu.Item,
              p,
              [inputValue]
            ));
          }
        }
      }

      if (!options.length && notFoundContent) {
        var _p = {
          attrs: _util.UNSELECTABLE_ATTRIBUTE,
          key: 'NOT_FOUND',
          props: {
            value: 'NOT_FOUND',
            disabled: true
          },
          style: _util.UNSELECTABLE_STYLE
        };
        options = [h(
          _vcMenu.Item,
          _p,
          [notFoundContent]
        )];
      }
      return options;
    },
    renderFilterOptionsFromChildren: function renderFilterOptionsFromChildren() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _this17 = this;

      var childrenKeys = arguments[1];
      var menuItems = arguments[2];
      var h = this.$createElement;

      var sel = [];
      var props = this.$props;
      var inputValue = this.inputValue;

      var tags = props.tags;
      children.forEach(function (child) {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
          var innerItems = _this17.renderFilterOptionsFromChildren(child.componentOptions.children, childrenKeys, menuItems);
          if (innerItems.length) {
            var label = (0, _propsUtil.getComponentFromProp)(child, 'label');
            var key = child.key;
            if (!key && typeof label === 'string') {
              key = label;
            } else if (!label && key) {
              label = key;
            }
            sel.push(h(
              _vcMenu.ItemGroup,
              { key: key, attrs: { title: label },
                'class': (0, _propsUtil.getClass)(child) },
              [innerItems]
            ));
          }
          return;
        }
        (0, _warning2['default'])((0, _propsUtil.getSlotOptions)(child).isSelectOption, 'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' + ('instead of `' + ((0, _propsUtil.getSlotOptions)(child).name || (0, _propsUtil.getSlotOptions)(child)) + '`.'));

        var childValue = (0, _util.getValuePropValue)(child);

        (0, _util.validateOptionValue)(childValue, _this17.$props);
        if (_this17._filterOption(inputValue, child)) {
          var p = {
            attrs: _util.UNSELECTABLE_ATTRIBUTE,
            key: childValue,
            props: (0, _extends4['default'])({
              value: childValue
            }, (0, _propsUtil.getPropsData)(child)),
            style: _util.UNSELECTABLE_STYLE,
            on: (0, _propsUtil.getEvents)(child),
            'class': (0, _propsUtil.getClass)(child)
          };
          var menuItem = h(
            _vcMenu.Item,
            p,
            [child.componentOptions.children]
          );
          sel.push(menuItem);
          menuItems.push(menuItem);
        }
        if (tags && !(0, _propsUtil.getValueByProp)(child, 'disabled')) {
          childrenKeys.push(childValue);
        }
      });

      return sel;
    },
    renderTopControlNode: function renderTopControlNode(openStatus) {
      var _this18 = this;

      var h = this.$createElement;
      var sValue = this.sValue,
          inputValue = this.inputValue,
          props = this.$props;
      var choiceTransitionName = props.choiceTransitionName,
          prefixCls = props.prefixCls,
          maxTagTextLength = props.maxTagTextLength,
          maxTagCount = props.maxTagCount,
          maxTagPlaceholder = props.maxTagPlaceholder,
          showSearch = props.showSearch;

      var className = prefixCls + '-selection__rendered';
      // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
      var innerNode = null;
      if ((0, _util.isSingleMode)(props)) {
        var selectedValue = null;
        if (sValue.length) {
          var showSelectedValue = false;
          var opacity = 1;
          if (!showSearch) {
            showSelectedValue = true;
          } else {
            if (openStatus) {
              showSelectedValue = !inputValue;
              if (showSelectedValue) {
                opacity = 0.4;
              }
            } else {
              showSelectedValue = true;
            }
          }
          var singleValue = sValue[0];
          var key = singleValue.key;
          var title = this.titleMap.get(key) || this.labelMap.get(key);
          if (Array.isArray(title)) {
            title = '';
          }
          selectedValue = h(
            'div',
            {
              key: 'value',
              'class': prefixCls + '-selection-selected-value',
              attrs: { title: title
              },
              style: {
                display: showSelectedValue ? 'block' : 'none',
                opacity: opacity
              }
            },
            [this.labelMap.get(key)]
          );
        }
        if (!showSearch) {
          innerNode = [selectedValue];
        } else {
          innerNode = [selectedValue, h(
            'div',
            {
              'class': prefixCls + '-search ' + prefixCls + '-search--inline',
              key: 'input',
              style: {
                display: openStatus ? 'block' : 'none'
              }
            },
            [this._getInputElement()]
          )];
        }
      } else {
        var selectedValueNodes = [];
        var limitedCountValue = sValue;
        var maxTagPlaceholderEl = void 0;
        if (maxTagCount !== undefined && sValue.length > maxTagCount) {
          limitedCountValue = limitedCountValue.slice(0, maxTagCount);
          var omittedValues = this.getVLForOnChange(sValue.slice(maxTagCount, sValue.length));
          var content = '+ ' + (sValue.length - maxTagCount) + ' ...';
          if (maxTagPlaceholder) {
            content = typeof maxTagPlaceholder === 'function' ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
          }
          maxTagPlaceholderEl = h(
            'li',
            {
              style: _util.UNSELECTABLE_STYLE,
              attrs: { unselectable: 'unselectable',

                title: content
              },
              on: {
                'mousedown': _util.preventDefaultEvent
              },

              'class': prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled',
              key: 'maxTagPlaceholder' },
            [h(
              'div',
              { 'class': prefixCls + '-selection__choice__content' },
              [content]
            )]
          );
        }
        if ((0, _util.isMultipleOrTags)(props)) {
          selectedValueNodes = limitedCountValue.map(function (singleValue) {
            var content = _this18.labelMap.get(singleValue.key);
            var title = _this18.titleMap.get(singleValue.key) || content;
            if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
              content = content.slice(0, maxTagTextLength) + '...';
            }
            var disabled = _this18.isChildDisabled(singleValue.key);
            var choiceClassName = disabled ? prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled' : prefixCls + '-selection__choice';
            return h(
              'li',
              {
                style: _util.UNSELECTABLE_STYLE,
                attrs: { unselectable: 'unselectable',

                  title: title
                },
                on: {
                  'mousedown': _util.preventDefaultEvent
                },

                'class': choiceClassName,
                key: singleValue.key },
              [h(
                'div',
                { 'class': prefixCls + '-selection__choice__content' },
                [content]
              ), disabled ? null : h('span', {
                'class': prefixCls + '-selection__choice__remove',
                on: {
                  'click': _this18.removeSelected.bind(_this18, singleValue.key)
                }
              })]
            );
          });
        }
        if (maxTagPlaceholderEl) {
          selectedValueNodes.push(maxTagPlaceholderEl);
        }
        selectedValueNodes.push(h(
          'li',
          {
            'class': prefixCls + '-search ' + prefixCls + '-search--inline',
            key: '__input'
          },
          [this._getInputElement()]
        ));

        if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
          var transitionProps = (0, _getTransitionProps2['default'])(choiceTransitionName, {
            tag: 'ul',
            afterLeave: this.onChoiceAnimationLeave
          });
          innerNode = h(
            'transition-group',
            transitionProps,
            [selectedValueNodes]
          );
        } else {
          innerNode = h('ul', [selectedValueNodes]);
        }
      }
      return h(
        'div',
        { 'class': className, ref: 'topCtrlRef', on: {
            'click': this.topCtrlContainerClick
          }
        },
        [this.getPlaceholderElement(), innerNode]
      );
    },
    topCtrlContainerClick: function topCtrlContainerClick(e) {
      if (this.openStatus && !(0, _util.isSingleMode)(this.$props)) {
        e.stopPropagation();
      }
    },
    renderClear: function renderClear() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          allowClear = this.allowClear,
          sValue = this.sValue,
          inputValue = this.inputValue;

      var clear = h('span', {
        key: 'clear',
        on: {
          'mousedown': _util.preventDefaultEvent,
          'click': this.onClearSelection
        },

        style: _util.UNSELECTABLE_STYLE,
        attrs: { unselectable: 'unselectable'
        },
        'class': prefixCls + '-selection__clear'
      });
      if (!allowClear) {
        return null;
      }
      if ((0, _util.isCombobox)(this.$props)) {
        if (inputValue) {
          return clear;
        }
        return null;
      }
      if (inputValue || sValue.length) {
        return clear;
      }
      return null;
    },

    // rootRefClick (e) {
    //   // e.stopPropagation()
    //   if (this._focused) {
    //     // this.getInputDOMNode().blur()
    //     this.onOuterBlur()
    //   } else {
    //     this.onOuterFocus()
    //     // this.getInputDOMNode().focus()
    //   }
    // },
    selectionRefClick: function selectionRefClick(e) {
      e.stopPropagation();
      if (!this.disabled) {
        var input = this.getInputDOMNode();
        if (this._focused && this.openStatus) {
          this._focused = false;
          this.setOpenState(false, false);
          input && input.blur();
        } else {
          this.clearBlurTime();
          this._focused = true;
          this.setOpenState(true, true);
          input && input.focus();
        }
      }
    },
    selectionRefFocus: function selectionRefFocus(e) {
      if (this._focused || this.disabled) {
        return;
      }
      this._focused = true;
      this.updateFocusClassName();
      this.$emit('focus');
    },
    selectionRefBlur: function selectionRefBlur(e) {
      this._focused = false;
      this.updateFocusClassName();
      this.$emit('blur');
    }
  },

  render: function render() {
    var _extends2;

    var h = arguments[0];

    this.initLabelAndTitleMap();
    var props = this.$props;
    var multiple = (0, _util.isMultipleOrTags)(props);
    var preOptions = this._options || [];

    var _getOptionsAndOpenSta = this.getOptionsAndOpenStatus(),
        options = _getOptionsAndOpenSta.options,
        openStatus = _getOptionsAndOpenSta.open;

    var disabled = this.disabled,
        prefixCls = this.prefixCls,
        inputValue = this.inputValue,
        sValue = this.sValue,
        $listeners = this.$listeners;
    var _$listeners$mouseente = $listeners.mouseenter,
        mouseenter = _$listeners$mouseente === undefined ? noop : _$listeners$mouseente,
        _$listeners$mouseleav = $listeners.mouseleave,
        mouseleave = _$listeners$mouseleav === undefined ? noop : _$listeners$mouseleav,
        _$listeners$popupScro = $listeners.popupScroll,
        popupScroll = _$listeners$popupScro === undefined ? noop : _$listeners$popupScro;

    var ctrlNode = this.renderTopControlNode(openStatus);
    var selectionProps = {
      props: {},
      attrs: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'true',
        'aria-expanded': openStatus.toString()
      },
      on: {
        click: this.selectionRefClick
      },
      'class': prefixCls + '-selection ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
      ref: 'selectionRef',
      key: 'selection'

    };
    if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
      selectionProps.on.keydown = this.onKeyDown;
      selectionProps.on.focus = this.selectionRefFocus;
      selectionProps.on.blur = this.selectionRefBlur;
      selectionProps.attrs.tabIndex = props.disabled ? -1 : 0;
    }
    var rootCls = (0, _extends4['default'])({}, (0, _propsUtil.getClass)(this), (_extends2 = {}, (0, _defineProperty3['default'])(_extends2, prefixCls, true), (0, _defineProperty3['default'])(_extends2, prefixCls + '-open', openStatus), (0, _defineProperty3['default'])(_extends2, prefixCls + '-focused', openStatus || !!this._focused), (0, _defineProperty3['default'])(_extends2, prefixCls + '-combobox', (0, _util.isCombobox)(props)), (0, _defineProperty3['default'])(_extends2, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_extends2, prefixCls + '-enabled', !disabled), (0, _defineProperty3['default'])(_extends2, prefixCls + '-allow-clear', !!props.allowClear), _extends2));
    return h(
      _SelectTrigger2['default'],
      {
        attrs: {
          dropdownAlign: props.dropdownAlign,
          dropdownClassName: props.dropdownClassName,
          dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
          defaultActiveFirstOption: props.defaultActiveFirstOption,
          dropdownMenuStyle: props.dropdownMenuStyle,
          transitionName: props.transitionName,
          animation: props.animation,
          prefixCls: props.prefixCls,
          dropdownStyle: props.dropdownStyle,
          combobox: props.combobox,
          showSearch: props.showSearch,
          options: options.length || openStatus ? options : preOptions,
          multiple: multiple,
          disabled: disabled,
          visible: openStatus,
          inputValue: inputValue,
          value: sValue,
          firstActiveValue: props.firstActiveValue,

          getPopupContainer: props.getPopupContainer,

          showAction: props.showAction
        },
        on: {
          'dropdownVisibleChange': this.onDropdownVisibleChange,
          'menuSelect': this.onMenuSelect,
          'menuDeselect': this.onMenuDeselect,
          'popupScroll': popupScroll,
          'popupFocus': this.onPopupFocus,
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        },
        ref: 'selectTriggerRef'
      },
      [h(
        'div',
        {
          ref: 'rootRef',
          style: (0, _propsUtil.getStyle)(this),
          'class': (0, _classnames3['default'])(rootCls)
          // tabindex='-1'
          // onBlur={this.onOuterBlur}
          // onFocus={this.onOuterFocus}
        },
        [h(
          'div',
          selectionProps,
          [ctrlNode, this.renderClear(), multiple || !props.showArrow ? null : h(
            'span',
            {
              key: 'arrow',
              'class': prefixCls + '-arrow',
              style: _util.UNSELECTABLE_STYLE,
              attrs: { unselectable: 'unselectable'
                // onClick={this.onArrowClick}
              }
            },
            [h('b')]
          )]
        )]
      )]
    );
  }
};
module.exports = exports['default'];