import { defineComponent } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { Upload } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Upload
          name="avatar"
          listType="picture-card"
          class="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillAlter'],
  key: 'avatar',
};

export default componentDemo;
