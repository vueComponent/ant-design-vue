import { Cascader } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

import options from './data';

const Demo = () => {
  return (
    <Cascader options={options} placeholder="Please select" searchValue={'jiang'} showSearch />
  );
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorHighlight'],
  key: 'highlight',
};

export default componentDemo;
