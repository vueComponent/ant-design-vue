import { Col } from '../grid';
import Base from '../base';
/* istanbul ignore next */
Col.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Col.name, Col);
};

export default Col;
