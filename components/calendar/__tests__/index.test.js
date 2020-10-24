import Moment from 'moment';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import MockDate from 'mockdate';
import Calendar from '..';
import Header from '../Header';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

function $$(className) {
  return document.body.querySelectorAll(className);
}
describe('Calendar', () => {
  mountTest(Calendar);
  beforeEach(() => {
    document.body.innerHTML = '';
  });
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
      wrapper.findAll('.ant-fullcalendar-cell')[0].trigger('click');
    });
    await asyncExpect(() => {
      expect(onSelect).toHaveBeenCalledWith(expect.anything());
      const value = onSelect.mock.calls[0][0];
      expect(Moment.isMoment(value)).toBe(true);
    });
  });

  it('only Valid range should be selectable', async () => {
    const onSelect = jest.fn();
    const validRange = [Moment('2018-02-02'), Moment('2018-02-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={Moment('2018-02-02')}
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.findAll('[title="February 1, 2018"]')[0].trigger('click');
      wrapper.findAll('[title="February 2, 2018"]')[0].trigger('click');
      expect(onSelect.mock.calls.length).toBe(1);
    });
  });

  it('dates other than in valid range should be disabled', async () => {
    const onSelect = jest.fn();
    const validRange = [Moment('2018-02-02'), Moment('2018-02-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={Moment('2018-02-02')}
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.findAll('[title="February 20, 2018"]')[0].trigger('click');
      expect(wrapper.find('[title="February 20, 2018"]').classes()).toContain(
        'ant-fullcalendar-disabled-cell',
      );
      expect(onSelect.mock.calls.length).toBe(0);
    });
  });

  it('months other than in valid range should be disabled', async () => {
    const onSelect = jest.fn();
    const validRange = [Moment('2018-02-02'), Moment('2018-05-18')];
    const wrapper = mount(
      {
        render() {
          return (
            <Calendar
              onSelect={onSelect}
              validRange={validRange}
              defaultValue={Moment('2018-02-02')}
              mode="year"
            />
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('[title="Jan"]')[0].classes()).toContain(
        'ant-fullcalendar-month-panel-cell-disabled',
      );
      expect(wrapper.findAll('[title="Feb"]')[0].classes()).not.toContain(
        'ant-fullcalendar-month-panel-cell-disabled',
      );
      expect(wrapper.findAll('[title="Jun"]')[0].classes()).toContain(
        'ant-fullcalendar-month-panel-cell-disabled',
      );
      wrapper.findAll('[title="Jan"]')[0].trigger('click');
      wrapper.findAll('[title="Mar"]')[0].trigger('click');
      expect(onSelect.mock.calls.length).toBe(1);
    });
  });

  it('months other than in valid range should not be shown in header', async () => {
    document.body.innerHTML = '';
    const validRange = [Moment('2017-02-02'), Moment('2018-05-18')];
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(
      {
        render() {
          return <Calendar validRange={validRange} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      wrapper
        .findAll('.ant-fullcalendar-year-select .ant-select-selector')[0]
        .element.dispatchEvent(new MouseEvent('mousedown'));
    });
    await asyncExpect(() => {
      expect($$('.ant-select-item-option').length).toBe(2);
    }, 100);
  });

  it('getDateRange should returns a disabledDate function', async () => {
    const validRange = [Moment('2018-02-02'), Moment('2018-05-18')];
    const wrapper = mount(Calendar, {
      props: {
        validRange,
        defaultValue: Moment('2018-02-02'),
      },
      sync: false,
    });
    await asyncExpect(() => {
      const instance = wrapper.vm;
      const disabledDate = instance.getDateRange(validRange);
      expect(disabledDate(Moment('2018-06-02'))).toBe(true);
      expect(disabledDate(Moment('2018-04-02'))).toBe(false);
    });
  });

  it('Calendar should change mode by prop', async () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const wrapper = mount(Calendar, { sync: false });
    await sleep(50);
    expect(wrapper.vm.sMode).toEqual(monthMode);
    wrapper.setProps({ mode: 'year' });
    await sleep(50);
    expect(wrapper.vm.sMode).toEqual(yearMode);
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
      expect(wrapper.vm.sMode).toEqual(yearMode);
      wrapper.setProps({ mode: monthMode });
    });
    await asyncExpect(() => {
      expect(wrapper.vm.sMode).toEqual(monthMode);
      expect(onPanelChangeStub).toHaveBeenCalledTimes(0);
    });
  });

  it('Calendar should support locale', async () => {
    MockDate.set(Moment('2018-10-19'));
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
    const date = new Moment('1990-09-03');
    const wrapper = mount(Calendar, {
      props: {
        value: date,
        onPanelChange,
      },
      sync: false,
    });
    wrapper.findAll('.ant-fullcalendar-cell')[0].trigger('click');

    expect(onPanelChange).toHaveBeenCalled();
    expect(onPanelChange.mock.calls[0][0].month()).toEqual(date.month() - 1);
  });

  it('switch should work correctly without prop mode', async () => {
    const onPanelChange = jest.fn();
    const date = new Moment(new Date(Date.UTC(2017, 7, 9, 8)));
    const wrapper = mount(Calendar, {
      props: {
        value: date,
        onPanelChange,
      },
      sync: false,
      attachTo: 'body',
    });
    await sleep(300);
    expect(wrapper.vm.sMode).toBe('month');
    expect(wrapper.findAll('.ant-fullcalendar-table').length).toBe(1);
    expect(wrapper.findAll('.ant-fullcalendar-month-panel-table').length).toBe(0);
    await wrapper.findAll('.ant-radio-button-input[value="year"]')[0].trigger('change');
    await sleep(300);
    expect(wrapper.findAll('.ant-fullcalendar-table').length).toBe(0);
    expect(wrapper.findAll('.ant-fullcalendar-month-panel-table').length).toBe(1);
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
              onValueChange={onValueChange}
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
    wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    await sleep(50);
    $$('.ant-select-item-option')[0].click();
    await sleep(50);
  };

  it('if value.month > end.month, set value.month to end.month', async () => {
    const value = new Moment('1990-01-03');
    const start = new Moment('2019-04-01');
    const end = new Moment('2019-11-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('3'));
  });
  it('if value.month > end.month, set value.month to end.month1', async () => {
    const value = new Moment('1990-01-03');
    const start = new Moment('2019-04-01');
    const end = new Moment('2019-11-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('3'));
  });

  it('if start.month > value.month, set value.month to start.month ', async () => {
    const value = new Moment('1990-01-03');
    const start = new Moment('2019-11-01');
    const end = new Moment('2019-03-01');
    const onValueChange = jest.fn();
    await createWrapper(start, end, value, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith(value.year('2019').month('10'));
  });

  it('onMonthChange should work correctly', async () => {
    const start = new Moment('2018-11-01');
    const end = new Moment('2019-03-01');
    const value = new Moment('2018-12-03');
    const onValueChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Header
              onValueChange={onValueChange}
              value={value}
              validRange={[start, end]}
              locale={{ year: '年' }}
              type="month"
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
    wrapper
      .findAll('.ant-fullcalendar-month-select .ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'));
    await sleep(50);
    wrapper.findAll('.ant-select-item-option')[0].trigger('click');
    await sleep(50);
    expect(onValueChange).toHaveBeenCalledWith(value.month(10));
  });

  it('onTypeChange should work correctly', () => {
    const onTypeChange = jest.fn();
    const value = new Moment('2018-12-03');
    const wrapper = mount({
      render() {
        return (
          <Header
            onTypeChange={onTypeChange}
            locale={{ year: '年', month: '月' }}
            value={value}
            type="date"
          />
        );
      },
    });
    const buttons = wrapper.findAll('.ant-radio-button-input');
    buttons[buttons.length - 1].trigger('change');
    expect(onTypeChange).toHaveBeenCalledWith('year');
  });
});
