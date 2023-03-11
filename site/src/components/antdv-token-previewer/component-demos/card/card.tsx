import { defineComponent } from 'vue';
import { Card, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        <Card
          title="Default size card"
          style={{ width: '300px' }}
          v-slots={{
            extra: () => <a href="#">More</a>,
          }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card
          loading
          size="small"
          title="Small size card"
          style={{ width: '300px' }}
          v-slots={{
            extra: () => <a href="#">More</a>,
          }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorText',
    'colorTextHeading',
    'colorTextSecondary',
    'colorBgContainer',
    'colorBorderSecondary',
    'colorPrimary',
    'colorBgContainer',
  ],
  key: 'card',
};

export default componentDemo;
