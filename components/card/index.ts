import Card from './Card';
import Meta from './Meta';
import Grid from './Grid';

export type { CardProps } from './Card';

/* istanbul ignore next */

export { Meta as CardMeta, Grid as CardGrid };

export default Object.assign(Card, {
  Meta,
  Grid,
});
