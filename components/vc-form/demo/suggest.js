/* eslint no-console:0 */

import { createForm } from '../index';
import { Select } from 'ant-design-vue';
import { regionStyle, errorStyle } from './styles';
import { mergeProps } from '../../_util/props-util';
const emailTpl = ['@gmail.com', '@outlook.com', '@qq.com'];
const { Option } = Select;
const CustomInput = {
  props: {
    form: Object,
  },
  data() {
    return { data: [] };
  },
  methods: {
    onChange(v) {
      if (v.indexOf('@') === -1) {
        this.data = emailTpl.map(m => v + m);
      } else if (this.data.length) {
        this.data = [];
      }
    },
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.form;
    const errors = getFieldError('select');
    return (
      <div style={regionStyle}>
        <div>custom select sync validate</div>
        <div>
          <Select
            {...mergeProps(
              {
                props: { placeholder: 'please select', mode: 'combobox', filterOption: false },
                style: { width: '200px' },
              },
              getFieldProps('select', {
                change: this.onChange,
                rules: [{ type: 'email' }, { required: true }],
              }),
            )}
          >
            {this.data.map(d => {
              return (
                <Option key={d} value={d}>
                  {d}
                </Option>
              );
            })}
          </Select>
        </div>
        <div style={errorStyle}>
          {errors ? (
            errors.join(',')
          ) : (
            <b
              style={{
                visibility: 'hidden',
              }}
            >
              1
            </b>
          )}
        </div>
        <div style={errorStyle}>
          {isFieldValidating('select') ? (
            'validating'
          ) : (
            <b
              style={{
                visibility: 'hidden',
              }}
            >
              1
            </b>
          )}
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
      <div
        style={{
          margin: '20px',
        }}
      >
        <h2>suggest</h2>
        <form onSubmit={this.onSubmit}>
          <CustomInput form={form} />

          <div style={regionStyle}>
            <button>submit</button>
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
