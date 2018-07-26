'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Checkbox',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    prefixCls: _vueTypes2['default'].string,
    name: _vueTypes2['default'].string,
    id: _vueTypes2['default'].string,
    type: _vueTypes2['default'].string,
    defaultChecked: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].bool]),
    checked: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].bool]),
    disabled: _vueTypes2['default'].bool,
    // onFocus: PropTypes.func,
    // onBlur: PropTypes.func,
    // onChange: PropTypes.func,
    // onClick: PropTypes.func,
    // tabIndex: PropTypes.string,
    // readOnly: PropTypes.bool,
    // autoFocus: PropTypes.bool,
    value: _vueTypes2['default'].any
  }, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false
  }),
  data: function data() {
    var checked = (0, _propsUtil.hasProp)(this, 'checked') ? this.checked : this.defaultChecked;
    return {
      sChecked: checked
    };
  },

  watch: {
    checked: function checked(val) {
      this.sChecked = val;
    }
  },
  methods: {
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    handleChange: function handleChange(e) {
      var props = (0, _propsUtil.getOptionProps)(this);
      if (props.disabled) {
        return;
      }
      if (!('checked' in props)) {
        this.sChecked = e.target.checked;
      }

      props.onChange({
        target: (0, _extends3['default'])({}, props, {
          checked: e.target.checked
        }),
        stopPropagation: function stopPropagation() {
          e.stopPropagation();
        },
        preventDefault: function preventDefault() {
          e.preventDefault();
        },

        nativeEvent: e.nativeEvent
      });
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        name = this.name,
        id = this.id,
        type = this.type,
        disabled = this.disabled,
        readOnly = this.readOnly,
        tabIndex = this.tabIndex,
        onClick = this.onClick,
        onFocus = this.onFocus,
        onBlur = this.onBlur,
        autoFocus = this.autoFocus,
        value = this.value,
        others = (0, _objectWithoutProperties3['default'])(this, ['prefixCls', 'name', 'id', 'type', 'disabled', 'readOnly', 'tabIndex', 'onClick', 'onFocus', 'onBlur', 'autoFocus', 'value']);


    var globalProps = Object.keys(others).reduce(function (prev, key) {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    var checked = this.state.checked;

    var classString = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-checked', checked), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), _classNames));

    return h(
      'span',
      { 'class': classString },
      [h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          name: name,
          id: id,
          type: type,
          readOnly: readOnly,
          disabled: disabled,
          tabIndex: tabIndex,

          autoFocus: autoFocus
        },
        'class': prefixCls + '-input',
        domProps: {
          'checked': !!checked,
          'value': value
        },
        on: {
          'click': onClick,
          'focus': onFocus,
          'blur': onBlur,
          'change': this.handleChange
        },
        ref: this.saveInput
      }, globalProps])), h('span', { 'class': prefixCls + '-inner' })]
    );
  }
};
module.exports = exports['default'];