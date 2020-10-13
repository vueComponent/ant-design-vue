import { App } from 'vue';
import Statistic from './Statistic';
import Countdown from './Countdown';

Statistic.Countdown = Countdown;
/* istanbul ignore next */
Statistic.install = function(app: App) {
  app.component(Statistic.name, Statistic);
  app.component(Statistic.Countdown.name, Statistic.Countdown);
  return app;
};

export default Statistic;
