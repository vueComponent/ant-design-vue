import { defineComponent } from 'vue';
import type { CSSProperties } from 'vue';

import { Carousel } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const Demo = defineComponent({
  setup() {
    return () => (
      <Carousel>
        <div>
          <h3 style={contentStyle as CSSProperties}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle as CSSProperties}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle as CSSProperties}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle as CSSProperties}>4</h3>
        </div>
      </Carousel>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
