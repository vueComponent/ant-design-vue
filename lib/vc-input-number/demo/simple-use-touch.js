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
      value: 5
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
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 10px;' },
      [h(_index2['default'], {
        attrs: {
          min: -8,
          max: 10,
          value: this.value,

          readOnly: this.readOnly,
          disabled: this.disabled,
          useTouch: true
        },
        style: 'width: 100px',
        on: {
          'change': this.onChange
        }
      }), h(
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