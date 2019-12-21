/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle } from './styles';
import { Switch } from 'ant-design-vue';

const TopForm = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps } = this.form;
    return (
      <div style={regionStyle}>
        <div>has email?</div>
        <div>
          <Switch {...getFieldProps('on', { initialValue: true, valuePropName: 'checked' })} />
        </div>
      </div>
    );
  },
};

const BottomForm = {
  props: {
    form: Object,
    on: Boolean,
  },
  render() {
    const { form } = this;
    const on = form.getFieldValue('on');
    const style = {
      ...regionStyle,
      display: on ? 'block' : 'none',
    };
    return (
      <div style={style}>
        <div>email:</div>
        <div>
          <input {...form.getFieldProps('email', { rules: [{ type: 'email' }], hidden: !on })} />
        </div>
      </div>
    );
  },
};

const Form = {
  props: {
    form: Object,
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log(this.form.getFieldsValue());
    },
  },

  render() {
    const { form } = this;
    return (
      <div>
        <TopForm form={form} />
        <BottomForm form={form} />
        <div style={regionStyle}>
          <button onClick={this.onSubmit}>submit</button>
        </div>
      </div>
    );
  },
};

const NewForm = createForm()(Form);

export default {
  render() {
    return (
      <div>
        <h2>parallel form</h2>
        <NewForm />
      </div>
    );
  },
};
