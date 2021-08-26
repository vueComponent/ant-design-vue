import generateConfig from '../vc-picker/generate/dateFns';
import { withInstall } from '../_util/type';
import generateCalendar, { CalendarProps } from './generateCalendar';

const Calendar = generateCalendar<Date>(generateConfig);

export { CalendarProps };
export default withInstall(Calendar);
