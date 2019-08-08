import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import DatePicker from '../';

const { RangePicker } = DatePicker;

describe('DatePicker with showTime', () => {
  it('should trigger onChange when select value', async () => {
    const onChangeFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <DatePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false },
    );

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      calendarWrapper
        .findAll('.ant-calendar-date')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      expect(onChangeFn).toHaveBeenCalled();
      expect(onOpenChangeFn).not.toHaveBeenCalled();
    });
  });

  it('should trigger onOk when press ok button', async () => {
    const onOkFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    const onChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <DatePicker
              showTime
              open
              onChange={onChangeFn}
              onOk={onOkFn}
              onOpenChange={onOpenChangeFn}
              defaultValue={moment()}
            />
          );
        },
      },
      { sync: false },
    );

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      calendarWrapper.find('.ant-calendar-ok-btn').trigger('click');
    });
    await asyncExpect(() => {
      expect(onOkFn).toHaveBeenCalled();
      expect(onOpenChangeFn).toHaveBeenCalledWith(false);
      expect(onChangeFn).not.toHaveBeenCalled();
    });
  });

  it('should trigger onChange when click Now link', async () => {
    const onOpenChangeFn = jest.fn();
    const onChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <DatePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false },
    );

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      calendarWrapper.find('.ant-calendar-today-btn').trigger('click');
    });
    await asyncExpect(() => {
      expect(onOpenChangeFn).toHaveBeenCalledWith(false);
      expect(onChangeFn).toHaveBeenCalled();
    });
  });

  it('should have correct className when use12Hours is true', async () => {
    const wrapper = mount(
      {
        render() {
          return <DatePicker showTime={{ use12Hours: true }} open />;
        },
      },
      { sync: false },
    );
    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(calendarWrapper.findAll('.ant-calendar-time-picker-column-4').length).toBe(0);
    });
    calendarWrapper
      .findAll('.ant-calendar-time-picker-btn')
      .at(0)
      .trigger('click');
    await asyncExpect(() => {
      expect(calendarWrapper.findAll('.ant-calendar-time-picker-column-4').length).toBe(1);
    });
  });
});

describe('RangePicker with showTime', () => {
  it('should trigger onChange when select value', async () => {
    const onChangeFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <RangePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false },
    );

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(calendarWrapper.find('.ant-calendar-time-picker-btn').classes()).toContain(
        'ant-calendar-time-picker-btn-disabled',
      );
      expect(calendarWrapper.find('.ant-calendar-ok-btn').classes()).toContain(
        'ant-calendar-ok-btn-disabled',
      );
    });
    calendarWrapper
      .findAll('.ant-calendar-date')
      .at(10)
      .trigger('click');
    calendarWrapper
      .findAll('.ant-calendar-date')
      .at(11)
      .trigger('click');
    await asyncExpect(() => {
      expect(calendarWrapper.find('.ant-calendar-time-picker-btn').classes()).not.toContain(
        'ant-calendar-time-picker-btn-disabled',
      );
      expect(calendarWrapper.find('.ant-calendar-ok-btn').classes()).not.toContain(
        'ant-calendar-ok-btn-disabled',
      );
    });
    expect(onChangeFn).toHaveBeenCalled();
    expect(onOpenChangeFn).not.toHaveBeenCalled();
  });

  it('hould trigger onOk when press ok button', async () => {
    const onOkFn = jest.fn();
    const onChangeFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <RangePicker
              showTime
              open
              onOk={onOkFn}
              onChange={onChangeFn}
              onOpenChange={onOpenChangeFn}
            />
          );
        },
      },
      { sync: false },
    );

    const calendarWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      calendarWrapper
        .findAll('.ant-calendar-date')
        .at(10)
        .trigger('click');
      calendarWrapper
        .findAll('.ant-calendar-date')
        .at(11)
        .trigger('click');
    });
    onChangeFn.mockClear();
    calendarWrapper.find('.ant-calendar-ok-btn').trigger('click');
    expect(onOkFn).toHaveBeenCalled();
    expect(onOpenChangeFn).toHaveBeenCalledWith(false);
    expect(onChangeFn).not.toHaveBeenCalled();
  });
});
