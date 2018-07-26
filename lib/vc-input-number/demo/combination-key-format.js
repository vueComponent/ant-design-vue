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
      disabled: false,
      readOnly: false,
      value: 50000
    };
  },

  methods: {
    onChange: function onChange(value) {
      console.log('onChange:', value);
      this.value = value;
    },
    toggleDisabled: function toggleDisabled() {
      this.disabled = !this.disabled;
    },
    toggleReadOnly: function toggleReadOnly() {
      this.readOnly = !this.readOnly;
    },
    numberWithCommas: function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    format: function format(num) {
      return '$ ' + this.numberWithCommas(num) + ' boeing737';
    },
    parser: function parser(num) {
      return num.toString().split(' ')[1].replace(/,*/g, '');
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 10px;' },
      [h(_index2['default'], {
        attrs: {
          min: -8000,
          max: 10000000,
          value: this.value,

          readOnly: this.readOnly,
          disabled: this.disabled,
          autoFocus: false,
          step: 100,
          formatter: this.format,
          parser: this.parser
        },
        on: {
          'change': this.onChange
        },

        style: 'width: 200px' }), h(
        'p',
        { style: 'padding:10px 0' },
        [h(
          'button',
          {
            on: {
              'click': this.toggleDisabled
            }
          },
          ['toggle Disabled']
        ), h(
          'button',
          {
            on: {
              'click': this.toggleReadOnly
            }
          },
          ['toggle readOnly']
        )]
      )]
    );
  }
};
module.exports = exports['default'];