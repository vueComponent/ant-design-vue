import dayjs from 'dayjs';
import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import MockDate from 'mockdate';
import Calendar from '..';
import Header from '../Header';
import mountTest from '../../../tests/shared/mountTest';
import generateConfig from '../../vc-picker/generate/dayjs';

describe('Calendar', () => {
  mountTest(Calendar);
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function openSelect(wrapper, className) {
    wrapper.find(className).find('.ant-select-selector').trigger('mousedown');
  }

  function findSelectItem(wrapper) {
    return wrapper.findAll('.ant-select-item-option');
  }

  function clickSelectItem(wrapper, index = 0) {
    findSelectItem(wrapper)[index].trigger('click');
  }

  it('Calendar should be selectable', async () => {
    const onSelect = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <Calendar onSelect={onSelect} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.findAll('.ant-picker-cell')[0].trigger('click');
    }, 0);
    await asyncExpect(() => {
      expect(onSelect).toHaveBeenCalledWith(expect.anything());
      const value = onSelect.mock.calls[0][0];
      expect(dayjs.isDayjs(value)).toBe(true);
    });
  });

  it('only Valid range should be selectable', async () => {
    const onSelect = jest.fn();
    const validRange = [dayjs('2018-02-02'), dayjs('2018-02-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={dayjs('2018-02-02')}
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.findAll('[title="2018-02-01"]')[0].trigger('click');
      wrapper.findAll('[title="2018-02-02"]')[0].trigger('click');
      expect(onSelect.mock.calls.length).toBe(1);
    });
  });

  it('dates other than in valid range should be disabled', async () => {
    const onSelect = jest.fn();
    const validRange = [dayjs('2018-02-02'), dayjs('2018-02-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={dayjs('2018-02-02')}
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.findAll('[title="2018-02-20"]')[0].trigger('click');
      expect(wrapper.find('[title="2018-02-20"]').classes()).toContain('ant-picker-cell-disabled');
      expect(onSelect.mock.calls.length).toBe(0);
    });
  });

  it('months other than in valid range should be disabled', async () => {
    const onSelect = jest.fn();
    const validRange = [dayjs('2018-02-02'), dayjs('2018-05-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={dayjs('2018-02-02')}
              mode="year"
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('[title="2018-01"]')[0].classes()).toContain(
        'ant-picker-cell-disabled',
      );
      expect(wrapper.findAll('[title="2018-02"]')[0].classes()).not.toContain(
        'ant-picker-cell-disabled',
      );
      expect(wrapper.findAll('[title="2018-06"]')[0].classes()).toContain(
        'ant-picker-cell-disabled',
      );
      wrapper.findAll('[title="2018-01"]')[0].trigger('click');
      wrapper.findAll('[title="2018-03"]')[0].trigger('click');
      expect(onSelect.mock.calls.length).toBe(1);
    });
  });

  it('months other than in valid range should not be shown in header', async () => {
    document.body.innerHTML = '';
    const validRange = [dayjs('2017-02-02'), dayjs('2018-05-18')];
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(
      {
        render() {
          return <Calendar validRange={validRange} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep();
    openSelect(wrapper, '.ant-picker-calendar-year-select');
    await sleep(100);
    clickSelectItem(wrapper);
    await sleep();
    openSelect(wrapper, '.ant-picker-calendar-month-select');
    await sleep(100);
    // 2 years and 11 months
    expect(wrapper.findAll('.ant-select-item-option').length).toBe(13);
  });

  it('getDateRange should returns a disabledDate function', async () => {
    const validRange = [dayjs('2018-02-02'), dayjs('2018-05-18')];
    const wrapper = mount(Calendar, {
      props: {
        validRange,
        defaultValue: dayjs('2018-02-02'),
      },
      sync: false,
    });
    await asyncExpect(() => {
      const { disabledDate } = wrapper.getComponent({ name: 'PickerPanel' }).props();
      expect(disabledDate(dayjs('2018-06-02'))).toBe(true);
      expect(disabledDate(dayjs('2018-04-02'))).toBe(false);
    });
  });

  it('Calendar should change mode by prop', async () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const wrapper = mount(Calendar, { sync: false });
    await sleep(50);
    expect(wrapper.getComponent({ name: 'CalendarHeader' }).props().mode).toEqual(monthMode);
    wrapper.setProps({ mode: 'year' });
    await sleep(50);
    expect(wrapper.getComponent({ name: 'CalendarHeader' }).props().mode).toEqual(yearMode);
  });

  it('Calendar should switch mode', async () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const onPanelChangeStub = jest.fn();
    const wrapper = mount(Calendar, {
      props: {
        mode: yearMode,
        onPanelChange: onPanelChangeStub,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.getComponent({ name: 'CalendarHeader' }).props().mode).toEqual(yearMode);
      wrapper.setProps({ mode: monthMode });
    });
    await asyncExpect(() => {
      expect(wrapper.getComponent({ name: 'CalendarHeader' }).props().mode).toEqual(monthMode);
      expect(onPanelChangeStub).toHaveBeenCalledTimes(0);
    });
  });

  it('Calendar should support locale', async () => {
    MockDate.set(dayjs('2018-10-19'));
    // eslint-disable-next-line
    const zhCN = require('../locale/zh_CN').default;
    const wrapper = mount(Calendar, {
      props: {
        locale: zhCN,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      MockDate.reset();
    });
  });

  it('should trigger onPanelChange when click last month of date', () => {
    const onPanelChange = jest.fn();
    const date = new dayjs('1990-09-03');
    const wrapper = mount(Calendar, {
      props: {
        value: date,
        onPanelChange,
      },
      sync: false,
    });
    wrapper.findAll('.ant-picker-cell')[0].trigger('click');

    expect(onPanelChange).toHaveBeenCalled();
    expect(onPanelChange.mock.calls[0][0].month()).toEqual(date.month() - 1);
  });

  it('switch should work correctly without prop mode', async () => {
    const onPanelChange = jest.fn();
    const date = new dayjs(new Date(Date.UTC(2017, 7, 9, 8)));
    const wrapper = mount(Calendar, {
      props: {
        value: date,
        onPanelChange,
      },
      sync: false,
      attachTo: 'body',
    });
    await sleep(300);
    expect(wrapper.getComponent({ name: 'CalendarHeader' }).props().mode).toBe('month');
    expect(wrapper.findAll('.ant-picker-date-panel').length).toBe(1);
    expect(wrapper.findAll('.ant-picker-month-panel').length).toBe(0);
    await wrapper.findAll('.ant-radio-button-input[value="year"]')[0].trigger('change');
    await sleep(300);
    expect(wrapper.findAll('.ant-picker-date-panel').length).toBe(0);
    expect(wrapper.findAll('.ant-picker-month-panel').length).toBe(1);
    expect(onPanelChange).toHaveBeenCalled();
    expect(onPanelChange.mock.calls[0][1]).toEqual('year');
  });

  const createWrapper = async (start, end, value, onValueChange) => {
    document.body.innerHTML = '';
    const wrapper = mount(
      {
        render() {
          return (
            <Header
              prefixCls="ant-picker-calendar"
              onChange={onValueChange}
              generateConfig={generateConfig}
              value={value}
              validRange={[start, end]}
              locale={{ year: '年' }}
            />
          );
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await sleep(50);
    openSelect(wrapper, '.ant-picker-calendar-year-select');
    await sleep(50);
    clickSelectItem(wrapper);
    await sleep(50);
  };

  it('if value.month > end.month, set value.month to end.month', async () => {
    const value = new dayjs('1990-01-03');
    const start = new dayjs('2019-04-01');
    const end = new dayjs('2019-11-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('3'));
  });
  it('if value.month > end.month, set value.month to end.month1', async () => {
    const value = new dayjs('1990-01-03');
    const start = new dayjs('2019-04-01');
    const end = new dayjs('2019-11-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('3'));
  });

  it('if start.month > value.month, set value.month to start.month ', async () => {
    const value = new dayjs('1990-01-03');
    const start = new dayjs('2019-11-01');
    const end = new dayjs('2019-03-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('10'));
  });

  it('onMonthChange should work correctly', async () => {
    const start = new dayjs('2018-11-01');
    const end = new dayjs('2019-03-01');
    const value = new dayjs('2018-12-03');
    const onValueChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Header
              prefixCls="ant-picker-calendar"
              generateConfig={generateConfig}
              onChange={onValueChange}
              value={value}
              validRange={[start, end]}
              locale={{ year: '年', locale: 'zh_CN' }}
              mode="month"
            />
          );
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await sleep();
    openSelect(wrapper, '.ant-picker-calendar-month-select');
    await sleep(100);
    clickSelectItem(wrapper);
    expect(onValueChange).toHaveBeenCalledWith(value.month(10));
  });

  it('onTypeChange should work correctly', () => {
    const onTypeChange = jest.fn();
    const value = new dayjs('2018-12-03');
    const wrapper = mount({
      render() {
        return (
          <Header
            prefixCls="ant-picker-calendar"
            generateConfig={generateConfig}
            onModeChange={onTypeChange}
            locale={{ year: '年', month: '月', locale: 'zh_CN' }}
            value={value}
            type="date"
          />
        );
      },
    });
    wrapper.findAll('input[type="radio"]')[1].trigger('change');
    expect(onTypeChange).toHaveBeenCalledWith('year');
  });
});
