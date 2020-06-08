import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function(app) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
};
export { AnchorProps } from './Anchor';
export { AnchorLinkProps } from './AnchorLink';
export default Anchor;
