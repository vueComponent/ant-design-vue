'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var Form = {
  props: {
    form: Object
  },

  beforeMount: function beforeMount() {
    this.nameDecorator = this.form.getFieldDecorator('name', {
      initialValue: '',
      rules: [{
        required: true,
        message: 'What\'s your name?'
      }]
    });
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    onChange: function onChange(e) {
      console.log(e.target.value);
    }
  },

  render: function render() {
    var h = arguments[0];
    var getFieldError = this.form.getFieldError;


    return h(
      'form',
      {
        on: {
          'submit': this.onSubmit
        }
      },
      [this.nameDecorator(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('name') || []).join(', ')]
      ), h('button', ['Submit'])]
    );
  }
}; /* eslint react/no-multi-comp:0, no-console:0 */

exports['default'] = (0, _index.createForm)()(Form);
module.exports = exports['default'];