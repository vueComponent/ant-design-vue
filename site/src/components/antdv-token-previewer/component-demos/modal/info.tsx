import { Modal } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = Modal;
const Demo = () => {
  return (
    <>
      <_InternalPanelDoNotUseOrYouWillBeFired title="Basic Modal">
        <p>Some contents...</p> <p>Some contents...</p> <p>Some contents...</p>
      </_InternalPanelDoNotUseOrYouWillBeFired>
    </>
  );
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo'],
  key: 'info',
};
export default componentDemo;
