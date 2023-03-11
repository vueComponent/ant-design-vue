import { Checkbox, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = (props: any) => (
  <Space>
    <Checkbox {...props}>Checkbox</Checkbox>
    <Checkbox {...props} checked>
      选中态
    </Checkbox>
  </Space>
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorText', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
