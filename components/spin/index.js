import Spin, { setDefaultIndicator } from './Spin';
import Base from '../base';

export { SpinProps } from './Spin';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Spin.name, Spin);
};

export default Spin;
