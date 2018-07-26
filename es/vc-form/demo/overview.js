import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
/* eslint react/no-multi-comp:0, no-console:0 */

import createDOMForm from '../src/createDOMForm';
import { DatePicker, Select } from 'vue-antd-ui';
import { regionStyle, errorStyle } from './styles';
var Option = Select.Option;


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
        rules: [{
          type: 'email',
          message: h(
            'b',
            { key: 'err' },
            ['\u9519\u8BEF\u7684 email \u683C\u5F0F']
          )
        }]
      }))]), h(
        'div',
        { style: errorStyle },
        [errors]
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
      [h('div', [h(
        'span',
        { style: { color: 'red' } },
        ['*']
      ), ' user async validate']), h('div', [h('input', getFieldProps('user', {
        initialValue: '',
        validateFirst: true,
        rules: [{
          required: true
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

var CustomInput = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form3 = this.form,
        getFieldProps = _form3.getFieldProps,
        getFieldError = _form3.getFieldError,
        isFieldValidating = _form3.isFieldValidating;

    var errors = getFieldError('select');
    return h(
      'div',
      { style: regionStyle },
      [h('div', [h(
        'span',
        { style: { color: 'red' } },
        ['*']
      ), ' custom select sync validate']), h('div', [h(
        Select,
        _mergeJSXProps([{
          attrs: {
            placeholder: 'please select'
          },
          style: { width: '200px' }
        }, getFieldProps('select', {
          rules: [{
            required: true
          }]
        })]),
        [h(
          Option,
          {
            attrs: { value: '1' }
          },
          ['1']
        ), h(
          Option,
          {
            attrs: { value: '2' }
          },
          ['2']
        )]
      )]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'div',
        { style: errorStyle },
        [isFieldValidating('select') ? 'validating' : null]
      )]
    );
  }
};

var DateInput = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form4 = this.form,
        getFieldProps = _form4.getFieldProps,
        getFieldError = _form4.getFieldError;

    var errors = getFieldError('date');
    return h(
      'div',
      { style: regionStyle },
      [h('div', [h(
        'span',
        { style: { color: 'red' } },
        ['*']
      ), ' DateInput sync validate']), h(
        'div',
        { style: { width: '200px' } },
        [h(DatePicker, _mergeJSXProps([{
          attrs: {
            placeholder: 'please select'
          }
        }, getFieldProps('date', {
          rules: [{
            required: true,
            type: 'object'
          }]
        })]))]
      ), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      )]
    );
  }
};

function toNumber(v) {
  if (v === undefined) {
    return v;
  }
  if (v === '') {
    return undefined;
  }
  if (v && v.trim() === '') {
    return NaN;
  }
  return Number(v);
}

var NumberInput = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var _form5 = this.form,
        getFieldProps = _form5.getFieldProps,
        getFieldError = _form5.getFieldError;

    var errors = getFieldError('number');
    return h(
      'div',
      { style: regionStyle },
      [h('div', ['number input']), h('div', [h('input', getFieldProps('number', {
        initialValue: '1',
        rules: [{
          transform: toNumber,
          type: 'number'
        }]
      }))]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      )]
    );
  }
};

var Form = {
  methods: {
    onSubmit: function onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFieldsAndScroll({ scroll: { offsetTop: 20 } }, function (error, values) {
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
    var getFieldProps = form.getFieldProps,
        getFieldError = form.getFieldError;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['overview']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(User, {
          attrs: { form: form, saveRef: this.saveRef }
        }), h(NumberInput, {
          attrs: { form: form }
        }), h(Email, {
          attrs: { form: form }
        }), h(CustomInput, {
          attrs: { form: form }
        }), h(DateInput, {
          attrs: { form: form }
        }), h(
          'div',
          { style: regionStyle },
          [h('div', ['normal required input']), h('div', [h('input', getFieldProps('normal', {
            initialValue: '',
            rules: [{
              required: true
            }]
          }))]), h(
            'div',
            { style: errorStyle },
            [getFieldError('normal') ? getFieldError('normal').join(',') : null]
          )]
        ), h(
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

export default createDOMForm({
  validateMessages: {
    required: function required(field) {
      return field + ' \u5FC5\u586B';
    }
  }
})(Form);