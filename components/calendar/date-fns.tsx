import generateConfig from '../vc-picker/generate/dateFns';
import type { CalendarProps } from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar<Date>(generateConfig);

export type { CalendarProps };
export default Calendar;
