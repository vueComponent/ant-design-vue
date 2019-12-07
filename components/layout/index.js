import Layout from './layout';
import Sider from './Sider';
import Base from '../base';

Layout.Sider = Sider;

/* istanbul ignore next */
Layout.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Layout.name, Layout);
  Vue.component(Layout.Header.name, Layout.Header);
  Vue.component(Layout.Footer.name, Layout.Footer);
  Vue.component(Layout.Sider.name, Layout.Sider);
  Vue.component(Layout.Content.name, Layout.Content);
};
export default Layout;
