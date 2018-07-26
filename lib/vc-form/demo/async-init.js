'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _styles = require('./styles');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
      { style: _styles.regionStyle },
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
        { style: _styles.errorStyle },
        [errors ? errors.join(',') : null]
      ), h(
        'div',
        { style: _styles.errorStyle },
        [isFieldValidating('email') ? 'validating' : null]
      )]
    );
  }
}; /* eslint react/no-multi-comp:0, no-console:0 */

var Form = {
  mixins: [_BaseMixin2['default']],
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
          { style: _styles.regionStyle },
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

exports['default'] = (0, _index.createForm)()(Form);
module.exports = exports['default'];