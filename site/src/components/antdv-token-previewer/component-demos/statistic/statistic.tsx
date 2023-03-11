import { defineComponent } from 'vue';
import { Statistic, Row, Col, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Active Users" value={112893} />
        </Col>
        <Col span={12}>
          <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
          <Button style={{ marginTop: 16 }} type="primary">
            Recharge
          </Button>
        </Col>
        <Col span={12}>
          <Statistic title="Active Users" value={112893} loading />
        </Col>
      </Row>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary'],
  key: 'default',
};

export default componentDemo;
