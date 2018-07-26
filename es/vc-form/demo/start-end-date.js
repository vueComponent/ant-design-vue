/* eslint no-console:0 */

import { DatePicker } from 'vue-antd-ui';
import createDOMForm from '../src/createDOMForm';
import { regionStyle, errorStyle } from './styles';

var Form = {
  props: {
    form: Object
  },
  methods: {
    onSubmit: function onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFieldsAndScroll(function (error, values) {
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
    },
    checkStart: function checkStart(rule, value, callback) {
      var validateFields = this.form.validateFields;

      validateFields(['end'], {
        force: true
      });
      callback();
    },
    checkEnd: function checkEnd(rule, value, callback) {
      var end = value;
      var getFieldValue = this.form.getFieldValue;

      var start = getFieldValue('start');
      if (!end || !start) {
        callback('please select both start and end time');
      } else if (end.valueOf() < start.valueOf()) {
        callback('start time should be less than end time');
      } else {
        callback();
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var form = this.form;
    var getFieldProps = form.getFieldProps,
        getFieldError = form.getFieldError;

    return h(
      'div',
      { style: { margin: 20 } },
      [h('h2', ['startTime and endTime validation']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(
          'div',
          { style: regionStyle },
          [h('div', ['start: ']), h('div', [h(DatePicker, getFieldProps('start', {
            rules: [this.checkStart]
          }))])]
        ), h(
          'div',
          { style: regionStyle },
          [h('div', ['end: ']), h('div', [h(DatePicker, getFieldProps('end', {
            rules: [this.checkEnd]
          }))])]
        ), h(
          'div',
          { style: errorStyle },
          [getFieldError('end') ? getFieldError('end').join(',') : '']
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

export default createDOMForm()(Form);