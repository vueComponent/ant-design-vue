import '../assets/index.less';
import TreeSelect from '../index';
import Select from '../../vc-select';
import { createForm } from '../../vc-form';
import { regionStyle, errorStyle } from './styles';
import { gData } from './util';
import '../../vc-select/assets/index.less';
import './demo.less';

const { Option } = Select;

const TreeSelectInput = {
  props: ['multiple', 'treeData', 'treeCheckable', 'value'],
  methods: {
    onChange(value) {
      console.log(value, arguments);
      this.$emit('change', value);
    },
  },

  render() {
    return <TreeSelect {...{ props: this.$props }} onChange={this.onChange} />;
  },
};

const Form = {
  methods: {
    onSubmit(e) {
      console.log('submit');
      e.preventDefault();
      this.form.validateFields((error, values) => {
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
  },

  render() {
    const { form } = this;
    const { getFieldDecorator, getFieldError } = form;
    const tProps = {
      props: {
        multiple: true,
        treeData: gData,
        treeCheckable: true,
        __propsSymbol__: Symbol(),
        // treeDefaultExpandAll: true,
      },
    };
    return (
      <div style={{ margin: '20px' }}>
        <h2>validity</h2>
        <form onSubmit={this.onSubmit}>
          <div style={regionStyle}>
            <div>
              <p style={{ color: 'blue' }}>no onChange</p>
              {getFieldDecorator('tree-select', {
                initialValue: ['0-0-0-value'],
                rules: [{ required: true, type: 'array', message: 'tree-select 需要必填' }],
              })(<TreeSelect {...tProps} style={{ width: '300px' }} />)}
            </div>
            <p style={errorStyle}>
              {getFieldError('tree-select') ? getFieldError('tree-select').join(',') : null}
            </p>
          </div>

          <div style={regionStyle}>
            <div>
              <p style={{ color: 'blue' }}>custom onChange</p>
              {getFieldDecorator('tree-select1', {
                initialValue: ['0-0-0-value'],
                rules: [{ required: true, type: 'array', message: 'tree-select1 需要必填' }],
              })(
                <TreeSelectInput
                  {...tProps}
                  style={{ width: '300px' }}
                  // treeData={gData}
                />,
              )}
            </div>
            <p style={errorStyle}>
              {getFieldError('tree-select1') ? getFieldError('tree-select1').join(',') : null}
            </p>
          </div>

          <div style={regionStyle}>
            {getFieldDecorator('select', {
              initialValue: ['jack'],
              rules: [{ required: true, type: 'array', message: 'select 需要必填' }],
            })(
              <Select style={{ width: '200px' }} allowClear multiple>
                <Option value="jack">jack</Option>
                <Option value="lucy">lucy</Option>
                <Option value="disabled" disabled>
                  disabled
                </Option>
                <Option value="yiminghe">yiminghe</Option>
              </Select>,
            )}
            <p style={errorStyle}>
              {getFieldError('select') ? getFieldError('select').join(',') : null}
            </p>
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

export default createForm()(Form);
