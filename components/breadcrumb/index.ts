import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

export type { BreadcrumbProps } from './Breadcrumb';
export type { BreadcrumbItemProps } from './BreadcrumbItem';
export type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator';

/* istanbul ignore next */

export { BreadcrumbItem, BreadcrumbSeparator };

export default Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
});
