import { defineComponent } from 'vue';
import { Steps } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const { Step } = Steps;

const Demo = defineComponent({
  setup() {
    return () => (
      <Steps current={1}>
        <Step title="Finished" description="This is a description." />
        <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
        <Step title="Waiting" description="This is a description." />
      </Steps>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
