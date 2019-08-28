import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import Base from '../base';

Breadcrumb.Item = BreadcrumbItem;

/* istanbul ignore next */
Breadcrumb.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Breadcrumb.name, Breadcrumb);
  Vue.component(BreadcrumbItem.name, BreadcrumbItem);
};

export default Breadcrumb;
