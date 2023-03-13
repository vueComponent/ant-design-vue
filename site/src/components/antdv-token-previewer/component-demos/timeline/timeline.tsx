import { defineComponent } from 'vue';
import { Timeline } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Timeline>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
        {/*<Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>*/}
      </Timeline>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorText', 'colorSplit', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
