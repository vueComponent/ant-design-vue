'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _createDOMForm = require('../src/createDOMForm');

var _createDOMForm2 = _interopRequireDefault(_createDOMForm);

var _vueAntdUi = require('vue-antd-ui');

var _styles = require('./styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/no-multi-comp:0, no-console:0 */

var Form = {
  mixins: [_BaseMixin2['default']],
  props: {
    form: Object
  },

  data: function data() {
    return {
      visible: false
    };
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    onCancel: function onCancel() {
      this.setState({
        visible: false
      });
    },
    open: function open() {
      this.setState({
        visible: true
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['modal']), h(
        _vueAntdUi.Modal,
        {
          attrs: {
            visible: this.visible,
            bodyStyle: {
              height: '200px',
              overflow: 'auto'
            },

            title: 'modal'
          },
          on: {
            'cancel': this.onCancel
          }
        },
        [h(
          'div',
          { ref: 'dialogContent' },
          [h(
            'form',
            {
              on: {
                'submit': this.onSubmit
              }
            },
            [h('input', getFieldProps('required', {
              rules: [{
                required: true,
                message: '必填'
              }]
            })), h(
              'div',
              { style: _styles.errorStyle },
              [getFieldError('required') ? getFieldError('required').join(',') : h(
                'b',
                { style: { visibility: 'hidden' } },
                ['1']
              )]
            ), h(
              'div',
              { style: { marginTop: '300px' } },
              [h('button', ['submit'])]
            )]
          )]
        )]
      ), h(
        'div',
        { style: _styles.regionStyle },
        [h(
          'button',
          {
            on: {
              'click': this.open
            }
          },
          ['open']
        )]
      )]
    );
  }
};

exports['default'] = (0, _createDOMForm2['default'])()(Form);
module.exports = exports['default'];