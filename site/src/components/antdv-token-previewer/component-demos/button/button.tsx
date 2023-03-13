import { defineComponent } from 'vue';
import { Button, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button> <br />
        <Button type="text">Text Button</Button>
        <Button ghost>Ghost Button</Button>
        <Button type="link">Link Button</Button>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorText',
    'colorPrimary',
    'colorPrimaryActive',
    'colorPrimaryHover',
    'controlOutline',
    'controlTmpOutline',
  ],
  key: 'button',
};

export default componentDemo;
