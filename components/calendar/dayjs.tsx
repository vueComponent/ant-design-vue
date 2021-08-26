import type { Dayjs } from 'dayjs';
import generateConfig from '../vc-picker/generate/dayjs';
import { withInstall } from '../_util/type';
import generateCalendar, { CalendarProps } from './generateCalendar';

const Calendar = generateCalendar<Dayjs>(generateConfig);

export { CalendarProps };
export default withInstall(Calendar);
