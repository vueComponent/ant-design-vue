import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import DatePicker from '../';
import { setMockDate, resetMockDate } from '../../../tests/utils';
import { selectDateFromBody, $$ } from './utils';
import focusTest from '../../../tests/shared/focusTest';

const { RangePicker } = DatePicker;

describe('RangePicker', () => {
  focusTest(RangePicker);

  beforeEach(() => {
    document.body.outerHTML = '';
    setMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });

  it('show month panel according to value', async () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(RangePicker, {
      propsData: {
        getCalendarContainer: trigger => trigger,
        format: 'YYYY/MM/DD',
        showTime: true,
        open: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.setProps({ value: [birthday, birthday] });
    });
    const rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(rangeCalendarWrapper.html()).toMatchSnapshot();
    });
  });

  it('switch to corresponding month panel when click presetted ranges', async () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD').locale('zh-cn');
    const wrapper = mount(
      {
        render() {
          return (
            <RangePicker
              ranges={{
                'My Birthday': [birthday, birthday],
              }}
              getCalendarContainer={trigger => trigger}
              format="YYYY/MM/DD"
              showTime
              open
            />
          );
        },
      },
      { sync: false },
    );

    const rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      rangeCalendarWrapper.find('.ant-calendar-range-quick-selector .ant-tag').trigger('click');
    });
    await asyncExpect(() => {
      expect(rangeCalendarWrapper.html()).toMatchSnapshot();
    });
  });

  it('highlight range when hover presetted range', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <RangePicker
              ranges={{
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              getCalendarContainer={trigger => trigger}
              format="YYYY/MM/DD"
              open
            />
          );
        },
      },
      { sync: false },
    );

    let rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      rangeCalendarWrapper
        .find('.ant-calendar-range-quick-selector .ant-tag')
        .trigger('mouseenter');
    });
    rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(rangeCalendarWrapper.findAll('.ant-calendar-selected-day').length).toBe(2);
    });
  });

  it('should trigger onCalendarChange when change value', async () => {
    const onCalendarChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <RangePicker
              getCalendarContainer={trigger => trigger}
              onCalendarChange={onCalendarChangeFn}
              open
            />
          );
        },
      },
      { sync: false },
    );
    const rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      rangeCalendarWrapper
        .findAll('.ant-calendar-cell')
        .at(15)
        .trigger('click');
    });
    expect(onCalendarChangeFn).toHaveBeenCalled();
  });

  // issue: https://github.com/ant-design/ant-design/issues/5872
  it('should not throw error when value is reset to `[]`', async () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD');
    const wrapper = mount(RangePicker, {
      propsData: {
        getCalendarContainer: trigger => trigger,
        value: [birthday, birthday],
        open: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.setProps({ value: [] });
    });
    const rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(() => {
        const cell = rangeCalendarWrapper.findAll('.ant-calendar-cell').at(15);
        cell.trigger('click');
        cell.trigger('click');
      }).not.toThrow();
    });
  });

  // issue: https://github.com/ant-design/ant-design/issues/7077
  it('should not throw error when select after clear', async () => {
    const wrapper = mount(RangePicker, {
      propsData: {
        getCalendarContainer: trigger => trigger,
        open: true,
      },
      sync: false,
    });

    let rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      const cell = rangeCalendarWrapper.findAll('.ant-calendar-cell').at(15);
      cell.trigger('click');
      cell.trigger('click');
    });

    wrapper.find('.ant-calendar-picker-clear').trigger('click');
    wrapper.find('.ant-calendar-picker-input').trigger('click');
    rangeCalendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(() => {
        const cell = rangeCalendarWrapper.findAll('.ant-calendar-cell').at(15);
        cell.trigger('click');
        cell.trigger('click');
      }).not.toThrow();
    });
  });

  it('clear hover value after panel close', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <div>
              <RangePicker value={[moment(), moment().add(2, 'day')]} />
            </div>
          );
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    });
    await asyncExpect(() => {
      $$('.ant-calendar-cell')[25].click();
      $$('.ant-calendar-cell')[27].dispatchEvent(new MouseEvent('mouseenter'));
      document.dispatchEvent(new MouseEvent('mousedown'));
    }, 500);
    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    });
    await asyncExpect(() => {
      expect(
        $$('.ant-calendar-cell')[23]
          .getAttribute('class')
          .split(' '),
      ).toContain('ant-calendar-in-range-cell');
    });
  });

  describe('preset range', () => {
    beforeEach(() => {
      document.body.outerHTML = '';
    });
    it('static range', async () => {
      const range = [moment().subtract(2, 'd'), moment()];
      const format = 'YYYY-MM-DD HH:mm:ss';
      const wrapper = mount(RangePicker, {
        propsData: {
          ranges: { 'recent two days': range },
          format,
        },
        sync: false,
        attachToDocument: true,
      });
      await asyncExpect(() => {
        wrapper.find('.ant-calendar-picker-input').trigger('click');
      });
      await asyncExpect(() => {
        $$('.ant-calendar-range-quick-selector .ant-tag')[0].click();
      }, 500);
      await asyncExpect(() => {
        expect(wrapper.findAll('.ant-calendar-range-picker-input').at(0).element.value).toBe(
          range[0].format(format),
        );
      });
      await asyncExpect(() => {
        const inputs = wrapper.findAll('.ant-calendar-range-picker-input');
        expect(inputs.at(inputs.length - 1).element.value).toBe(range[1].format(format));
      });
      await asyncExpect(() => {});
    });

    it('function range', async () => {
      const range = [moment().subtract(2, 'd'), moment()];
      const format = 'YYYY-MM-DD HH:mm:ss';
      const wrapper = mount(RangePicker, {
        propsData: {
          ranges: { 'recent two days': () => range },
          format,
        },
        sync: false,
        attachToDocument: true,
      });
      await asyncExpect(() => {
        wrapper.find('.ant-calendar-picker-input').trigger('click');
      });
      await asyncExpect(() => {
        $$('.ant-calendar-range-quick-selector .ant-tag')[0].click();
      }, 500);
      await asyncExpect(() => {
        expect(wrapper.findAll('.ant-calendar-range-picker-input').at(0).element.value).toBe(
          range[0].format(format),
        );
      });
      await asyncExpect(() => {
        const inputs = wrapper.findAll('.ant-calendar-range-picker-input');
        expect(inputs.at(inputs.length - 1).element.value).toBe(range[1].format(format));
      });
    });
  });

  // https://github.com/ant-design/ant-design/issues/6999
  it('input date manually', async () => {
    mount(RangePicker, { propsData: { open: true }, sync: false, attachToDocument: true });
    const dateString = '2008-12-31';
    let input = null;
    await asyncExpect(() => {
      input = $$('.ant-calendar-input')[0];
      input.value = dateString;
    });
    expect($$('.ant-calendar-input')[0].value).toBe(dateString);
  });

  it('triggers onOk when click on preset range', async () => {
    const handleOk = jest.fn();
    const range = [moment().subtract(2, 'd'), moment()];
    const wrapper = mount(RangePicker, {
      propsData: {
        ranges: { 'recent two days': range },
      },
      listeners: { ok: handleOk },
      sync: false,
      attachToDocument: true,
    });

    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    });
    await asyncExpect(() => {
      $$('.ant-calendar-range-quick-selector .ant-tag')[0].click();
    }, 500);
    await asyncExpect(() => {
      expect(handleOk).toBeCalledWith(range);
    });
  });

  // https://github.com/ant-design/ant-design/issues/9267
  it('invali end date not throw error', async () => {
    const wrapper = mount(RangePicker, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    });
    await asyncExpect(() => {
      selectDateFromBody(moment('2017-09-18'), 0);
      selectDateFromBody(moment('2017-10-18'), 1);
    }, 500);
    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    });
    await asyncExpect(() => {
      const input = $$('.ant-calendar-input')[1];

      expect(() => {
        input.value = '2016-01-01';
      }).not.toThrow();
    });
  });
  // https://github.com/ant-design/ant-design/issues/11631
  it('triggers onOpenChange when click on preset range', async () => {
    const handleOpenChange = jest.fn();
    const range = [moment().subtract(2, 'd'), moment()];
    const wrapper = mount(
      {
        render() {
          return (
            <RangePicker onOpenChange={handleOpenChange} ranges={{ 'recent two days': range }} />
          );
        },
      },
      {
        sync: false,
        attachToDocument: true,
      },
    );
    await asyncExpect(() => {
      wrapper.find('.ant-calendar-picker-input').trigger('click');
    }, 0);
    await asyncExpect(() => {
      $$('.ant-calendar-range-quick-selector .ant-tag')[0].click();
    }, 1000);
    await asyncExpect(() => {
      expect(handleOpenChange).toBeCalledWith(false);
    });
  });
});
