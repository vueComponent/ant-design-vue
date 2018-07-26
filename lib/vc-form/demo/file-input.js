'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _index = require('../index');

var _styles = require('./styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/no-multi-comp:0, no-console:0 */

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
        style: _styles.regionStyle
      },
      [h('div', ['attachment:']), h('div', [h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: { type: 'file' }
      }, getFieldProps('attachment', {
        getValueProps: getFileValueProps,
        getValueFromEvent: getValueFromFileEvent,
        rules: [this.checkSize]
      })]))]), h(
        'div',
        { style: _styles.errorStyle },
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

var NewForm = (0, _index.createForm)()(Form);

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['input[type="file"]']), h(NewForm)]);
  }
};
module.exports = exports['default'];