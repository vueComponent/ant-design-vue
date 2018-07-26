import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import '../assets/index.less';
import TreeSelect from '../index';
import Select from '../../vc-select';
import { createForm } from '../../vc-form';
import { regionStyle, errorStyle } from './styles';
import { gData } from './util';
import '../../vc-select/assets/index.less';
import './demo.less';

var Option = Select.Option;


var TreeSelectInput = {
  props: ['multiple', 'treeData', 'treeCheckable', 'value'],
  methods: {
    onChange: function onChange(value) {
      console.log(value, arguments);
      this.$emit('change', value);
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(TreeSelect, _mergeJSXProps([{ props: this.$props }, {
      on: {
        'change': this.onChange.bind(this)
      }
    }]));
  }
};

var Form = {
  methods: {
    onSubmit: function onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFields(function (error, values) {
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
    var getFieldDecorator = form.getFieldDecorator,
        getFieldError = form.getFieldError;

    var tProps = {
      props: {
        multiple: true,
        treeData: gData,
        treeCheckable: true
        // treeDefaultExpandAll: true,
      }
    };
    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['validity']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(
          'div',
          { style: regionStyle },
          [h('div', [h(
            'p',
            { style: { color: 'blue' } },
            ['no onChange']
          ), getFieldDecorator('tree-select', {
            initialValue: ['0-0-0-value'],
            rules: [{ required: true, type: 'array', message: 'tree-select 需要必填' }]
          })(h(TreeSelect, _mergeJSXProps([tProps, {
            style: { width: '300px' }
          }])))]), h(
            'p',
            { style: errorStyle },
            [getFieldError('tree-select') ? getFieldError('tree-select').join(',') : null]
          )]
        ), h(
          'div',
          { style: regionStyle },
          [h('div', [h(
            'p',
            { style: { color: 'blue' } },
            ['custom onChange']
          ), getFieldDecorator('tree-select1', {
            initialValue: ['0-0-0-value'],
            rules: [{ required: true, type: 'array', message: 'tree-select1 需要必填' }]
          })(h(TreeSelectInput, _mergeJSXProps([tProps, {
            style: { width: '300px' }
            // treeData={gData}
          }])))]), h(
            'p',
            { style: errorStyle },
            [getFieldError('tree-select1') ? getFieldError('tree-select1').join(',') : null]
          )]
        ), h(
          'div',
          { style: regionStyle },
          [getFieldDecorator('select', {
            initialValue: ['jack'],
            rules: [{ required: true, type: 'array', message: 'select 需要必填' }]
          })(h(
            Select,
            {
              style: { width: '200px' }, attrs: { allowClear: true, multiple: true
              }
            },
            [h(
              Option,
              {
                attrs: { value: 'jack' }
              },
              ['jack']
            ), h(
              Option,
              {
                attrs: { value: 'lucy' }
              },
              ['lucy']
            ), h(
              Option,
              {
                attrs: { value: 'disabled', disabled: true }
              },
              ['disabled']
            ), h(
              Option,
              {
                attrs: { value: 'yiminghe' }
              },
              ['yiminghe']
            )]
          )), h(
            'p',
            { style: errorStyle },
            [getFieldError('select') ? getFieldError('select').join(',') : null]
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

export default createForm()(Form);