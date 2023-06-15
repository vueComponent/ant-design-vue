import { defineComponent } from 'vue';
import { Slider, theme } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const { token } = theme.useToken();

    return () => {
      return (
        <div style={{ padding: '12px', background: token.value.colorFillSecondary }}>
          <Slider defaultValue={30} />
          <Slider range defaultValue={[20, 50]} />
        </div>
      );
    };
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
  key: 'sliderInBg',
};

export default componentDemo;
