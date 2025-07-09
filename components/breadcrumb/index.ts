import type { App, Plugin } from 'vue';
import Breadcrumb from './Breadcrumb';
import ABreadcrumbItem from './BreadcrumbItem';
import ABreadcrumbSeparator from './BreadcrumbSeparator';

export type { BreadcrumbProps } from './Breadcrumb';
export type { BreadcrumbItemProps } from './BreadcrumbItem';
export type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator';

Breadcrumb.Item = ABreadcrumbItem;
Breadcrumb.Separator = ABreadcrumbSeparator;

/* istanbul ignore next */
Breadcrumb.install = function (app: App) {
  app.component(Breadcrumb.name, Breadcrumb);
  app.component(ABreadcrumbItem.name, ABreadcrumbItem);
  app.component(ABreadcrumbSeparator.name, ABreadcrumbSeparator);
  return app;
};

export { ABreadcrumbItem, ABreadcrumbSeparator };
export default Breadcrumb as typeof Breadcrumb &
  Plugin & {
    readonly Item: typeof ABreadcrumbItem;
    readonly Separator: typeof ABreadcrumbSeparator;
  };
