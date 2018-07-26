import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

var Email = {
  props: {
    form: Object,
    hidden: Boolean
  },
  render: function render() {
    var h = arguments[0];
    var hidden = this.hidden,
        form = this.form;
    var getFieldProps = form.getFieldProps,
        getFieldError = form.getFieldError,
        isFieldValidating = form.isFieldValidating;

    var errors = getFieldError('email');
    var style = _extends({}, regionStyle, {
      display: hidden ? 'none' : ''
    });
    return h(
      'div',
      { style: style },
      [h('div', ['email:', h('input', getFieldProps('email', {
        rules: [{
          required: true
        }, {
          type: 'email',
          message: '错误的 email 格式'
        }],
        hidden: hidden
      }))]), errors ? h(
        'div',
        { style: errorStyle },
        [errors.join(',')]
      ) : null, isFieldValidating('email') ? h(
        'div',
        { style: errorStyle },
        ['validating']
      ) : null]
    );
  }
};

var User = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError,
        isFieldValidating = _form.isFieldValidating;

    var errors = getFieldError('user');
    return h(
      'div',
      { style: regionStyle },
      [h('div', ['user:', h('input', getFieldProps('user', {
        initialValue: 'x',
        rules: [{
          required: true
        }]
      }))]), errors ? h(
        'div',
        { style: errorStyle },
        [errors.join(',')]
      ) : null, isFieldValidating('user') ? h(
        'div',
        { style: errorStyle },
        ['validating']
      ) : null]
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
    var getFieldProps = form.getFieldProps,
        getFieldValue = form.getFieldValue;

    return h(
      'div',
      { style: { margin: 20 } },
      [h('h2', ['overview']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(
          'div',
          { style: regionStyle },
          [h('div', [h('label', ['remove/add user:', h('input', _mergeJSXProps([{
            attrs: {
              type: 'checkbox'
            }
          }, getFieldProps('remove_user', {
            // initialValue:true,
            valuePropName: 'checked'
          })]))])])]
        ), getFieldValue('remove_user') ? null : h(User, {
          attrs: { form: form }
        }), h(
          'div',
          { style: regionStyle },
          [h('div', [h('label', ['hide/show email:', h('input', _mergeJSXProps([{
            attrs: {
              type: 'checkbox'
            }
          }, getFieldProps('hide_email', {
            // initialValue:true,
            valuePropName: 'checked'
          })]))])])]
        ), h(Email, {
          attrs: { form: form, hidden: !!getFieldValue('hide_email') }
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