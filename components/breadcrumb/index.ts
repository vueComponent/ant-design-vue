import type { App, Plugin } from 'vue';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

export type { BreadcrumbProps } from './Breadcrumb';
export type { BreadcrumbItemProps } from './BreadcrumbItem';
export type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator';

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

/* istanbul ignore next */
Breadcrumb.install = function (app: App) {
  app.component(Breadcrumb.name, Breadcrumb);
  app.component(BreadcrumbItem.name, BreadcrumbItem);
  app.component(BreadcrumbSeparator.name, BreadcrumbSeparator);
  return app;
};

export { BreadcrumbItem, BreadcrumbSeparator };
export default Breadcrumb as typeof Breadcrumb &
  Plugin & {
    readonly Item: typeof BreadcrumbItem;
    readonly Separator: typeof BreadcrumbSeparator;
  };
