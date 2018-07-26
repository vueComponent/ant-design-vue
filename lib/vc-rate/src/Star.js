'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'Star',
  props: {
    value: _vueTypes2['default'].number,
    index: _vueTypes2['default'].number,
    prefixCls: _vueTypes2['default'].string,
    allowHalf: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    character: _vueTypes2['default'].any,
    focused: _vueTypes2['default'].bool
  },
  methods: {
    onHover: function onHover(e) {
      var index = this.index;

      this.$emit('hover', e, index);
    },
    onClick: function onClick(e) {
      var index = this.index;

      this.$emit('click', e, index);
    },
    getClassName: function getClassName() {
      var prefixCls = this.prefixCls,
          index = this.index,
          value = this.value,
          allowHalf = this.allowHalf,
          focused = this.focused;

      var starValue = index + 1;
      var className = prefixCls;
      if (value === 0 && index === 0 && focused) {
        className += ' ' + prefixCls + '-focused';
      } else if (allowHalf && value + 0.5 === starValue) {
        className += ' ' + prefixCls + '-half ' + prefixCls + '-active';
        if (focused) {
          className += ' ' + prefixCls + '-focused';
        }
      } else {
        className += starValue <= value ? ' ' + prefixCls + '-full' : ' ' + prefixCls + '-zero';
        if (starValue === value && focused) {
          className += ' ' + prefixCls + '-focused';
        }
      }
      return className;
    }
  },
  render: function render() {
    var h = arguments[0];
    var onHover = this.onHover,
        onClick = this.onClick,
        disabled = this.disabled,
        prefixCls = this.prefixCls;

    var character = this.character;
    if (character === undefined) {
      character = this.$slots.character;
    }
    return h(
      'li',
      {
        'class': this.getClassName(),
        on: {
          'click': disabled ? noop : onClick,
          'mousemove': disabled ? noop : onHover
        }
      },
      [h(
        'div',
        { 'class': prefixCls + '-first' },
        [character]
      ), h(
        'div',
        { 'class': prefixCls + '-second' },
        [character]
      )]
    );
  }
};
module.exports = exports['default'];