import { mount } from '@vue/test-utils';
import Card from '../index';
import Button from '../../button/index';

const testMethod = typeof window !== 'undefined' ? it : xit;

describe('Card', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function fakeResizeWindowTo(wrapper, width) {
    Object.defineProperties(wrapper.vm.$refs.cardContainerRef, {
      offsetWidth: {
        get() {
          return width;
        },
        configurable: true,
      },
    });
    window.resizeTo(width);
  }

  testMethod('resize card will trigger different padding', () => {
    const wrapper = mount(Card, {
      propsData: 'xxx',
      slots: {
        default: 'xxx',
      },
    });
    fakeResizeWindowTo(wrapper, 1000);
    jest.runAllTimers();
    wrapper.vm.$forceUpdate();
    expect(wrapper.findAll('.ant-card-wider-padding').length).toBe(1);
    fakeResizeWindowTo(wrapper, 800);
    jest.runAllTimers();
    wrapper.vm.$forceUpdate();
    expect(wrapper.findAll('.ant-card-wider-padding').length).toBe(0);
  });
  it('should still have padding when card which set padding to 0 is loading', () => {
    const wrapper = mount({
      render() {
        return (
          <Card loading bodyStyle={{ padding: 0 }}>
            xxx
          </Card>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('title should be vertically aligned', () => {
    const wrapper = mount({
      render() {
        return (
          <Card title="Card title" extra={<Button>Button</Button>} style={{ width: '300px' }}>
            <p>Card content</p>
          </Card>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
