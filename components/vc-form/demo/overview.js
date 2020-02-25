/* eslint no-console:0 */

import createDOMForm from '../src/createDOMForm';
import { DatePicker, Select } from 'ant-design-vue';
import { regionStyle, errorStyle } from './styles';
const { Option } = Select;

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
              rules: [{ type: 'email', message: <b key="err">错误的 email 格式</b> }],
            })}
          />
        </div>
        <div style={errorStyle}>{errors}</div>
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
        <div>
          <span
            style={{
              color: 'red',
            }}
          >
            *
          </span>
          user async validate
        </div>
        <div>
          <input
            {...getFieldProps('user', {
              initialValue: '',
              validateFirst: true,
              rules: [{ required: true }, { validator: this.userExists }],
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <div style={errorStyle}>{isFieldValidating('user') ? 'validating' : null}</div>
      </div>
    );
  },
};

const CustomInput = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('select');
    return (
      <div style={regionStyle}>
        <div>
          <span
            style={{
              color: 'red',
            }}
          >
            *
          </span>
          custom select sync validate
        </div>
        <div>
          <Select
            placeholder="please select"
            style={{
              width: '200px',
            }}
            {...getFieldProps('select', { rules: [{ required: true }] })}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <div style={errorStyle}>{isFieldValidating('select') ? 'validating' : null}</div>
      </div>
    );
  },
};

const DateInput = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps, getFieldError } = this.form;
    const errors = getFieldError('date');
    return (
      <div style={regionStyle}>
        <div>
          <span
            style={{
              color: 'red',
            }}
          >
            *
          </span>
          DateInput sync validate
        </div>
        <div
          style={{
            width: '200px',
          }}
        >
          <DatePicker
            placeholder="please select"
            {...getFieldProps('date', { rules: [{ required: true, type: 'object' }] })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
      </div>
    );
  },
};

function toNumber(v) {
  if (v === undefined) {
    return v;
  }
  if (v === '') {
    return undefined;
  }
  if (v && v.trim() === '') {
    return NaN;
  }
  return Number(v);
}

const NumberInput = {
  props: {
    form: Object,
  },
  render() {
    const { getFieldProps, getFieldError } = this.form;
    const errors = getFieldError('number');
    return (
      <div style={regionStyle}>
        <div>number input</div>
        <div>
          <input
            {...getFieldProps('number', {
              initialValue: '1',
              rules: [{ transform: toNumber, type: 'number' }],
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
      </div>
    );
  },
};

const Form = {
  methods: {
    onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFieldsAndScroll(
        {
          scroll: {
            offsetTop: 20,
          },
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
    const { getFieldProps, getFieldError } = form;
    return (
      <div
        style={{
          margin: '20px',
        }}
      >
        <h2>overview</h2>
        <form onSubmit={this.onSubmit}>
          <User form={form} saveRef={this.saveRef} />

          <NumberInput form={form} />

          <Email form={form} />

          <CustomInput form={form} />

          <DateInput form={form} />

          <div style={regionStyle}>
            <div>normal required input</div>
            <div>
              <input
                {...getFieldProps('normal', { initialValue: '', rules: [{ required: true }] })}
              />
            </div>
            <div style={errorStyle}>
              {getFieldError('normal') ? getFieldError('normal').join(',') : null}
            </div>
          </div>

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

export default createDOMForm({
  validateMessages: {
    required(field) {
      return `${field} 必填`;
    },
  },
})(Form);
