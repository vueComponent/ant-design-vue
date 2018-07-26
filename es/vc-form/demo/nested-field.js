/* eslint react/no-multi-comp:0, no-console:0 */

import createForm from '../src/createDOMForm';

var Form = {
  props: {
    form: Object
  },
  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      console.log('Values of member[0].name.firstname and a[0][1].b.c[0]');
      console.log(this.form.getFieldsValue(['member[0].name.firstname', 'a[0][1].b.c[0]']));
      console.log('Values of all fields');
      console.log(this.form.getFieldsValue());

      this.form.validateFieldsAndScroll(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    onChange: function onChange(e) {
      console.log(e.target.value);
    },
    setField: function setField() {
      this.form.setFieldsValue({
        member: [{
          name: {
            firstname: 'm1 first',
            lastname: 'm1 last'
          }
        }, {
          name: {
            firstname: 'm2 first',
            lastname: 'm2 last'
          }
        }],
        a: [[undefined, {
          b: {
            c: ['Value of a[0][1].b.c[0]']
          }
        }]],
        w: {
          x: {
            y: {
              z: ['Value of w.x.y.z[0]']
            }
          }
        }
      });
    },
    resetFields: function resetFields() {
      console.log('reset');
      this.form.resetFields();
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldDecorator = _form.getFieldDecorator,
        getFieldError = _form.getFieldError;


    return h(
      'form',
      {
        on: {
          'submit': this.onSubmit
        }
      },
      [h('div', ['Member 0 firstname']), getFieldDecorator('member[0].name.firstname', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s the member_0 firstname?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('member[0].name.firstname') || []).join(', ')]
      ), h('div', ['Member 0 lastname']), getFieldDecorator('member[0].name.lastname', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s the member_0 lastname?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('member[0].name.firstname') || []).join(', ')]
      ), h('div', ['Member 1 firstname']), getFieldDecorator('member[1].name.firstname', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s the member_1 fistname?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('member[1].name.firstname') || []).join(', ')]
      ), h('div', ['Member 1 lastname']), getFieldDecorator('member[1].name.lastname', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s the member_1 lastname?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('member[1].name.firstname') || []).join(', ')]
      ), h('div', ['a[0][1].b.c[0]']), getFieldDecorator('a[0][1].b.c[0]', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s a[0][1].b.c[0]?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('a[0][1].b.c[0]') || []).join(', ')]
      ), h('div', ['w.x.y.z[0]']), getFieldDecorator('w.x.y.z[0]', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s w.x.y.z[0]?'
        }]
      })(h('input', {
        on: {
          'input': this.onChange
        }
      })), h(
        'div',
        { style: { color: 'red' } },
        [(getFieldError('w.x.y.z[0]') || []).join(', ')]
      ), h(
        'button',
        {
          on: {
            'click': this.setField
          }
        },
        ['Set field']
      ), h(
        'button',
        {
          on: {
            'click': this.resetFields
          }
        },
        ['Reset fields']
      ), h('button', ['Submit'])]
    );
  }
};

var NewForm = createForm({
  onFieldsChange: function onFieldsChange(_, changedFields, allFields) {
    console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange: function onValuesChange(_, changedValues, allValues) {
    console.log('onValuesChange: ', changedValues, allValues);
  }
})(Form);

export default {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['setFieldsValue']), h(NewForm)]);
  }
};