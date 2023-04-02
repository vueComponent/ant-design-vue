import { defineComponent } from 'vue';
import { Steps } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const { Step } = Steps;

const Demo = defineComponent({
  setup() {
    return () => (
      <Steps current={1}>
        <Step title="Error" status={'error'} description="This is a description." />
        <Step
          status={'error'}
          title="In Progress"
          subTitle="Left 00:00:08"
          description="This is a description."
        />
      </Steps>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'danger',
};

export default componentDemo;
