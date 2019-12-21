/* eslint no-console:0 */

import { createForm } from '../index';

const Form = {
  props: {
    form: Object,
  },

  beforeMount() {
    this.nameDecorator = this.form.getFieldDecorator('name', {
      initialValue: '',
      rules: [
        {
          required: true,
          message: "What's your name?",
        },
      ],
    });
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },

    onChange(e) {
      console.log(e.target.value);
    },
  },

  render() {
    const { getFieldError } = this.form;

    return (
      <form onSubmit={this.onSubmit}>
        {this.nameDecorator(<input onInput={this.onChange} />)}
        <div style={{ color: 'red' }}>{(getFieldError('name') || []).join(', ')}</div>
        <button>Submit</button>
      </form>
    );
  },
};

export default createForm()(Form);
