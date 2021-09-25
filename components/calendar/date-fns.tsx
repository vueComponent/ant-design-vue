import generateConfig from '../vc-picker/generate/dateFns';
import { withInstall } from '../_util/type';
import type { CalendarProps } from './generateCalendar';
import generateCalendar from './generateCalendar';

const Calendar = generateCalendar<Date>(generateConfig);

export type { CalendarProps };
export default withInstall(Calendar);
