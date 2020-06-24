import { mount } from '@vue/test-utils';
import Card from '../index';
import Button from '../../button/index';
import mountTest from '../../../tests/shared/mountTest';

describe('Card', () => {
  mountTest(Card);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
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

  it('onTabChange should work', () => {
    const tabList = [
      {
        key: 'tab1',
        tab: 'tab1',
      },
      {
        key: 'tab2',
        tab: 'tab2',
      },
    ];
    const onTabChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Card onTabChange={onTabChange} tabList={tabList}>
              xxx
            </Card>
          );
        },
      },
      {
        sync: false,
      },
    );
    wrapper.findAll('.ant-tabs-tab')[1].trigger('click');
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('should not render when actions is number', () => {
    const wrapper = mount({
      render() {
        return (
          <Card title="Card title" actions={11}>
            <p>Card content</p>
          </Card>
        );
      },
    });
    expect(wrapper.findAll('.ant-card-actions').length).toBe(0);
  });
});
