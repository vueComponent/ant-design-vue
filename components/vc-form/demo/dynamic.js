/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

const Email = {
  props: {
    form: Object,
    hidden: Boolean,
  },
  render() {
    const { hidden, form } = this;
    const { getFieldProps, getFieldError, isFieldValidating } = form;
    const errors = getFieldError('email');
    const style = {
      ...regionStyle,
      display: hidden ? 'none' : '',
    };
    return (
      <div style={style}>
        <div>
          email:
          <input
            {...getFieldProps('email', {
              rules: [
                {
                  required: true,
                },
                {
                  type: 'email',
                  message: '错误的 email 格式',
                },
              ],
              hidden,
            })}
          />
        </div>

        {errors ? <div style={errorStyle}>{errors.join(',')}</div> : null}

        {isFieldValidating('email') ? <div style={errorStyle}>validating</div> : null}
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
        <div>
          user:
          <input
            {...getFieldProps('user', {
              initialValue: 'x',
              rules: [
                {
                  required: true,
                },
              ],
            })}
          />
        </div>
        {errors ? <div style={errorStyle}>{errors.join(',')}</div> : null}

        {isFieldValidating('user') ? <div style={errorStyle}>validating</div> : null}
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
    const { getFieldProps, getFieldValue } = form;
    return (
      <div style={{ margin: 20 }}>
        <h2>overview</h2>
        <form onSubmit={this.onSubmit}>
          <div style={regionStyle}>
            <div>
              <label>
                remove/add user:
                <input
                  type="checkbox"
                  {...getFieldProps('remove_user', {
                    // initialValue:true,
                    valuePropName: 'checked',
                  })}
                />
              </label>
            </div>
          </div>

          {getFieldValue('remove_user') ? null : <User form={form} />}

          <div style={regionStyle}>
            <div>
              <label>
                hide/show email:
                <input
                  type="checkbox"
                  {...getFieldProps('hide_email', {
                    // initialValue:true,
                    valuePropName: 'checked',
                  })}
                />
              </label>
            </div>
          </div>

          <Email form={form} hidden={!!getFieldValue('hide_email')} />

          <div style={regionStyle}>
            <button>submit</button>
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
