import { App } from 'vue';
import { Row } from '../grid';

/* istanbul ignore next */
Row.install = function(app: App) {
  app.component(Row.name, Row);
  return app;
};

export default Row;
