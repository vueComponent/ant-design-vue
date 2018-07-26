import _extends from 'babel-runtime/helpers/extends';
/* eslint react/no-multi-comp:0, no-console:0 */

import { createForm } from '../index';
import { regionStyle } from './styles';
import { Switch } from 'vue-antd-ui';

var TopForm = {
  props: {
    form: Object
  },
  render: function render() {
    var h = arguments[0];
    var getFieldProps = this.form.getFieldProps;

    return h(
      'div',
      { style: regionStyle },
      [h('div', ['has email? ']), h('div', [h(Switch, getFieldProps('on', {
        initialValue: true,
        valuePropName: 'checked'
      }))])]
    );
  }
};

var BottomForm = {
  props: {
    form: Object,
    on: Boolean
  },
  render: function render() {
    var h = arguments[0];
    var form = this.form;

    var on = form.getFieldValue('on');
    var style = _extends({}, regionStyle, {
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
      { style: regionStyle },
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

var NewForm = createForm()(Form);

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['parallel form']), h(NewForm)]);
  }
};