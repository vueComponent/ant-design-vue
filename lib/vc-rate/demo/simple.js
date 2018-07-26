'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  data: function data() {
    return {};
  },

  methods: {
    onChange: function onChange(v) {
      console.log('selected star', v);
    },
    onFocus: function onFocus() {
      console.dir('focus');
    }
  },
  render: function render() {
    var h = arguments[0];
    var onChange = this.onChange,
        onFocus = this.onFocus;

    var rateProps = {
      props: {
        defaultValue: 2.5,
        allowHalf: true
      },
      on: {
        change: onChange
      },
      style: {
        fontSize: '50px', marginTop: '24px'
      }
    };
    var rateProps1 = {
      props: {
        defaultValue: 2
      },
      on: {
        change: onChange
      },
      style: {
        fontSize: '50px', marginTop: '24px'
      }
    };
    return h(
      'div',
      { style: 'margin: 100px' },
      [h(_index2['default'], {
        attrs: {
          defaultValue: 2.5,

          allowHalf: true,
          allowClear: false,
          autoFocus: true,
          disabled: true
        },
        on: {
          'change': onChange,
          'focus': onFocus
        },

        style: 'fontSize: 40px' }), h('br'), h(_index2['default'], {
        attrs: {
          defaultValue: 2.5,

          allowHalf: true,
          character: '$'
        },
        on: {
          'change': onChange
        },

        style: 'fontSize: 50px; marginTop: 24px' }), h('br'), h(
        _index2['default'],
        rateProps,
        [h('i', { slot: 'character', 'class': 'anticon anticon-star' })]
      ), h('br'), h(
        _index2['default'],
        rateProps1,
        [h('i', { slot: 'character', 'class': 'anticon anticon-star' })]
      )]
    );
  }
};
module.exports = exports['default'];