import Statistic from './Statistic';
import Countdown from './Countdown';
import { App } from 'vue';

Statistic.Countdown = Countdown;
/* istanbul ignore next */
Statistic.install = function(app: App) {
  app.component(Statistic.name, Statistic);
  app.component(Statistic.Countdown.name, Statistic.Countdown);
  return app;
};

export default Statistic;
