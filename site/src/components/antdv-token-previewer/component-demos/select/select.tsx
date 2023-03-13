import { defineComponent } from 'vue';
import { Select, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { Option } = Select;

function handleChange() {}
const Demo = defineComponent({
  setup() {
    return () => (
      <Space align={'start'}>
        <Select value="lucy" style={{ width: '120px' }} onChange={handleChange}>
          <Option value="jack">Jack</Option> <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>
            Disabled
          </Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
        <Select value="lucy" style={{ width: '120px' }} disabled>
          <Option value="lucy">Lucy</Option>
        </Select>
        <Select value="lucy" style={{ width: '120px' }} loading>
          <Option value="lucy">Lucy</Option>
        </Select>
        <Select value="lucy" style={{ width: '120px' }} allowClear>
          <Option value="lucy">Lucy</Option>
        </Select>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'controlOutline',
    'colorPrimary',
    'colorPrimaryHover',
    'colorText',
    'colorBgElevated',
    'colorBgContainer',
  ],
  key: 'select',
};

export default componentDemo;
