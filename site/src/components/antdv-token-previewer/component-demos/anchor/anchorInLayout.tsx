import { defineComponent } from 'vue';
import { Anchor, theme } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { Link } = Anchor;
const Demo = defineComponent({
  setup() {
    const { token } = theme.useToken();

    return () => {
      return (
        <div style={{ background: token.value.colorBorderSecondary, padding: '12px' }}>
          <Anchor>
            <Link href="#components-anchor-demo-basic" title="Basic demo" />
            <Link href="#components-anchor-demo-static" title="Static demo" />
            <Link href="#API" title="API">
              <Link href="#Anchor-Props" title="Anchor Props" />
              <Link href="#Link-Props" title="Link Props" />
            </Link>
          </Anchor>
        </div>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSplit'],
  key: 'anchorInLayout',
};

export default componentDemo;
