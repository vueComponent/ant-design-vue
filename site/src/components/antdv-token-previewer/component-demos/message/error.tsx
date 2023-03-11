import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = message;

const Demo = defineComponent({
  setup() {
    return () => (
      <_InternalPanelDoNotUseOrYouWillBeFired
        type={'error'}
        content={'这是一条异常消息，会主动消失'}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'error',
};

export default componentDemo;
