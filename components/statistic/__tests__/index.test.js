import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import MockDate from 'mockdate';
import moment from 'moment';
import Statistic from '..';

describe('Statistic', () => {
  beforeAll(() => {
    MockDate.set(moment('2018-11-28 00:00:00'));
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('customize formatter', () => {
    const formatter = jest.fn(() => 93);
    const props = {
      propsData: {
        value: 1128,
        formatter,
      },
    };
    const wrapper = mount(Statistic, props);
    expect(formatter).toBeCalledWith(expect.objectContaining({ value: 1128 }));
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('93');
  });

  it('groupSeparator', () => {
    const props = {
      propsData: {
        value: 1128,
        groupSeparator: '__TEST__',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('1__TEST__128');
  });

  it('not a number', () => {
    const props = {
      propsData: {
        value: 'bamboo',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('bamboo');
  });

  it('support negetive number', () => {
    const props = {
      propsData: {
        title: 'Account Balance (CNY)',
        value: -112893.12345,
        precision: 2,
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('Countdown', () => {
    it('render correctly', () => {
      const now = moment()
        .add(2, 'd')
        .add(11, 'h')
        .add(28, 'm')
        .add(9, 's')
        .add(3, 'ms');

      [
        ['H:m:s', '59:28:9'],
        ['HH:mm:ss', '59:28:09'],
        ['HH:mm:ss:SSS', '59:28:09:003'],
        ['DD-HH:mm:ss', '02-11:28:09'],
      ].forEach(([format, value]) => {
        const props = {
          propsData: {
            format,
            value: now,
          },
        };
        const wrapper = mount(Statistic.Countdown, props);
        expect(wrapper.find('.ant-statistic-content-value').text()).toEqual(value);
      });
    });

    it('time going', async () => {
      const now = Date.now() + 1000;
      const props = {
        propsData: {
          value: now,
        },
      };
      const wrapper = mount(Statistic.Countdown, props);

      // setInterval should work
      const instance = wrapper.vm;
      expect(instance.countdownId).not.toBe(undefined);

      // await delay(50);

      // wrapper.unmount();
      // expect(instance.countdownId).toBe(undefined);
    });
  });
});
