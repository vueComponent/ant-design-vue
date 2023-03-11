import { DatePicker } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <DatePicker status={'error'} />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorBorder', 'colorErrorHover', 'colorErrorOutline'],
  key: 'danger',
};

export default componentDemo;
