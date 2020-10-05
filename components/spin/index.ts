import { App } from 'vue';
import Spin, { setDefaultIndicator } from './Spin';

export { default as SpinProps } from './spinProps';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function(app: App<Element>) {
  app.component(Spin.name, Spin);
};

export default Spin;
