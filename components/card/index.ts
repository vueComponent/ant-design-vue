import Card from './Card';
import Meta from './Meta';
import Grid from './Grid';
Card.Meta = Meta;
Card.Grid = Grid;

/* istanbul ignore next */
Card.install = function(app) {
  app.component(Card.name, Card);
  app.component(Meta.name, Meta);
  app.component(Grid.name, Grid);
};

export default Card;
