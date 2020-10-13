import { Row } from '../grid';

/* istanbul ignore next */
Row.install = function(app) {
  app.component(Row.name, Row);
  return app;
};

export default Row;
