import Statistic from './Statistic';
import Countdown from './Countdown';
import Base from '../base';

Statistic.Countdown = Countdown;
/* istanbul ignore next */
Statistic.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Statistic.name, Statistic);
  Vue.component(Statistic.Countdown.name, Statistic.Countdown);
};

export default Statistic;
