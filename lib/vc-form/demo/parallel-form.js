'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('../index');

var _styles = require('./styles');

var _vueAntdUi = require('vue-antd-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TopForm = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var getFieldProps = this.form.getFieldProps;

    return h(
      'div',
      { style: _styles.regionStyle },
      [h('div', ['has email? ']), h('div', [h(_vueAntdUi.Switch, getFieldProps('on', {
        initialValue: true,
        valuePropName: 'checked'
      }))])]
    );
  }
}; /* eslint react/no-multi-comp:0, no-console:0 */

var BottomForm = {
  props: {
    form: Object,
    on: Boolean
  },
  render: function render() {
    var h = arguments[0];
    var form = this.form;

    var on = form.getFieldValue('on');
    var style = (0, _extends3['default'])({}, _styles.regionStyle, {
      display: on ? 'block' : 'none'
    });
    return h(
      'div',
      { style: style },
      [h('div', ['email: ']), h('div', [h('input', form.getFieldProps('email', {
        rules: [{
          type: 'email'
        }],
        hidden: !on
      }))])]
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
      console.log(this.form.getFieldsValue());
    }
  },

  render: function render() {
    var h = arguments[0];
    var form = this.form;

    return h('div', [h(TopForm, {
      attrs: { form: form }
    }), h(BottomForm, {
      attrs: { form: form }
    }), h(
      'div',
      { style: _styles.regionStyle },
      [h(
        'button',
        {
          on: {
            'click': this.onSubmit
          }
        },
        ['submit']
      )]
    )]);
  }
};

var NewForm = (0, _index.createForm)()(Form);

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['parallel form']), h(NewForm)]);
  }
};
module.exports = exports['default'];