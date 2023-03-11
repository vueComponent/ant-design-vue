import { defineComponent } from 'vue';
import { Cascader } from 'ant-design-vue';

import options from './data';
import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalCascader } = Cascader;

const Demo = defineComponent({
  setup() {
    return () => <InternalCascader options={options} open disabled placeholder="Please select" />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
