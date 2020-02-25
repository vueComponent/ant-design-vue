/* eslint no-console:0 */

import { createForm } from '../index';
import { regionStyle, errorStyle } from './styles';

function getFileValueProps(value) {
  if (value && value.target) {
    return {
      value: value.target.value,
    };
  }
  return {
    value,
  };
}

function getValueFromFileEvent({ target }) {
  return {
    target,
  };
}

const Form = {
  props: {
    form: Object,
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log(error, values);
        if (!error) {
          console.log('校验通过');
        }
      });
    },
    checkSize(rule, value, callback) {
      if (value && value.target) {
        const files = value.target.files;
        if (files[0]) {
          callback(files[0].size > 1000000 ? 'file size must be less than 1M' : undefined);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
  },

  render() {
    const { getFieldProps, getFieldError } = this.form;
    const errors = getFieldError('attachment');
    return (
      <div style={regionStyle}>
        <div>attachment:</div>
        <div>
          <input
            type="file"
            {...getFieldProps('attachment', {
              getValueProps: getFileValueProps,
              getValueFromEvent: getValueFromFileEvent,
              rules: [this.checkSize],
            })}
          />
        </div>
        <div style={errorStyle}>{errors ? errors.join(',') : null}</div>
        <button onClick={this.onSubmit}>submit</button>
      </div>
    );
  },
};

const NewForm = createForm()(Form);

export default {
  render() {
    return (
      <div>
        <h2>input[type="file"]</h2>
        <NewForm />
      </div>
    );
  },
};
