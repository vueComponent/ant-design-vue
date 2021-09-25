import type { Moment } from 'moment';
import generateConfig from '../vc-picker/generate/moment';
import { withInstall } from '../_util/type';
import type { CalendarProps } from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar<Moment>(generateConfig);

export type { CalendarProps };
export default withInstall(Calendar);
