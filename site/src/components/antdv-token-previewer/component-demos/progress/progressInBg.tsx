import { defineComponent } from 'vue';
import { Progress, theme } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const { token } = theme.useToken();

    return () => {
      return (
        <div style={{ padding: 24, background: token.value.colorBgLayout }}>
          <Progress percent={30} />
          <Progress percent={50} status="active" />
          <Progress percent={70} status="exception" />
          <Progress percent={100} />
          <Progress percent={50} showInfo={false} />
          <Progress steps={8} />
        </div>
      );
    };
  },
});
const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillSecondary', 'colorText', 'colorBgContainer'],
  key: 'layout',
};

export default componentDemo;
