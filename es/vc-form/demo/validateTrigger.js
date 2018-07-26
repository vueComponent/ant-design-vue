/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

var Email = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError,
        isFieldValidating = _form.isFieldValidating;

    var errors = getFieldError('email');
    return h(
      'div',
      { style: regionStyle },
      [h('div', ['email validate onBlur && onChange']), h('div', [h('input', getFieldProps('email', {
        validate: [{
          trigger: 'blur',
          rules: [{
            required: true
          }]
        }, {
          trigger: ['blur', 'input'],
          rules: [{
            type: 'email',
            message: '错误的 email 格式'
          }]
        }]
      }))]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'div',
        { style: errorStyle },
        [isFieldValidating('email') ? 'validating' : null]
      )]
    );
  }
};

var User = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form2 = this.form,
        getFieldProps = _form2.getFieldProps,
        getFieldError = _form2.getFieldError,
        isFieldValidating = _form2.isFieldValidating;

    var errors = getFieldError('user');
    return h(
      'div',
      { style: regionStyle },
      [h('div', ['user validate on submit']), h('div', [h('input', getFieldProps('user', {
        rules: [{
          required: true
        }, {
          type: 'string',
          min: 5
        }],
        validateTrigger: null
      }))]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'div',
        { style: errorStyle },
        [isFieldValidating('user') ? 'validating' : null]
      )]
    );
  }
};

var Form = {
  props: {
    form: Object
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
    }
  },

  render: function render() {
    var h = arguments[0];
    var form = this.form;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['use validateTrigger config']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(User, {
          attrs: { form: form }
        }), h(Email, {
          attrs: { form: form }
        }), h(
          'div',
          { style: regionStyle },
          [h('button', ['submit'])]
        )]
      )]
    );
  }
};

export default createForm()(Form);