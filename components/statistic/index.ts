import type { App, Plugin } from 'vue';
import Statistic from './Statistic';
import Countdown from './Countdown';

export type { StatisticProps } from './Statistic';

/* istanbul ignore next */

export const StatisticCountdown = Statistic.Countdown;

export default Object.assign(Statistic, {
  Countdown,
});
