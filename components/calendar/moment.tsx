import type { Moment } from 'moment';
import generateConfig from '../vc-picker/generate/moment';
import { withInstall } from '../_util/type';
import generateCalendar, { CalendarProps } from './generateCalendar';

const Calendar = generateCalendar<Moment>(generateConfig);

export { CalendarProps };
export default withInstall(Calendar);
