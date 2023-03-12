import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = message;

const Demo = defineComponent({
  setup() {
    return () => (
      <_InternalPanelDoNotUseOrYouWillBeFired
        type={'success'}
        content={'这是一条成功消息，会主动消失'}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'success',
};

export default componentDemo;
