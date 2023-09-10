import { defineComponent } from 'vue';
import { Select } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

import options from './data';

const handleChange = (value: any) => {
  // eslint-disable-next-line no-console
  console.log(`selected ${value}`);
};

const Demo = defineComponent({
  setup() {
    return () => (
      <Select
        allowClear
        style={{
          width: '100%',
        }}
        options={options}
        placeholder="Please select"
        value={['a10', 'c12']}
        onChange={handleChange}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorIcon', 'colorIconHover'],
  key: 'icon',
};

export default componentDemo;
