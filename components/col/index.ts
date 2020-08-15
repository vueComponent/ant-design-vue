import { App } from 'vue';
import { Col } from '../grid';
/* istanbul ignore next */
Col.install = function(app: App) {
  app.component(Col.name, Col);
};

export default Col;
