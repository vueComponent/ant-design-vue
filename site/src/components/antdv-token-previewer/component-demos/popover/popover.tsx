import { defineComponent } from 'vue';
import { Popover, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const content = () => (
      <div>
        <p>Content</p> <p>Content</p>
      </div>
    );

    return () => {
      return (
        <div>
          <Popover v-slots={{ content }} title="Title">
            <Button type="primary">Hover me</Button>
          </Popover>
        </div>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgElevated'],
  key: 'default',
};

export default componentDemo;
