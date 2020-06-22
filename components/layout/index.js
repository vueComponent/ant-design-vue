import Layout from './layout';
import Sider from './Sider';

Layout.Sider = Sider;

/* istanbul ignore next */
Layout.install = function(app) {
  app.component(Layout.name, Layout);
  app.component(Layout.Header.name, Layout.Header);
  app.component(Layout.Footer.name, Layout.Footer);
  app.component(Layout.Sider.name, Layout.Sider);
  app.component(Layout.Content.name, Layout.Content);
};
export default Layout;
