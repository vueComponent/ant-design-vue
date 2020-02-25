/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

const Email = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('email');
    return (
      <div style={regionStyle}>
        <div>email validate onBlur && onChange</div>
        <div>
          <input
            {...getFieldProps('email', {
              validate: [
                {
                  trigger: 'blur',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
                {
                  trigger: ['blur', 'input'],
                  rules: [
                    {
                      type: 'email',
                      message: '错误的 email 格式',
                    },
                  ],
                },
              ],
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <div style={errorStyle}>{isFieldValidating('email') ? 'validating' : null}</div>
      </div>
    );
  },
};

const User = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('user');
    return (
      <div style={regionStyle}>
        <div>user validate on submit</div>
        <div>
          <input
            {...getFieldProps('user', {
              rules: [
                {
                  required: true,
                },
                {
                  type: 'string',
                  min: 5,
                },
              ],
              validateTrigger: null,
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <div style={errorStyle}>{isFieldValidating('user') ? 'validating' : null}</div>
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
      this.form.validateFields((error, values) => {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
  },

  render() {
    const { form } = this;
    return (
      <div style={{ margin: '20px' }}>
        <h2>use validateTrigger config</h2>
        <form onSubmit={this.onSubmit}>
          <User form={form} />

          <Email form={form} />

          <div style={regionStyle}>
            <button>submit</button>
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
