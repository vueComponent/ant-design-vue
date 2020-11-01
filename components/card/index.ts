import { App, Plugin } from 'vue';
import Card from './Card';
import Meta from './Meta';
import Grid from './Grid';

Card.Meta = Meta;
Card.Grid = Grid;

/* istanbul ignore next */
Card.install = function(app: App) {
  app.component(Card.name, Card);
  app.component(Meta.name, Meta);
  app.component(Grid.name, Grid);
  return app;
};

export default Card as typeof Card &
  Plugin & {
    readonly Meta: typeof Meta;
    readonly Grid: typeof Grid;
  };
