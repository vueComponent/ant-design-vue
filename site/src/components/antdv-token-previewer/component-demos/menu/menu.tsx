import { defineComponent, ref } from 'vue';
import type { MenuProps } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';

import items from './data';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => {
      const onClick: MenuProps['onClick'] = e => {
        console.log('click ', e);
      };

      const selectedKeys = ref(['1']);
      const openKeys = ref(['sub1', 'sub2']);

      return (
        <div>
          <Menu
            onClick={onClick}
            style={{ width: '256px' }}
            selectedKeys={selectedKeys.value}
            openKeys={openKeys.value}
            onSelect={val => (selectedKeys.value = val as any)}
            onOpenChange={val => (openKeys.value = val as any)}
            // v-model={[selectedKeys.value, 'selectedKeys']}
            // v-model={[openKeys.value, 'openKeys']}
            mode="inline"
            items={items}
          />
        </div>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorBgContainer', 'colorFillAlter', 'colorSplit', 'colorPrimaryHover'],
  key: 'default',
};

export default componentDemo;
