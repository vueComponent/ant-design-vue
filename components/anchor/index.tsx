import type { App, Plugin } from 'vue';
import type { AnchorProps } from './Anchor';
import type { AnchorLinkProps, AnchorLinkItemProps } from './AnchorLink';
import Anchor from './Anchor';
import AAnchorLink from './AnchorLink';

Anchor.Link = AAnchorLink;

/* istanbul ignore next */
Anchor.install = function (app: App) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
  return app;
};

export type { AnchorLinkProps, AnchorProps, AnchorLinkItemProps };
export { AAnchorLink, AAnchorLink as Link };

export default Anchor as typeof Anchor &
  Plugin & {
    readonly Link: typeof AAnchorLink;
  };
