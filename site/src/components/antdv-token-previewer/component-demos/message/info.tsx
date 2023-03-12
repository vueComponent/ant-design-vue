import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = message;

const Demo = defineComponent({
  setup() {
    return () => <_InternalPanelDoNotUseOrYouWillBeFired type={'info'} content={'Info'} />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo'],
  key: 'info',
};

export default componentDemo;
