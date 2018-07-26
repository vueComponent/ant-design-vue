'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _PropTypes = require('./PropTypes');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// function noop () {
// }
exports['default'] = {
  name: 'vc-switch',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: (0, _extends3['default'])({}, _PropTypes.switchPropTypes, {
    prefixCls: _PropTypes.switchPropTypes.prefixCls.def('rc-switch')
    // onChange: switchPropTypes.onChange.def(noop),
    // onClick: switchPropTypes.onClick.def(noop),
  }),
  data: function data() {
    var checked = false;
    if ((0, _propsUtil.hasProp)(this, 'checked')) {
      checked = !!this.checked;
    } else {
      checked = !!this.defaultChecked;
    }
    return {
      stateChecked: checked
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var autoFocus = _this.autoFocus,
          disabled = _this.disabled;

      if (autoFocus && !disabled) {
        _this.focus();
      }
    });
  },

  watch: {
    checked: function checked(val) {
      this.stateChecked = val;
    }
  },
  methods: {
    setChecked: function setChecked(checked) {
      if (this.disabled) {
        return;
      }
      if (!(0, _propsUtil.hasProp)(this, 'checked')) {
        this.stateChecked = checked;
      }
      this.$emit('change', checked);
    },
    toggle: function toggle() {
      var checked = !this.stateChecked;
      this.setChecked(checked);
      this.$emit('click', checked);
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 37) {
        // Left
        this.setChecked(false);
      } else if (e.keyCode === 39) {
        // Right
        this.setChecked(true);
      } else if (e.keyCode === 32 || e.keyCode === 13) {
        // Space, Enter
        this.toggle();
      }
    },
    handleMouseUp: function handleMouseUp(e) {
      if (this.$refs.refSwitchNode) {
        this.$refs.refSwitchNode.blur();
      }
      this.$emit('mouseup', e);
    },
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },
  render: function render() {
    var _switchClassName;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled,
        tabIndex = _getOptionProps.tabIndex,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'disabled', 'tabIndex']);

    var checked = this.stateChecked;
    var switchTabIndex = disabled ? -1 : tabIndex || 0;
    var switchClassName = (_switchClassName = {}, (0, _defineProperty3['default'])(_switchClassName, prefixCls, true), (0, _defineProperty3['default'])(_switchClassName, prefixCls + '-checked', checked), (0, _defineProperty3['default'])(_switchClassName, prefixCls + '-disabled', disabled), _switchClassName);
    var spanProps = {
      props: (0, _extends3['default'])({}, restProps),
      on: (0, _extends3['default'])({}, this.$listeners, {
        keydown: this.handleKeyDown,
        click: this.toggle,
        mouseup: this.handleMouseUp
      }),
      attrs: {
        tabIndex: switchTabIndex
      },
      'class': switchClassName,
      ref: 'refSwitchNode'
    };
    return h(
      'span',
      spanProps,
      [h(
        'span',
        { 'class': prefixCls + '-inner' },
        [checked ? (0, _propsUtil.getComponentFromProp)(this, 'checkedChildren') : (0, _propsUtil.getComponentFromProp)(this, 'unCheckedChildren')]
      )]
    );
  }
};
module.exports = exports['default'];