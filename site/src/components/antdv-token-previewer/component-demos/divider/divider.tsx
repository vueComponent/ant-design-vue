import { defineComponent } from 'vue';
import { Divider } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <Divider plain>Text</Divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <Divider orientation="left" plain>
          Left Text
        </Divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <Divider orientation="right" plain>
          Right Text
        </Divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
      </>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSplit', 'colorText'],
  key: 'divider',
};

export default componentDemo;
