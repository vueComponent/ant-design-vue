import { defineComponent } from 'vue';
import { Pagination } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => <Pagination showQuickJumper defaultCurrent={2} total={10} disabled />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['controlItemBgActiveDisabled', 'colorBgContainerDisabled', 'colorFillAlter'],
  key: 'disabled',
};

export default componentDemo;
