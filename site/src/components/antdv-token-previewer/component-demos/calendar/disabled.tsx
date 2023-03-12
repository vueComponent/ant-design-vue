import { Calendar } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Calendar disabledDate={() => true} />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled', 'colorTextDisabled'],
  key: 'disabled',
};

export default componentDemo;
