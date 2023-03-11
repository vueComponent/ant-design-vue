import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = message;

const Demo = defineComponent({
  setup() {
    return () => (
      <_InternalPanelDoNotUseOrYouWillBeFired type={'info'} content={`Hello, Ant Design!`} />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'colorBgElevated'],
  key: 'message',
};

export default componentDemo;
