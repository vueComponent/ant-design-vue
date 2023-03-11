import { defineComponent } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { Dropdown, Typography } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Typography.Text type={'danger'}>
          Hover me <DownOutlined />
        </Typography.Text>
        <Dropdown._InternalPanelDoNotUseOrYouWillBeFired
          menu={{
            items: [
              {
                label: 'item 1',
                key: '1',
              },
              {
                label: 'a danger item',
                danger: true,
                key: '3',
              },
              {
                label: 'danger disabled item',
                danger: true,
                disabled: true,
                key: '2',
              },
            ],
          }}
        />
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorHover', 'colorBgElevated'],
  key: 'default',
};

export default componentDemo;
