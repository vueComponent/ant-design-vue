import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import DatePicker from '../';
import { $$ } from './utils';
import { sleep } from '../../../tests/utils';

const { RangePicker } = DatePicker;

describe('DatePicker with showTime', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });
  it('should trigger onChange when select value', async () => {
    const onChangeFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    mount(
      {
        render() {
          return <DatePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      $$('.ant-calendar-date')[0].click();
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
    mount(
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
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      $$('.ant-calendar-ok-btn')[0].click();
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
    mount(
      {
        render() {
          return <DatePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      $$('.ant-calendar-today-btn')[0].click();
    });
    await asyncExpect(() => {
      expect(onOpenChangeFn).toHaveBeenCalledWith(false);
      expect(onChangeFn).toHaveBeenCalled();
    });
  });

  it('should have correct className when use12Hours is true', async () => {
    mount(
      {
        render() {
          return <DatePicker showTime={{ use12Hours: true }} open />;
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      expect($$('.ant-calendar-time-picker-column-4').length).toBe(0);
    });
    $$('.ant-calendar-today')[0].click();
    await sleep();
    $$('.ant-calendar-time-picker-btn')[0].click();
    await asyncExpect(() => {
      expect($$('.ant-calendar-time-picker-column-4').length).toBe(1);
    });
  });
});

describe('RangePicker with showTime', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });
  it('should trigger onChange when select value', async () => {
    const onChangeFn = jest.fn();
    const onOpenChangeFn = jest.fn();
    mount(
      {
        render() {
          return <RangePicker showTime open onChange={onChangeFn} onOpenChange={onOpenChangeFn} />;
        },
      },
      { sync: false },
    );

    await asyncExpect(() => {
      expect($$('.ant-calendar-time-picker-btn')[0].getAttribute('class').split(' ')).toContain(
        'ant-calendar-time-picker-btn-disabled',
      );
      expect($$('.ant-calendar-ok-btn')[0].getAttribute('class').split(' ')).toContain(
        'ant-calendar-ok-btn-disabled',
      );
    });
    $$('.ant-calendar-date')[10].click();
    $$('.ant-calendar-date')[11].click();
    await asyncExpect(() => {
      expect($$('.ant-calendar-time-picker-btn')[0].getAttribute('class').split(' ')).not.toContain(
        'ant-calendar-time-picker-btn-disabled',
      );
      expect($$('.ant-calendar-ok-btn')[0].getAttribute('class').split(' ')).not.toContain(
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
    mount(
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
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      $$('.ant-calendar-date')[10].click();
      $$('.ant-calendar-date')[11].click();
    });
    onChangeFn.mockClear();
    $$('.ant-calendar-ok-btn')[0].click();
    expect(onOkFn).toHaveBeenCalled();
    expect(onOpenChangeFn).toHaveBeenCalledWith(false);
    expect(onChangeFn).not.toHaveBeenCalled();
  });
});
