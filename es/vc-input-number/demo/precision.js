import InputNumber from '../src/index';
import '../assets/index.less';

export default {
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
      [h(InputNumber, {
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