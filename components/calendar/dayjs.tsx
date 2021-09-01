import type { Dayjs } from 'dayjs';
import generateConfig from '../vc-picker/generate/dayjs';
import { withInstall } from '../_util/type';
import type { CalendarProps } from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar<Dayjs>(generateConfig);

export type { CalendarProps };
export default withInstall(Calendar);
