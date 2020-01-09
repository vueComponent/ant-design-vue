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
        <div>email sync validate</div>
        <div>
          <input
            {...getFieldProps('email', {
              initialValue: '',
              validateFirst: true,
              rules: [
                {
                  required: true,
                },
                {
                  type: 'email',
                  message: '错误的 email 格式',
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
  methods: {
    userExists(rule, value, callback) {
      setTimeout(() => {
        if (value === '1') {
          callback([new Error('are you kidding?')]);
        } else if (value === 'yiminghe') {
          callback([new Error('forbid yiminghe')]);
        } else {
          callback();
        }
      }, 300);
    },
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('user');
    return (
      <div style={regionStyle}>
        <div>user async validate</div>
        <div>
          <input
            {...getFieldProps('user', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  min: 2,
                },
                {
                  validator: this.userExists,
                },
              ],
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
  methods: {
    onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFields(
        {
          // firstFields: false,
        },
        (error, values) => {
          if (!error) {
            console.log('ok', values);
          } else {
            console.log('error', error, values);
          }
        },
      );
    },

    reset(e) {
      e.preventDefault();
      this.form.resetFields();
    },
  },

  render() {
    const { form } = this;
    return (
      <div style={{ margin: '20px' }}>
        <h2>validateFirst</h2>
        <form onSubmit={this.onSubmit}>
          <User form={form} />

          <Email form={form} />

          <div style={regionStyle}>
            <button onClick={this.reset}>reset</button>
            &nbsp;
            <input type="submit" value="submit" />
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
