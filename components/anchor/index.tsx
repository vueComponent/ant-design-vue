import { App, Plugin } from 'vue';
import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

Anchor.Link = AnchorLink;

/* istanbul ignore next */
Anchor.install = function(app: App) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
  return app;
};

export default Anchor as typeof Anchor &
  Plugin & {
    readonly Link: typeof AnchorLink;
  };
