import { defineComponent } from 'vue';
import { Timeline } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Timeline>
        <Timeline.Item color={'green'}>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color={'green'}>Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item color={'green'}>Technical testing 2015-09-01</Timeline.Item>
        <Timeline.Item color={'green'}>Network problems being solved 2015-09-01</Timeline.Item>
      </Timeline>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'success',
};

export default componentDemo;
