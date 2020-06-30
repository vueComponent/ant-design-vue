import { mount } from '@vue/test-utils';
import { Col, Row } from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Grid', () => {
  mountTest(Row);
  mountTest(Col);
  it('should render Col', () => {
    const wrapper = mount(Col, {
      props: {
        span: 2,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should render Row', () => {
    const wrapper = mount(Row);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders wrapped Col correctly', () => {
    const wrapper = mount({
      render() {
        return (
          <Row gutter={20}>
            <div>
              <Col span={12} />
            </div>
            <Col span={12} />
          </Row>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
