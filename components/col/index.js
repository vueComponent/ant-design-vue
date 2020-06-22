import { Col } from '../grid';
/* istanbul ignore next */
Col.install = function(app) {
  app.component(Col.name, Col);
};

export default Col;
