import type { AnchorProps } from './Anchor';
import type { AnchorLinkProps } from './AnchorLink';
import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
export type { AnchorLinkProps, AnchorProps };

export { AnchorLink };

export default Object.assign(Anchor, {
  Link: AnchorLink,
});
