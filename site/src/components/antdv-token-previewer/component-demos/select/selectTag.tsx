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
        mode="multiple"
        allowClear
        style={{
          width: '100%',
        }}
        options={options}
        listHeight={200}
        placeholder="Please select"
        value={['a10', 'c12', 'e14']}
        getPopupContainer={node => {
          if (node) {
            return node.parentNode as HTMLElement;
          }
          return document.body;
        }}
        onChange={handleChange}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorFillSecondary'],
  key: 'selectTag',
};

export default componentDemo;
