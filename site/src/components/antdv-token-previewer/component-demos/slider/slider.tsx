import { defineComponent } from 'vue';
import { Slider } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <>
        <Slider defaultValue={30} />
        <Slider range defaultValue={[20, 50]} />
      </>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorFillSecondary',
    'colorFillContentHover',
    'colorBgContainer',
    'colorPrimary',
    'colorPrimaryHover',
    'colorPrimaryBorderHover',
    'colorPrimaryBorder',
  ],
  key: 'default',
};

export default componentDemo;
