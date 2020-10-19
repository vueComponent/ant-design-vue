import { App } from 'vue';
import Pagination from './Pagination';

export { PaginationProps, PaginationConfig } from './Pagination';

/* istanbul ignore next */
Pagination.install = function(app: App) {
  app.component(Pagination.name, Pagination);
  return app;
};

export default Pagination;
