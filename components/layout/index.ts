import type { App, Plugin } from 'vue';
import Layout from './layout';
import Sider from './Sider';

export type { BasicProps as LayoutProps } from './layout';
export type { SiderProps } from './Sider';

Layout.Sider = Sider;

/* istanbul ignore next */
Layout.install = function (app: App) {
  app.component(Layout.name, Layout);
  app.component(Layout.Header.name, Layout.Header);
  app.component(Layout.Footer.name, Layout.Footer);
  app.component(Layout.Sider.name, Layout.Sider);
  app.component(Layout.Content.name, Layout.Content);
  return app;
};
export const LayoutHeader = Layout.Header;
export const LayoutFooter = Layout.Footer;
export const LayoutSider = Layout.Sider;
export const LayoutContent = Layout.Content;

export default Layout as typeof Layout &
  Plugin & {
    readonly Sider: typeof Sider;
  };
