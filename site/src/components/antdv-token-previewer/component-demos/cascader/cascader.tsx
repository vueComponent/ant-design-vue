import { Cascader } from 'ant-design-vue';

import options from './data';
import type { ComponentDemo } from '../../interface';

const Demo = (props: any) => <Cascader options={options} {...props} placeholder="Please select" />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainer', 'colorPrimary'],
  key: 'default',
};

export default componentDemo;
