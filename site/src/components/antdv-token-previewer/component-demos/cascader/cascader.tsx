import { Cascader } from 'ant-design-vue';

import options from './data';
import type { ComponentDemo } from '../../interface';
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalCascader } = Cascader;

const Demo = (props: any) => (
  <InternalCascader options={options} {...props} open placeholder="Please select" />
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainer', 'colorPrimary'],
  key: 'default',
};

export default componentDemo;
