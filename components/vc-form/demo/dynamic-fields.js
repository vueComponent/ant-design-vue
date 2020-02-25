/* eslint no-console:0 */

import { createForm } from '../index';
import BaseMixin from '../../_util/BaseMixin';

const Form1 = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },
  data() {
    return {
      useInput: true,
    };
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
    changeUseInput(e) {
      this.setState({
        useInput: e.target.checked,
      });
    },
  },

  render() {
    const { getFieldError, getFieldDecorator } = this.form;

    return (
      <form onSubmit={this.onSubmit}>
        <h2>situation 1</h2>
        {this.useInput
          ? getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: "What's your name 1?",
                },
              ],
            })(<input />)
          : null}
        <span>text content</span>
        {this.useInput
          ? null
          : getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: "What's your name 2?",
                },
              ],
            })(<input />)}
        <div>
          <label>
            <input type="checkbox" checked={this.useInput} onInput={this.changeUseInput} />
            change input
          </label>
          {(getFieldError('name') || []).join(', ')}
        </div>
        <button>Submit</button>
      </form>
    );
  },
};

const Form2 = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },
  data() {
    return {
      useInput: true,
    };
  },
  beforeMount() {
    const { getFieldDecorator } = this.form;
    this.nameDecorator = getFieldDecorator('name', {
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
    changeUseInput(e) {
      this.setState({
        useInput: e.target.checked,
      });
    },
  },

  render() {
    const { getFieldError } = this.form;
    return (
      <form onSubmit={this.onSubmit}>
        <h2>situation 2</h2>
        {this.useInput ? this.nameDecorator(<input />) : null}
        <span>text content</span>
        {this.useInput ? null : this.nameDecorator(<input />)}
        <div>
          <label>
            <input type="checkbox" checked={this.useInput} onInput={this.changeUseInput} />
            change input
          </label>
          {(getFieldError('name') || []).join(', ')}
        </div>
        <button>Submit</button>
      </form>
    );
  },
};

const Form3 = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },
  data() {
    return {
      useInput: false,
    };
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
    changeUseInput(e) {
      this.setState({
        useInput: e.target.checked,
      });
    },
  },

  render() {
    const { getFieldError, getFieldDecorator } = this.form;
    return (
      <form onSubmit={this.onSubmit}>
        <h2>situation 3</h2>
        {getFieldDecorator('name', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: "What's your name 1?",
            },
          ],
        })(<input />)}
        {this.useInput
          ? null
          : getFieldDecorator('name2', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: "What's your name 2?",
                },
              ],
            })(<input />)}
        <div>
          <label>
            <input type="checkbox" checked={this.useInput} onInput={this.changeUseInput} />
            Hide second input
          </label>
          {(getFieldError('name') || []).join(', ')}
        </div>
        <button>Submit</button>
      </form>
    );
  },
};

const Form4 = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },
  data() {
    return {
      useInput: true,
    };
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
    changeUseInput(e) {
      this.setState({
        useInput: e.target.checked,
      });
    },
  },

  render() {
    const { getFieldError, getFieldDecorator } = this.form;
    return (
      <form onSubmit={this.onSubmit}>
        <h2>situation 4</h2>
        {this.useInput
          ? getFieldDecorator('name', {
              initialValue: '',
              trigger: 'input',
              rules: [
                {
                  required: true,
                  message: "What's your name 1?",
                },
              ],
            })(<input />)
          : getFieldDecorator('name2', {
              initialValue: '',
              trigger: 'input',
              rules: [
                {
                  required: true,
                  message: "What's your name 2?",
                },
              ],
            })(<input />)}
        <div>
          <label>
            <input type="checkbox" checked={this.useInput} onInput={this.changeUseInput} />
            toggle decorator name
          </label>
          {(getFieldError('name') || []).join(', ')}
          {(getFieldError('name2') || []).join(', ')}
        </div>
        <button>Submit</button>
      </form>
    );
  },
};

const WrappedForm1 = createForm()(Form1);
const WrappedForm2 = createForm()(Form2);
const WrappedForm3 = createForm()(Form3);
const WrappedForm4 = createForm()(Form4);

export default {
  render() {
    return (
      <div>
        <WrappedForm1 />
        <WrappedForm2 />
        <WrappedForm3 />
        <WrappedForm4 />
      </div>
    );
  },
};
