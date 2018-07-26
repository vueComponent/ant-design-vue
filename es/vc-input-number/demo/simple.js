import InputNumber from '../src/index';
import '../assets/index.less';

export default {
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
      [h(InputNumber, {
        attrs: {
          min: -8,
          max: 10,
          value: this.value,

          readOnly: this.readOnly,
          disabled: this.disabled
        },
        on: {
          'change': this.onChange
        },

        style: 'width: 100px' }), h(
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