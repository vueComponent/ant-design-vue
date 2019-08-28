import { Row } from '../grid';
import Base from '../base';

/* istanbul ignore next */
Row.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Row.name, Row);
};

export default Row;
