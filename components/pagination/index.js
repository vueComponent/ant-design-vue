import Pagination from './Pagination';
import Base from '../base';

export { PaginationProps, PaginationConfig } from './Pagination';

/* istanbul ignore next */
Pagination.install = function(app) {
  app.use(Base);
  app.component(Pagination.name, Pagination);
};

export default Pagination;
