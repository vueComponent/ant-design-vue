import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import Descriptions from '..';
import { resetWarned } from '../../_util/warning';
import { asyncExpect } from '@/tests/utils';

jest.mock('enquire.js', () => {
  let that;
  let unmatchFun;
  return {
    unregister: jest.fn(),
    register: (media, options) => {
      if (media === '(max-width: 575px)') {
        that = this;
        options.match.call(that);
        unmatchFun = options.unmatch;
      }
    },
    callunmatch() {
      unmatchFun.call(that);
    },
  };
});

describe('Descriptions', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    MockDate.reset();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('when typeof column is object', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions ref="descriptions" column={{ xs: 8, sm: 16, md: 24 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      expect(wrapper.vm.$refs.descriptions.getColumn()).toBe(8);
    }, 100);
    wrapper.destroy();
  });

  it('column is number', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions column="3">
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.destroy();
  });

  it('warning if ecceed the row span', () => {
    resetWarned();

    mount({
      render() {
        return (
          <Descriptions column={3}>
            <Descriptions.Item label="Product" span={2}>
              Cloud Database
            </Descriptions.Item>
            <Descriptions.Item label="Billing" span={2}>
              Prepaid
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Descriptions] Sum of column `span` in a line exceeds `column` of Descriptions.',
    );
  });

  it('when item is rendered conditionally', () => {
    const hasDiscount = false;
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            {hasDiscount && <Descriptions.Item label="Discount">$20.00</Descriptions.Item>}
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.destroy();
  });

  it('vertical layout', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions layout="vertical">
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.destroy();
  });

  it('Descriptions.Item support className', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product" className="my-class">
              Cloud Database
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support colon', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions colon={false}>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support style', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions style={{ backgroundColor: '#e8e8e8' }}>
            <Descriptions.Item>Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('when max-width: 575px，column=1', async () => {
    // eslint-disable-next-line global-require
    const enquire = require('enquire.js');
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
              <Descriptions.Item>No-Label</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('tr')).toHaveLength(5);
      expect(wrapper.findAll('.ant-descriptions-item-no-label')).toHaveLength(1);
    });

    enquire.callunmatch();
    wrapper.destroy();
  });

  it('when max-width: 575px，column=2', async () => {
    // eslint-disable-next-line global-require
    const enquire = require('enquire.js');
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions column={{ xs: 2 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {});
    expect(wrapper.findAll('tr')).toHaveLength(2);

    enquire.callunmatch();
    wrapper.destroy();

    await asyncExpect(() => {});
    await asyncExpect(() => {});
    await asyncExpect(() => {});
    await asyncExpect(() => {});
  });
});
