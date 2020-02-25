/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';
import BaseMixin from '../../_util/BaseMixin';

const Email = {
  props: {
    form: Object,
  },
  methods: {
    checkSpecial(rule, value, callback) {
      setTimeout(() => {
        if (value === 'yiminghe@gmail.com') {
          callback('can not be!');
        } else {
          callback();
        }
      }, 1000);
    },
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('email');
    return (
      <div style={regionStyle}>
        <div>email validate onBlur</div>
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
                this.checkSpecial,
              ],
              validateTrigger: 'blur',
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <div style={errorStyle}>{isFieldValidating('email') ? 'validating' : null}</div>
      </div>
    );
  },
};

const Form = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },
  data() {
    return {
      loading: true,
    };
  },

  mounted() {
    setTimeout(() => {
      this.setState(
        {
          loading: false,
        },
        () => {
          setTimeout(() => {
            this.form.setFieldsInitialValue({
              email: 'xx@gmail.com',
            });
          }, 1000);
        },
      );
    }, 1000);
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.submit(callback => {
        setTimeout(() => {
          this.form.validateFields((error, values) => {
            if (!error) {
              console.log('ok', values);
            } else {
              console.log('error', error, values);
            }
            callback();
          });
        }, 1000);
      });
    },

    reset(e) {
      e.preventDefault();
      this.form.resetFields();
    },
  },

  render() {
    if (this.loading) {
      return <b>loading</b>;
    }
    const { form } = this;
    const disabled = form.isFieldsValidating() || form.isSubmitting();
    return (
      <div style={{ margin: 20 }}>
        <h2>async init field</h2>
        <form onSubmit={this.onSubmit}>
          <Email form={form} />

          <div style={regionStyle}>
            <button disabled={disabled} type="submit">
              submit
            </button>
            &nbsp;{disabled ? <span style={{ color: 'red' }}>disabled</span> : null}&nbsp;
            <button disabled={disabled} onClick={this.reset}>
              reset
            </button>
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
