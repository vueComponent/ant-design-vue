import type { App, Plugin } from 'vue';
import Anchor, { AnchorProps } from './Anchor';
import AnchorLink, { AnchorLinkProps } from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function (app: App) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
  return app;
};

export { AnchorLinkProps, AnchorProps, AnchorLink, AnchorLink as Link };

export default Anchor as typeof Anchor &
  Plugin & {
    readonly Link: typeof AnchorLink;
  };
