import { Row } from '../grid';

/* istanbul ignore next */
Row.install = function(Vue) {
  Vue.component(Row.name, Row);
};

export default Row;
