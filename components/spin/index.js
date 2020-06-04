import Spin, { setDefaultIndicator } from './Spin';

export { SpinProps } from './Spin';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function(app) {
  app.component(Spin.name, Spin);
};

export default Spin;
