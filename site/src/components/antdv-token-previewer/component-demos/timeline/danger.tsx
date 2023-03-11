import { defineComponent } from 'vue';
import { Timeline } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Timeline>
        <Timeline.Item color={'red'}>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item color={'red'}>Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item color={'red'}>Technical testing 2015-09-01</Timeline.Item>
        <Timeline.Item color={'red'}>Network problems being solved 2015-09-01</Timeline.Item>
      </Timeline>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'danger',
};

export default componentDemo;
