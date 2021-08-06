import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import Statistic from '..';
import { formatTimeStr } from '../utils';
import mountTest from '../../../tests/shared/mountTest';

describe('Statistic', () => {
  mountTest(Statistic);
  mountTest(Statistic.Countdown);

  beforeAll(() => {
    MockDate.set(dayjs('2018-11-28 00:00:00'));
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('customize formatter', () => {
    const formatter = jest.fn(() => 93);
    const props = {
      props: {
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
      props: {
        value: 1128,
        groupSeparator: '__TEST__',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('1__TEST__128');
  });

  it('not a number', () => {
    const props = {
      props: {
        value: 'bamboo',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('bamboo');
  });

  it('support negetive number', () => {
    const props = {
      props: {
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
      const now = dayjs().add(2, 'd').add(11, 'h').add(28, 'm').add(9, 's').add(3, 'ms');

      [
        ['H:m:s', '59:28:9'],
        ['HH:mm:ss', '59:28:09'],
        ['HH:mm:ss:SSS', '59:28:09:003'],
        ['DD-HH:mm:ss', '02-11:28:09'],
      ].forEach(([format, value]) => {
        const props = {
          props: {
            format,
            value: now,
          },
        };
        const wrapper = mount(Statistic.Countdown, props);
        expect(wrapper.find('.ant-statistic-content-value').text()).toEqual(value);
      });
    });
  });
  describe('utils', () => {
    it('format should support escape', () => {
      expect(formatTimeStr(1000 * 60 * 60 * 24, 'D [Day]')).toBe('1 Day');
    });
  });
});
