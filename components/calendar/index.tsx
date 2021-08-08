import { Moment } from 'moment';
import momentGenerateConfig from '../vc-picker/generate/moment';
import generateCalendar, { CalendarProps } from './generateCalendar';

const Calendar = generateCalendar<Moment>(momentGenerateConfig);

export { CalendarProps };
export default Calendar;
