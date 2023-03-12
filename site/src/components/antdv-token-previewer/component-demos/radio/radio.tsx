import { Radio } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Radio checked>Radio</Radio>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'controlOutline', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
