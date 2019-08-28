import Anchor from './Anchor';
import AnchorLink from './AnchorLink';
import Base from '../base';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Anchor.name, Anchor);
  Vue.component(Anchor.Link.name, Anchor.Link);
};
export { AnchorProps } from './Anchor';
export { AnchorLinkProps } from './AnchorLink';
export default Anchor;
