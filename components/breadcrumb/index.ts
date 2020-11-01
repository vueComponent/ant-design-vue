import { App, Plugin } from 'vue';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

/* istanbul ignore next */
Breadcrumb.install = function(app: App) {
  app.component(Breadcrumb.name, Breadcrumb);
  app.component(BreadcrumbItem.name, BreadcrumbItem);
  app.component(BreadcrumbSeparator.name, BreadcrumbSeparator);
  return app;
};

export default Breadcrumb as typeof Breadcrumb &
  Plugin & {
    readonly Item: typeof BreadcrumbItem;
    readonly Separator: typeof BreadcrumbSeparator;
  };
