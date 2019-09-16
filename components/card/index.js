import Card from './Card';
import Meta from './Meta';
import Grid from './Grid';
import Base from '../base';
Card.Meta = Meta;
Card.Grid = Grid;

/* istanbul ignore next */
Card.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Card.name, Card);
  Vue.component(Meta.name, Meta);
  Vue.component(Grid.name, Grid);
};

export default Card;
