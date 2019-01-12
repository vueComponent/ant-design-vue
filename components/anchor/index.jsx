import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

export { AnchorProps } from './Anchor';
export { AnchorLinkProps } from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function(Vue) {
  Vue.component(Anchor.name, Anchor);
  Vue.component(Anchor.Link.name, Anchor.Link);
};

export default Anchor;
