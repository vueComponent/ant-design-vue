import { defineComponent } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { Upload, message, Button } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';

import type { ComponentDemo } from '../../interface';

const props: UploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: { authorization: 'authorization-text' },
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const Demo = defineComponent({
  setup() {
    return () => (
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive'],
  key: 'upload',
};

export default componentDemo;
