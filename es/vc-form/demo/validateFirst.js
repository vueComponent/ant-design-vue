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
      [h('div', ['email sync validate']), h('div', [h('input', getFieldProps('email', {
        initialValue: '',
        validateFirst: true,
        rules: [{
          required: true
        }, {
          type: 'email',
          message: '错误的 email 格式'
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
  methods: {
    userExists: function userExists(rule, value, callback) {
      setTimeout(function () {
        if (value === '1') {
          callback([new Error('are you kidding?')]);
        } else if (value === 'yiminghe') {
          callback([new Error('forbid yiminghe')]);
        } else {
          callback();
        }
      }, 300);
    }
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
      [h('div', ['user async validate']), h('div', [h('input', getFieldProps('user', {
        initialValue: '',
        rules: [{
          required: true,
          min: 2
        }, {
          validator: this.userExists
        }]
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
  methods: {
    onSubmit: function onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFields({
        // firstFields: false,
      }, function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    reset: function reset(e) {
      e.preventDefault();
      this.form.resetFields();
    }
  },

  render: function render() {
    var h = arguments[0];
    var form = this.form;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['validateFirst']), h(
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
          [h(
            'button',
            {
              on: {
                'click': this.reset
              }
            },
            ['reset']
          ), '\xA0', h('input', {
            attrs: { type: 'submit', value: 'submit' }
          })]
        )]
      )]
    );
  }
};

export default createForm()(Form);