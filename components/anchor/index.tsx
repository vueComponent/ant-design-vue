import type { App, Plugin } from 'vue';
import type { AnchorProps } from './Anchor';
import type { AnchorLinkProps, AnchorLinkItemProps } from './AnchorLink';
import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function (app: App) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
  return app;
};

export type { AnchorLinkProps, AnchorProps, AnchorLinkItemProps };
export { AnchorLink, AnchorLink as Link };

export default Anchor as typeof Anchor &
  Plugin & {
    readonly Link: typeof AnchorLink;
  };
