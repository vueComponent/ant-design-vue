import { defineComponent } from 'vue';
import { Radio, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        <Radio.Group value={'a'} buttonStyle="solid">
          <Radio.Button value={'a'} checked>
            Hangzhou
          </Radio.Button>
          <Radio.Button value={'b'}>Shanghai</Radio.Button>
        </Radio.Group>

        <div>
          <Radio.Button>Apple</Radio.Button>
          <Radio.Button checked>Orange</Radio.Button>
        </div>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimaryActive', 'colorPrimaryHover'],
  key: 'button',
};

export default componentDemo;
