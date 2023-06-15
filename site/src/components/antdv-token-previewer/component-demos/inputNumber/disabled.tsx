import { InputNumber } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = () => <InputNumber min={1} max={10} defaultValue={3} disabled />;
const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
