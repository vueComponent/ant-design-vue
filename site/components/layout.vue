<script>
import { enquireScreen } from 'enquire-js';
import AllDemo from '../demo';
import Header from './header';
import Footer from './footer';
import CarbonAds from './CarbonAds';
import Geektime from './geektime';
import GeektimeAds from './geektime_ads';
import Sponsors from './sponsors';
import zhCN from 'antd/locale-provider/zh_CN';
import enUS from 'antd/locale-provider/default';
import sortBy from 'lodash/sortBy';
import { isZhCN } from '../util';
import { Provider, create } from '../../components/_util/store';
import NProgress from 'nprogress';
import MobileMenu from '../../components/vc-drawer/src';

const docsList = [
  { key: 'introduce', enTitle: 'Ant Design of Vue', title: 'Ant Design of Vue' },
  { key: 'getting-started', enTitle: 'Getting Started', title: '快速上手' },
  { key: 'use-with-vue-cli', enTitle: 'Use in vue-cli', title: '在 vue-cli 中使用' },
  { key: 'customize-theme', enTitle: 'Customize Theme', title: '定制主题' },
  { key: 'changelog', enTitle: 'Change Log', title: '更新日志' },
  { key: 'i18n', enTitle: 'Internationalization', title: '国际化' },
  { key: 'faq', enTitle: 'FAQ', title: '常见问题' },
  { key: 'sponsor', enTitle: 'Sponsor', title: '支持我们' },
  { key: 'download', enTitle: 'Download Design Resources', title: '下载设计资源' },
];

let isMobile = false;
const isGitee = window.location.host.indexOf('gitee.io') > -1;
enquireScreen(b => {
  isMobile = b;
});

export default {
  props: {
    name: String,
    showDemo: Boolean,
    showApi: Boolean,
  },
  data() {
    this.store = create({
      currentSubMenu: [],
    });
    this.subscribe();
    return {
      showSideBars: true,
      currentSubMenu: [],
      sidebarHeight: document.documentElement.offsetHeight,
      isMobile,
    };
  },
  provide() {
    return {
      demoContext: this,
    };
  },
  watch: {
    '$route.path': function() {
      this.store.setState({ currentSubMenu: [] });
      this.addSubMenu();
    },
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    clearTimeout(this.timer);
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedResize && this.debouncedResize.cancel) {
      this.debouncedResize.cancel();
    }
  },
  mounted() {
    if (isGitee) {
      this.$info({
        title: '提示',
        content: '访问国内镜像站点的用户请访问 antdv.com 站点',
        okText: '立即跳转',
        onOk() {
          location.href = 'https://www.antdv.com';
        },
      });
    }

    this.$nextTick(() => {
      this.addSubMenu();
      const nprogressHiddenStyle = document.getElementById('nprogress-style');
      if (nprogressHiddenStyle) {
        this.timer = setTimeout(() => {
          nprogressHiddenStyle.parentNode.removeChild(nprogressHiddenStyle);
        }, 0);
      }
      enquireScreen(b => {
        this.isMobile = !!b;
      });
    });
  },
  methods: {
    addSubMenu() {
      if (this.$route.path.indexOf('/docs/vue/') !== -1) {
        this.$nextTick(() => {
          const menus = [];
          const doms = [...this.$refs.doc.querySelectorAll(['h2', 'h3'])];
          doms.forEach(dom => {
            const id = dom.id;
            if (id) {
              const title = dom.textContent.split('#')[0].trim();
              menus.push({ cnTitle: title, usTitle: title, id });
            }
          });
          this.currentSubMenu = menus;
        });
      }
    },
    subscribe() {
      const { store } = this;
      this.unsubscribe = store.subscribe(() => {
        this.currentSubMenu = this.store.getState().currentSubMenu;
      });
    },
    getSubMenu(isCN) {
      const currentSubMenu = this.currentSubMenu;
      const lis = [];
      currentSubMenu.forEach(({ cnTitle, usTitle, id }) => {
        const title = isCN ? cnTitle : usTitle;
        lis.push(<a-anchor-link key={id} href={`#${id}`} title={title} />);
      });
      const showApi = this.$route.path.indexOf('/components/') !== -1;
      return (
        <a-anchor offsetTop={100} class="demo-anchor">
          {lis}
          {showApi ? <a-anchor-link key="API" title="API" href="#API" /> : ''}
        </a-anchor>
      );
    },
    getDocsMenu(isCN, pagesKey) {
      const docsMenu = [];
      docsList.forEach(({ key, enTitle, title }, index) => {
        const k = isCN ? `${key}-cn` : key;
        pagesKey.push({ name: k, url: `/docs/vue/${k}/`, title: isCN ? title : enTitle });
        docsMenu.push(
          <a-menu-item key={k}>
            <router-link to={`/docs/vue/${k}/`}>{isCN ? title : enTitle}</router-link>
          </a-menu-item>,
        );
      });
      return docsMenu;
    },
    resetDocumentTitle(component, name, isCN) {
      let titleStr = 'Ant Design Vue';
      if (component) {
        const { subtitle, title } = component;
        const componentName = isCN ? subtitle + ' ' + title : title;
        titleStr = componentName + ' - ' + titleStr;
      } else {
        const currentKey = docsList.filter(item => {
          return item.key === name;
        });
        if (currentKey.length) {
          titleStr = (isCN ? currentKey[0]['title'] : currentKey[0]['enTitle']) + ' - ' + titleStr;
        }
      }
      document.title = titleStr;
    },
    mountedCallback() {
      NProgress.done();
      document.documentElement.scrollTop = 0;
    },
  },

  render() {
    const name = this.name;
    const isCN = isZhCN(name);
    const titleMap = {};
    const menuConfig = {
      General: [],
      Layout: [],
      Navigation: [],
      'Data Entry': [],
      'Data Display': [],
      Feedback: [],
      Other: [],
    };
    const pagesKey = [];
    let prevPage = null;
    let nextPage = null;
    const searchData = [];
    for (const [title, d] of Object.entries(AllDemo)) {
      const type = d.type || 'Other';
      const key = `${title.replace(/(\B[A-Z])/g, '-$1').toLowerCase()}`;
      titleMap[key] = title;
      AllDemo[title].key = key;
      menuConfig[type] = menuConfig[type] || [];
      menuConfig[type].push(d);
    }
    const docsMenu = this.getDocsMenu(isCN, pagesKey);
    const reName = name.replace(/-cn\/?$/, '');
    const MenuGroup = [];
    for (const [type, menus] of Object.entries(menuConfig)) {
      const MenuItems = [];
      sortBy(menus, ['title']).forEach(({ title, subtitle }) => {
        const linkValue = isCN
          ? [<span>{title}</span>, <span class="chinese">{subtitle}</span>]
          : [<span>{title}</span>];
        let key = `${title.replace(/(\B[A-Z])/g, '-$1').toLowerCase()}`;
        if (isCN) {
          key = `${key}-cn`;
        }
        pagesKey.push({
          name: key,
          url: `/components/${key}/`,
          title: isCN ? `${title} ${subtitle}` : title,
        });
        searchData.push({
          title,
          subtitle,
          url: `/components/${key}/`,
        });
        MenuItems.push(
          <a-menu-item key={key}>
            <router-link to={`/components/${key}/`}>{linkValue}</router-link>
          </a-menu-item>,
        );
      });
      MenuGroup.push(<a-menu-item-group title={type}>{MenuItems}</a-menu-item-group>);
    }
    pagesKey.forEach((item, index) => {
      if (item.name === name) {
        prevPage = pagesKey[index - 1];
        nextPage = pagesKey[index + 1];
      }
    });
    let locale = zhCN;
    if (!isCN) {
      locale = enUS;
    }
    const config = AllDemo[titleMap[reName]];
    this.resetDocumentTitle(config, reName, isCN);
    const { isMobile } = this;
    return (
      <div class="page-wrapper">
        <Header searchData={searchData} name={name} />
        <a-locale-provider locale={locale}>
          <div class="main-wrapper">
            <a-row>
              {isMobile ? (
                <MobileMenu ref="sidebar" wrapperClassName="drawer-wrapper">
                  <a-menu
                    class="aside-container menu-site"
                    selectedKeys={[name]}
                    defaultOpenKeys={['Components']}
                    inlineIndent={40}
                    mode="inline"
                  >
                    {docsMenu}
                    <a-sub-menu title={`Components(${searchData.length})`} key="Components">
                      {MenuGroup}
                    </a-sub-menu>
                  </a-menu>
                </MobileMenu>
              ) : (
                <a-col
                  ref="sidebar"
                  class="site-sidebar main-menu"
                  xxl={4}
                  xl={5}
                  lg={5}
                  md={6}
                  sm={8}
                  xs={12}
                >
                  <a-affix>
                    <section class="main-menu-inner">
                      <Sponsors isCN={isCN} />
                      <a-menu
                        class="aside-container menu-site"
                        selectedKeys={[name]}
                        defaultOpenKeys={['Components']}
                        inlineIndent={40}
                        mode="inline"
                      >
                        {docsMenu}
                        <a-sub-menu title={`Components(${searchData.length})`} key="Components">
                          {MenuGroup}
                        </a-sub-menu>
                      </a-menu>
                    </section>
                  </a-affix>
                </a-col>
              )}
              <a-col xxl={20} xl={19} lg={19} md={18} sm={24} xs={24}>
                <section class="main-container main-container-component">
                  <CarbonAds isMobile={isMobile} />
                  <GeektimeAds isMobile={isMobile} />
                  {!isMobile ? (
                    <div class="toc-affix" style="width: 150px;">
                      {this.getSubMenu(isCN)}
                    </div>
                  ) : null}
                  {this.showDemo ? (
                    <Provider store={this.store} key={isCN ? 'cn' : 'en'}>
                      <router-view
                        class={`demo-cols-${config.cols || 2}`}
                        {...{
                          directives: [
                            {
                              name: 'mountedCallback',
                              value: this.mountedCallback,
                            },
                          ],
                        }}
                      ></router-view>
                    </Provider>
                  ) : (
                    ''
                  )}
                  {this.showApi ? (
                    <div class="markdown api-container" ref="doc">
                      <router-view
                        {...{
                          directives: [
                            {
                              name: 'mountedCallback',
                              value: this.mountedCallback,
                            },
                          ],
                        }}
                      ></router-view>
                    </div>
                  ) : (
                    ''
                  )}
                </section>
                <section class="prev-next-nav">
                  {prevPage ? (
                    <router-link class="prev-page" to={`${prevPage.url}`}>
                      <a-icon type="left" />
                      &nbsp;&nbsp;{prevPage.title}
                    </router-link>
                  ) : (
                    ''
                  )}
                  {nextPage ? (
                    <router-link class="next-page" to={`${nextPage.url}`}>
                      {nextPage.title}&nbsp;&nbsp;
                      <a-icon type="right" />
                    </router-link>
                  ) : (
                    ''
                  )}
                </section>
                <Footer ref="footer" isCN={isCN} />
              </a-col>
            </a-row>
          </div>
        </a-locale-provider>
        {name.indexOf('back-top') === -1 ? <a-back-top /> : null}
        {isCN && <Geektime isMobile={isMobile} />}
      </div>
    );
  },
};
</script>
