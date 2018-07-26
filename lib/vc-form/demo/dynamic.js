'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('../index');

var _styles = require('./styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/no-multi-comp:0, no-console:0 */

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
    var style = (0, _extends3['default'])({}, _styles.regionStyle, {
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
        { style: _styles.errorStyle },
        [errors.join(',')]
      ) : null, isFieldValidating('email') ? h(
        'div',
        { style: _styles.errorStyle },
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
      { style: _styles.regionStyle },
      [h('div', ['user:', h('input', getFieldProps('user', {
        initialValue: 'x',
        rules: [{
          required: true
        }]
      }))]), errors ? h(
        'div',
        { style: _styles.errorStyle },
        [errors.join(',')]
      ) : null, isFieldValidating('user') ? h(
        'div',
        { style: _styles.errorStyle },
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
          { style: _styles.regionStyle },
          [h('div', [h('label', ['remove/add user:', h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
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
          { style: _styles.regionStyle },
          [h('div', [h('label', ['hide/show email:', h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
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
          { style: _styles.regionStyle },
          [h('button', ['submit'])]
        )]
      )]
    );
  }
};

exports['default'] = (0, _index.createForm)()(Form);
module.exports = exports['default'];