import { createForm } from '../index';
const Form = {
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      const { validateFields } = this.form;
      validateFields()
        .then(console.log)
        .catch(console.error);
    },
  },

  render() {
    const { getFieldDecorator } = this.form;
    return (
      <form onSubmit={this.handleSubmit}>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
            },
          ],
        })(<input />)}
        <button type="submit">submit</button>
      </form>
    );
  },
};

export default createForm()(Form);
