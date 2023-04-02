import { defineComponent } from 'vue';
import type { CSSProperties } from 'vue';

import { Card } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const gridStyle: CSSProperties = {
  width: '25%',
  textAlign: 'center',
};

const Demo = defineComponent({
  setup() {
    return () => (
      <Card title="Card Title">
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle}>
          Content
        </Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
      </Card>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBorderSecondary'],
  key: 'cardGrid',
};

export default componentDemo;
