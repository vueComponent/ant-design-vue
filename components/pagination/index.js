import Pagination from './Pagination';

export { PaginationProps, PaginationConfig } from './Pagination';

/* istanbul ignore next */
Pagination.install = function(Vue) {
  Vue.component(Pagination.name, Pagination);
};

export default Pagination;
