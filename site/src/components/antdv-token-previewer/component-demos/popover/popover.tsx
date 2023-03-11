import { defineComponent } from 'vue';
import { Popover, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const content = (
  <div>
    <p>Content</p> <p>Content</p>
  </div>
);
const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Popover._InternalPanelDoNotUseOrYouWillBeFired content={content} title="Title" />
        <Button type="primary">Hover me</Button>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgElevated'],
  key: 'default',
};

export default componentDemo;
