import { defineComponent } from 'vue';
import { notification } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = notification;

const Demo = defineComponent({
  setup() {
    return () => (
      <_InternalPanelDoNotUseOrYouWillBeFired
        message={'Notification Title'}
        type={'error'}
        description={
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
        }
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
