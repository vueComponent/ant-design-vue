/* eslint no-console:0 */

import BaseMixin from '../../_util/BaseMixin';
import createDOMForm from '../src/createDOMForm';
import { Modal } from 'ant-design-vue';
import { regionStyle, errorStyle } from './styles';

const Form = {
  mixins: [BaseMixin],
  props: {
    form: Object,
  },

  data() {
    return { visible: false };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },

    onCancel() {
      this.setState({ visible: false });
    },

    open() {
      this.setState({ visible: true });
    },
  },

  render() {
    const { getFieldProps, getFieldError } = this.form;
    return (
      <div
        style={{
          margin: '20px',
        }}
      >
        <h2>modal</h2>
        <Modal
          visible={this.visible}
          bodyStyle={{
            height: '200px',
            overflow: 'auto',
          }}
          onCancel={this.onCancel}
          title="modal"
        >
          <div ref="dialogContent">
            <form onSubmit={this.onSubmit}>
              <input
                {...getFieldProps('required', { rules: [{ required: true, message: '必填' }] })}
              />
              <div style={errorStyle}>
                {getFieldError('required') ? (
                  getFieldError('required').join(',')
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
              <div
                style={{
                  marginTop: '300px',
                }}
              >
                <button>submit</button>
              </div>
            </form>
          </div>
        </Modal>
        <div style={regionStyle}>
          <button onClick={this.open}>open</button>
        </div>
      </div>
    );
  },
};
export default createDOMForm()(Form);
