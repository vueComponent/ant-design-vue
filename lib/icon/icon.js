'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AIcon',
  props: {
    prefixCls: {
      'default': 'anticon',
      type: String
    },
    type: String,
    title: String,
    spin: Boolean
  },
  data: function data() {
    return {};
  },

  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          type = this.type,
          spin = this.spin;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + type, type), (0, _defineProperty3['default'])(_ref, prefixCls + '-spin', !!spin || type === 'loading'), _ref;
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      var _this = this;

      if (this.clicked) {
        return;
      }

      this.clicked = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        return _this.clicked = false;
      }, 500);
      this.$emit('click', event);
    }
  },
  render: function render() {
    var h = arguments[0];
    var title = this.title,
        classes = this.classes,
        handleClick = this.handleClick,
        $listeners = this.$listeners;

    var iconProps = {
      attrs: {
        title: title
      },
      'class': classes,
      on: (0, _extends3['default'])({}, $listeners, {
        click: handleClick
      })
    };
    return h('i', iconProps);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
};
module.exports = exports['default'];