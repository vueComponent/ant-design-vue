/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

const CustomInput = {
  props: {
    form: Object,
  },
  data() {
    return {
      data: [],
    };
  },
  methods: {
    checkUpper(rule, value = '', callback) {
      if (value !== value.toUpperCase()) {
        callback(new Error('need to be upper!'));
      } else {
        callback();
      }
    },
    toUpper(v, prev) {
      if (v === prev) {
        return v;
      }
      return v.toUpperCase();
    },
  },

  render() {
    const { getFieldProps, getFieldError } = this.form;
    const errors = getFieldError('upper');
    return (
      <div style={regionStyle}>
        <div>upper normalize</div>
        <div>
          <input
            {...getFieldProps('upper', {
              normalize: this.toUpper,
              rules: [
                {
                  validator: this.checkUpper,
                },
              ],
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
      </div>
    );
  },
};

const MaxMin = {
  props: {
    form: Object,
  },
  methods: {
    normalizeMin(value, prevValue, allValues) {
      console.log('normalizeMin', allValues.min, allValues.max);
      const previousAllValues = this.form.getFieldsValue();
      if (allValues.max !== previousAllValues.max) {
        // max changed
        if (value === '' || Number(allValues.max) < Number(value)) {
          return allValues.max;
        }
      }
      return value;
    },
    normalizeMax(value, prevValue, allValues) {
      console.log('normalizeMax', allValues.min, allValues.max);
      const previousAllValues = this.form.getFieldsValue();
      if (allValues.min !== previousAllValues.min) {
        // min changed
        if (value === '' || Number(allValues.min) > Number(value)) {
          return allValues.min;
        }
      }
      return value;
    },
  },

  render() {
    const { getFieldProps } = this.form;
    return (
      <div style={regionStyle}>
        <div>
          min:{' '}
          <select
            {...getFieldProps('min', {
              normalize: this.normalizeMin,
              initialValue: '',
            })}
          >
            <option value="">empty</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          max:{' '}
          <select
            {...getFieldProps('max', {
              initialValue: '',
              normalize: this.normalizeMax,
            })}
          >
            <option value="">empty</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    );
  },
};

const Form = {
  // props: {
  //   form: Object,
  // },
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
        <h2>normalize</h2>
        <form onSubmit={this.onSubmit}>
          <CustomInput form={form} />

          <MaxMin form={form} />

          <div style={regionStyle}>
            <button>submit</button>
          </div>
        </form>
      </div>
    );
  },
};

export default createForm()(Form);
