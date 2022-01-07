import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import DatePicker from '..';
import focusTest from '../../../tests/shared/focusTest';
jest.mock('../../_util/Portal');
describe('DatePicker', () => {
  focusTest(DatePicker);

  beforeEach(() => {
    document.body.outerHTML = '';
    MockDate.set(dayjs('2016-11-22'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('prop locale should works', async () => {
    const locale = {
      lang: {
        locale: 'mk',
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
    const birthday = dayjs('2000-01-01', 'YYYY-MM-DD');
    const wrapper = mount({
      render() {
        return <DatePicker open locale={locale} value={birthday} />;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
