import { Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Input placeholder="Basic usage" />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'controlOutline', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
