import { defineComponent } from 'vue';
import Select from './_internal';

import type { ComponentDemo } from '../../interface';

import options from './data';

const handleChange = (value: any) => {
  console.log(`selected ${value}`);
};

const Demo = defineComponent({
  setup() {
    return () => (
      <Select
        mode="multiple"
        allowClear
        style={{
          width: '100%',
        }}
        status={'warning'}
        options={options}
        placeholder="Please select"
        defaultValue={['a10', 'c12']}
        onChange={handleChange}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarningHover', 'colorWarningOutline'],
  key: 'warning',
};

export default componentDemo;
