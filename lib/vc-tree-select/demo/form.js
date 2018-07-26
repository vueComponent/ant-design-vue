'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

require('../assets/index.less');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _vcSelect = require('../../vc-select');

var _vcSelect2 = _interopRequireDefault(_vcSelect);

var _vcForm = require('../../vc-form');

var _styles = require('./styles');

var _util = require('./util');

require('../../vc-select/assets/index.less');

require('./demo.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Option = _vcSelect2['default'].Option;


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

    return h(_index2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{ props: this.$props }, {
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
        treeData: _util.gData,
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
          { style: _styles.regionStyle },
          [h('div', [h(
            'p',
            { style: { color: 'blue' } },
            ['no onChange']
          ), getFieldDecorator('tree-select', {
            initialValue: ['0-0-0-value'],
            rules: [{ required: true, type: 'array', message: 'tree-select 需要必填' }]
          })(h(_index2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([tProps, {
            style: { width: '300px' }
          }])))]), h(
            'p',
            { style: _styles.errorStyle },
            [getFieldError('tree-select') ? getFieldError('tree-select').join(',') : null]
          )]
        ), h(
          'div',
          { style: _styles.regionStyle },
          [h('div', [h(
            'p',
            { style: { color: 'blue' } },
            ['custom onChange']
          ), getFieldDecorator('tree-select1', {
            initialValue: ['0-0-0-value'],
            rules: [{ required: true, type: 'array', message: 'tree-select1 需要必填' }]
          })(h(TreeSelectInput, (0, _babelHelperVueJsxMergeProps2['default'])([tProps, {
            style: { width: '300px' }
            // treeData={gData}
          }])))]), h(
            'p',
            { style: _styles.errorStyle },
            [getFieldError('tree-select1') ? getFieldError('tree-select1').join(',') : null]
          )]
        ), h(
          'div',
          { style: _styles.regionStyle },
          [getFieldDecorator('select', {
            initialValue: ['jack'],
            rules: [{ required: true, type: 'array', message: 'select 需要必填' }]
          })(h(
            _vcSelect2['default'],
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
            { style: _styles.errorStyle },
            [getFieldError('select') ? getFieldError('select').join(',') : null]
          )]
        ), h(
          'div',
          { style: _styles.regionStyle },
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

exports['default'] = (0, _vcForm.createForm)()(Form);
module.exports = exports['default'];