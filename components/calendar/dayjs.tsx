import generateConfig from '../vc-picker/generate/dayjs';
import type { CalendarProps } from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar(generateConfig);

export type { CalendarProps };
export default Calendar;
