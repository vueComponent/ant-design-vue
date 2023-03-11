import { Row, Col } from 'ant-design-vue';
import makeStyle from '../../utils/makeStyle';
import type { ComponentDemo } from '../../interface';
import { defineComponent } from 'vue';

const useStyle = makeStyle('GridDemo', token => ({
  '.previewer-grid-demo': {
    [`${token.rootCls}-row`]: {
      marginBottom: 16,
    },
    [`${token.rootCls}-row > div:not(.gutter-row)`]: {
      padding: '16px 0',
      background: '#0092ff',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&:nth-child(2n + 1)': {
        background: 'rgba(0,146,255,.75)',
      },
    },
  },
}));

const Demo = defineComponent({
  setup() {
    const [, hashId] = useStyle();

    return () => (
      <div class={['previewer-grid-demo', hashId.value]}>
        <Row>
          <Col span={24}>col</Col>
        </Row>
        <Row>
          <Col span={12}>col-12</Col> <Col span={12}>col-12</Col>
        </Row>
        <Row>
          <Col span={8}>col-8</Col> <Col span={8}>col-8</Col>
          <Col span={8}>col-8</Col>
        </Row>
        <Row>
          <Col span={6}>col-6</Col> <Col span={6}>col-6</Col>
          <Col span={6}>col-6</Col>
          <Col span={6}>col-6</Col>
        </Row>
      </div>
    );
  },
});
const componentDemo: ComponentDemo = {
  demo: <Demo />,
  key: 'default',
};

export default componentDemo;
