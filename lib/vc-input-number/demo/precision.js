'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../src/index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  data: function data() {
    return {
      precision: 2
    };
  },

  methods: {
    onChange: function onChange(value) {
      console.log('onChange:', value);
      this.value = value;
    },
    changeprecision: function changeprecision(e) {
      this.precision = parseInt(e.target.value, 10);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 10px;' },
      [h(_index2['default'], {
        attrs: {
          defaultValue: 1,

          precision: this.precision
        },
        on: {
          'change': this.onChange
        }
      }), h(
        'p',
        { style: 'padding:10px 0' },
        ['precision:', h('input', {
          attrs: {
            type: 'number'
          },
          on: {
            'input': this.changeprecision
          },
          domProps: {
            'value': this.precision
          }
        })]
      )]
    );
  }
};
module.exports = exports['default'];