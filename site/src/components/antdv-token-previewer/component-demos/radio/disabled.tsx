import { Radio } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Radio disabled>Radio</Radio>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
