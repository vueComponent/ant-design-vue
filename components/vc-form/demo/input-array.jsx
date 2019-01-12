/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle } from './styles';

let uuid = 0;

const Form = {
  props: {
    form: Object,
  },
  methods: {
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      let keys = form.getFieldValue('keys');
      keys = keys.filter(key => {
        return key !== k;
      });
      // can use data-binding to set
      form.setFieldsValue({
        keys,
      });
    },
    add() {
      uuid++;
      const { form } = this;
      // can use data-binding to get
      let keys = form.getFieldValue('keys');
      keys = keys.concat(uuid);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys,
      });
    },
    submit(e) {
      e.preventDefault();
      console.log(this.form.getFieldsValue());
    },
  },

  render() {
    const { getFieldProps, getFieldValue } = this.form;
    getFieldProps('keys', {
      initialValue: [],
    });
    const inputs = getFieldValue('keys').map(k => {
      return (
        <div key={k} style={regionStyle}>
          <input {...getFieldProps(`name${k}`)} />
          <a onClick={this.remove.bind(this, k)}>delete</a>
        </div>
      );
    });
    return (
      <div>
        {inputs}
        <div style={regionStyle}>
          <button onClick={this.submit}>submit</button>

          <button onClick={this.add}>add</button>
        </div>
      </div>
    );
  },
};

export default createForm()(Form);
