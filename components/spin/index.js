import Spin, { setDefaultIndicator } from './Spin';

export { SpinProps } from './Spin';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function(Vue) {
  Vue.component(Spin.name, Spin);
};

export default Spin;
