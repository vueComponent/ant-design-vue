/* eslint no-console:0 */

import { DatePicker } from 'ant-design-vue';
import createDOMForm from '../src/createDOMForm';
import { regionStyle, errorStyle } from './styles';

const Form = {
  props: {
    form: Object,
  },
  methods: {
    onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },

    reset(e) {
      e.preventDefault();
      this.form.resetFields();
    },

    checkStart(rule, value, callback) {
      const { validateFields } = this.form;
      validateFields(['end'], { force: true });
      callback();
    },

    checkEnd(rule, value, callback) {
      const end = value;
      const { getFieldValue } = this.form;
      const start = getFieldValue('start');
      if (!end || !start) {
        callback('please select both start and end time');
      } else if (end.valueOf() < start.valueOf()) {
        callback('start time should be less than end time');
      } else {
        callback();
      }
    },
  },

  render() {
    const { form } = this;
    const { getFieldProps, getFieldError } = form;
    return (
      <div
        style={{
          margin: 20,
        }}
      >
        <h2>startTime and endTime validation</h2>
        <form onSubmit={this.onSubmit}>
          <div style={regionStyle}>
            <div>start:</div>
            <div>
              <DatePicker {...getFieldProps('start', { rules: [this.checkStart] })} />
            </div>
          </div>

          <div style={regionStyle}>
            <div>end:</div>
            <div>
              <DatePicker {...getFieldProps('end', { rules: [this.checkEnd] })} />
            </div>
          </div>

          <div style={errorStyle}>{getFieldError('end') ? getFieldError('end').join(',') : ''}</div>

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

export default createDOMForm()(Form);
