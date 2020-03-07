import { Col, Row } from '../../components/grid';
import '../../components/grid/style';
function isEmptyElement(c) {
  return !(c.tag || (c.text && c.text.trim() !== ''));
}

function filterEmpty(children = []) {
  return children.filter(c => !isEmptyElement(c));
}
export default {
  props: {
    cols: {
      type: [Number, String],
      default: 2,
    },
  },
  inject: {
    demoContext: { default: {} },
  },
  render() {
    const { cols, $slots } = this;
    const isSingleCol = cols === 1;
    const leftChildren = [];
    const rightChildren = [];
    const children = filterEmpty($slots.default);
    children.forEach((demo, index) => {
      if (index % 2 === 0 || isSingleCol) {
        leftChildren.push(demo);
      } else {
        rightChildren.push(demo);
      }
    });
    return (
      <Row gutter={16}>
        <Col
          span={isSingleCol ? 24 : 12}
          class={isSingleCol ? 'code-boxes-col-1-1' : 'code-boxes-col-2-1'}
        >
          {leftChildren}
        </Col>
        {isSingleCol ? null : (
          <Col class="code-boxes-col-2-1" span={12}>
            {rightChildren}
          </Col>
        )}
      </Row>
    );
  },
};
