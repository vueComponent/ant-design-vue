/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';
import BaseMixin from '../../_util/BaseMixin';

var Email = {
  props: {
    form: Object
  },
  methods: {
    checkSpecial: function checkSpecial(rule, value, callback) {
      setTimeout(function () {
        if (value === 'yiminghe@gmail.com') {
          callback('can not be!');
        } else {
          callback();
        }
      }, 1000);
    }
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
      [h('div', ['email validate onBlur']), h('div', [h('input', getFieldProps('email', {
        initialValue: '',
        validateFirst: true,
        rules: [{
          required: true
        }, {
          type: 'email',
          message: '错误的 email 格式'
        }, this.checkSpecial],
        validateTrigger: 'blur'
      }))]), h(
        'div',
        { style: errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'div',
        { style: errorStyle },
        [isFieldValidating('email') ? 'validating' : null]
      )]
    );
  }
};

var Form = {
  mixins: [BaseMixin],
  props: {
    form: Object
  },
  data: function data() {
    return {
      loading: true
    };
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      _this.setState({
        loading: false
      }, function () {
        setTimeout(function () {
          _this.form.setFieldsInitialValue({
            email: 'xx@gmail.com'
          });
        }, 1000);
      });
    }, 1000);
  },

  methods: {
    onSubmit: function onSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      this.form.submit(function (callback) {
        setTimeout(function () {
          _this2.form.validateFields(function (error, values) {
            if (!error) {
              console.log('ok', values);
            } else {
              console.log('error', error, values);
            }
            callback();
          });
        }, 1000);
      });
    },
    reset: function reset(e) {
      e.preventDefault();
      this.form.resetFields();
    }
  },

  render: function render() {
    var h = arguments[0];

    if (this.loading) {
      return h('b', ['loading']);
    }
    var form = this.form;

    var disabled = form.isFieldsValidating() || form.isSubmitting();
    return h(
      'div',
      { style: { margin: 20 } },
      [h('h2', ['async init field']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(Email, {
          attrs: { form: form }
        }), h(
          'div',
          { style: regionStyle },
          [h(
            'button',
            {
              attrs: { disabled: disabled, type: 'submit' }
            },
            ['submit']
          ), '\xA0', disabled ? h(
            'span',
            { style: { color: 'red' } },
            ['disabled']
          ) : null, '\xA0', h(
            'button',
            {
              attrs: { disabled: disabled },
              on: {
                'click': this.reset
              }
            },
            ['reset']
          )]
        )]
      )]
    );
  }
};

export default createForm()(Form);