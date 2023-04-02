import { defineComponent } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { Button, Popconfirm, Space, Upload } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        Space
        <Button type="primary">Button</Button>
        <Upload>
          <Button>
            <UploadOutlined /> Click to Upload
          </Button>
        </Upload>
        <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
          <Button>Confirm</Button>
        </Popconfirm>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  key: 'default',
};

export default componentDemo;
