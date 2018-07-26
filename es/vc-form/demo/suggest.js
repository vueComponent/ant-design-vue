/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { Select } from 'vue-antd-ui';
import { regionStyle, errorStyle } from './styles';
import { mergeProps } from '../../_util/props-util';
var emailTpl = ['@gmail.com', '@outlook.com', '@qq.com'];
var Option = Select.Option;

var CustomInput = {
  props: {
    form: Object
  },
  data: function data() {
    return {
      data: []
    };
  },

  methods: {
    onChange: function onChange(v) {
      if (v.indexOf('@') === -1) {
        this.data = emailTpl.map(function (m) {
          return v + m;
        });
      } else if (this.data.length) {
        this.data = [];
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError,
        isFieldValidating = _form.isFieldValidating;

    var errors = getFieldError('select');
    return h(
      'div',
      { style: regionStyle },
      [h('div', ['custom select sync validate']), h('div', [h(
        Select,
        mergeProps({
          props: {
            placeholder: 'please select',
            mode: 'combobox',
            filterOption: false
          },
          style: {
            width: '200px'
          }
        }, getFieldProps('select', {
          change: this.onChange,
          rules: [{
            type: 'email'
          }, {
            required: true
          }]
        })),
        [this.data.map(function (d) {
          return h(
            Option,
            { key: d, attrs: { value: d }
            },
            [d]
          );
        })]
      )]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : h(
          'b',
          {
            style: {
              visibility: 'hidden'
            }
          },
          ['1']
        )]
      ), h(
        'div',
        { style: errorStyle },
        [isFieldValidating('select') ? 'validating' : h(
          'b',
          {
            style: {
              visibility: 'hidden'
            }
          },
          ['1']
        )]
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
      [h('h2', ['suggest']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(CustomInput, {
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