import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import moment from 'moment';
import MockDate from 'mockdate';
import DatePicker from '..';
import {
  selectDateFromBody,
  openPanel,
  clearInput,
  nextYear,
  nextMonth,
  hasSelected,
  $$,
} from './utils';
import focusTest from '../../../tests/shared/focusTest';

describe('DatePicker', () => {
  focusTest(DatePicker);

  beforeEach(() => {
    document.body.outerHTML = '';
    MockDate.set(moment('2016-11-22'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('prop locale should works', async () => {
    const locale = {
      lang: {
        placeholder: 'Избери дата',
        rangePlaceholder: ['Начална дата', 'Крайна дата'],
        today: 'Днес',
        now: 'Сега',
        backToToday: 'Към днес',
        ok: 'Добре',
        clear: 'Изчистване',
        month: 'Месец',
        year: 'Година',
        timeSelect: 'Избор на час',
        dateSelect: 'Избор на дата',
        monthSelect: 'Избор на месец',
        yearSelect: 'Избор на година',
        decadeSelect: 'Десетилетие',
        previousMonth: 'Предишен месец (PageUp)',
        nextMonth: 'Следващ месец (PageDown)',
        previousYear: 'Последна година (Control + left)',
        nextYear: 'Следваща година (Control + right)',
        previousDecade: 'Предишно десетилетие',
        nextDecade: 'Следващо десетилетие',
        previousCentury: 'Последен век',
        nextCentury: 'Следващ век',
        yearFormat: 'YYYY',
        dateFormat: 'D M YYYY',
        dayFormat: 'D',
        dateTimeFormat: 'D M YYYY HH:mm:ss',
        monthBeforeYear: true,
      },
      timePickerLocale: {
        placeholder: 'Избор на час',
      },
    };
    const birthday = moment('2000-01-01', 'YYYY-MM-DD');
    const wrapper = mount({
      render() {
        return <DatePicker open locale={locale} value={birthday} />;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // Fix https://github.com/ant-design/ant-design/issues/8885
  it('control value after panel closed', async () => {
    const Test = {
      data() {
        return {
          cleared: false,
          value: moment(),
        };
      },
      methods: {
        onChange(value) {
          let cleared = this.cleared;

          if (cleared) {
            value = moment(moment(value).format('YYYY-MM-DD 12:12:12'));
            cleared = false;
          }

          if (!value) {
            cleared = true;
          }
          this.value = value;
          this.cleared = cleared;
        },
      },
      render() {
        return (
          <DatePicker
            showTime
            value={this.value}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={this.onChange}
          />
        );
      },
    };

    const wrapper = mount(Test, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      // clear input
      clearInput(wrapper);
    });
    await asyncExpect(() => {
      openPanel(wrapper);
    });
    await asyncExpect(() => {
      // selectDateFromBody时(点击其它元素)没有触发input blur事件，强制执行blur
      $$('.ant-calendar-input')[0].blur();
    }, 0);
    await asyncExpect(() => {
      selectDateFromBody(moment('2016-11-13'));
    }, 0);
    await asyncExpect(() => {
      expect($$('.ant-calendar-input')[0].value).toBe('2016-11-13 12:12:12');
    });
    await asyncExpect(() => {
      selectDateFromBody(moment('2016-11-14'));
    });
    await asyncExpect(() => {
      expect($$('.ant-calendar-input')[0].value).toBe('2016-11-14 12:12:12');
    });
  });

  it('triggers onChange only when date was selected', async () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <DatePicker onChange={handleChange} />;
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      openPanel(wrapper);
    }, 0);
    await asyncExpect(() => {
      nextYear();
    }, 1000);
    await asyncExpect(() => {
      expect(handleChange).not.toBeCalled();
    }, 0);
    await asyncExpect(() => {
      nextMonth();
    }, 0);
    await asyncExpect(() => {
      expect(handleChange).not.toBeCalled();
    });
    await asyncExpect(() => {
      selectDateFromBody(moment('2017-12-22'));
    }, 1000);
    await asyncExpect(() => {
      expect(handleChange).toBeCalled();
    }, 0);
  });

  it('clear input', async () => {
    const wrapper = mount(DatePicker, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      openPanel(wrapper);
    }, 0);
    await asyncExpect(() => {
      selectDateFromBody(moment('2016-11-23'));
    }, 100);
    await asyncExpect(() => {
      clearInput(wrapper);
    }, 1000);
    await asyncExpect(() => {
      openPanel(wrapper);
    }, 0);
    await asyncExpect(() => {
      expect(hasSelected(wrapper, moment('2016-11-22'))).toBe(true);
    }, 0);
  });
});
