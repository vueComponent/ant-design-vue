import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data: function data() {
    return {
      value: 0.000000001
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
      [h(InputNumber, {
        attrs: {
          min: -10,
          max: 10,
          step: 0.000000001,

          value: this.value
        },
        style: 'width: 100px', on: {
          'change': this.onChange
        }
      })]
    );
  }
};