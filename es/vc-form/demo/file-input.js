import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

function getFileValueProps(value) {
  if (value && value.target) {
    return {
      value: value.target.value
    };
  }
  return {
    value: value
  };
}

function getValueFromFileEvent(_ref) {
  var target = _ref.target;

  return {
    target: target
  };
}

var Form = {
  props: {
    form: Object
  },
  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(function (error, values) {
        console.log(error, values);
        if (!error) {
          console.log('校验通过');
        }
      });
    },
    checkSize: function checkSize(rule, value, callback) {
      if (value && value.target) {
        var files = value.target.files;
        if (files[0]) {
          callback(files[0].size > 1000000 ? 'file size must be less than 1M' : undefined);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError;

    var errors = getFieldError('attachment');
    return h(
      'div',
      {
        style: regionStyle
      },
      [h('div', ['attachment:']), h('div', [h('input', _mergeJSXProps([{
        attrs: { type: 'file' }
      }, getFieldProps('attachment', {
        getValueProps: getFileValueProps,
        getValueFromEvent: getValueFromFileEvent,
        rules: [this.checkSize]
      })]))]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'button',
        {
          on: {
            'click': this.onSubmit
          }
        },
        ['submit']
      )]
    );
  }
};

var NewForm = createForm()(Form);

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['input[type="file"]']), h(NewForm)]);
  }
};