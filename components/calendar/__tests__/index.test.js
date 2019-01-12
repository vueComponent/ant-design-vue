import Moment from 'moment';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import MockDate from 'mockdate';
import Calendar from '..';

function $$(className) {
  return document.body.querySelectorAll(className);
}
describe('Calendar', () => {
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
      wrapper
        .findAll('.ant-fullcalendar-cell')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      expect(onSelect).toBeCalledWith(expect.anything());
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
      wrapper
        .findAll('[title="February 1, 2018"]')
        .at(0)
        .trigger('click');
      wrapper
        .findAll('[title="February 2, 2018"]')
        .at(0)
        .trigger('click');
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
      wrapper
        .findAll('[title="February 20, 2018"]')
        .at(0)
        .trigger('click');
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
      expect(
        wrapper
          .findAll('[title="Jan"]')
          .at(0)
          .classes(),
      ).toContain('ant-fullcalendar-month-panel-cell-disabled');
      expect(
        wrapper
          .findAll('[title="Feb"]')
          .at(0)
          .classes(),
      ).not.toContain('ant-fullcalendar-month-panel-cell-disabled');
      expect(
        wrapper
          .findAll('[title="Jun"]')
          .at(0)
          .classes(),
      ).toContain('ant-fullcalendar-month-panel-cell-disabled');
      wrapper
        .findAll('[title="Jan"]')
        .at(0)
        .trigger('click');
      wrapper
        .findAll('[title="Mar"]')
        .at(0)
        .trigger('click');
      expect(onSelect.mock.calls.length).toBe(1);
    });
  });

  it('months other than in valid range should not be shown in header', async () => {
    document.body.innerHTML = '';
    const validRange = [Moment('2017-02-02'), Moment('2018-05-18')];
    const wrapper = mount(
      {
        render() {
          return <Calendar validRange={validRange} />;
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      wrapper.find('.ant-fullcalendar-year-select').trigger('click');
    });
    await asyncExpect(() => {
      $$('.ant-select-dropdown-menu-item')[0].click();
    }, 0);
  });

  it('getDateRange should returns a disabledDate function', async () => {
    const validRange = [Moment('2018-02-02'), Moment('2018-05-18')];
    const wrapper = mount(Calendar, {
      propsData: {
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
    await asyncExpect(() => {
      expect(wrapper.vm.sMode).toEqual(monthMode);
      wrapper.setProps({ mode: 'year' });
    });
    await asyncExpect(() => {
      expect(wrapper.vm.sMode).toEqual(yearMode);
    });
  });

  it('Calendar should switch mode', async () => {
    const monthMode = 'month';
    const yearMode = 'year';
    const onPanelChangeStub = jest.fn();
    const wrapper = mount(Calendar, {
      propsData: {
        mode: yearMode,
      },
      listeners: {
        panelChange: onPanelChangeStub,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.vm.sMode).toEqual(yearMode);
      wrapper.vm.setType('date');
    });
    await asyncExpect(() => {
      expect(wrapper.vm.sMode).toEqual(monthMode);
      expect(onPanelChangeStub).toHaveBeenCalledTimes(1);
    });
  });

  it('Calendar should support locale', async () => {
    MockDate.set(Moment('2018-10-19'));
    // eslint-disable-next-line
    const zhCN = require('../locale/zh_CN').default;
    const wrapper = mount(Calendar, {
      propsData: {
        locale: zhCN,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      MockDate.reset();
    });
  });
});
