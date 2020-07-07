import Statistic from './Statistic';
import Countdown from './Countdown';

Statistic.Countdown = Countdown;
/* istanbul ignore next */
Statistic.install = function(app) {
  app.component(Statistic.name, Statistic);
  app.component(Statistic.Countdown.name, Statistic.Countdown);
};

export default Statistic;
