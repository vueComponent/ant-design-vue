import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

/* istanbul ignore next */
Breadcrumb.install = function(app) {
  app.component(Breadcrumb.name, Breadcrumb);
  app.component(BreadcrumbItem.name, BreadcrumbItem);
  app.component(BreadcrumbSeparator.name, BreadcrumbSeparator);
};

export default Breadcrumb;
