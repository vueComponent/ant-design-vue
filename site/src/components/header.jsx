import { isZhCN } from '../utils/util';
import packageInfo from '../../../package.json';
import logo from '../assets/logo.svg';
import antDesignVue from '../assets/ant-design-vue.svg';
import { SearchOutlined } from '@ant-design/icons-vue';

export default {
  props: {
    name: String,
    searchData: Array,
  },
  data() {
    return {
      value: null,
    };
  },
  mounted() {
    this.initDocSearch(this.$i18n.locale);
  },
  methods: {
    handleClose(key) {
      localStorage.removeItem('jobs-notification-key');
      localStorage.setItem('jobs-notification-key', key);
    },
    initDocSearch(locale) {
      window.docsearch({
        apiKey: '92003c1d1d07beef165b08446f4224a3',
        indexName: 'antdv',
        inputSelector: '#search-box input',
        algoliaOptions: { facetFilters: [isZhCN(locale) ? 'cn' : 'en'] },
        transformData(hits) {
          hits.forEach(hit => {
            hit.url = hit.url.replace('www.antdv.com', window.location.host);
            hit.url = hit.url.replace('https:', window.location.protocol);
          });
          return hits;
        },
        debug: false, // Set debug to true if you want to inspect the dropdown
      });
    },
    handleClick() {
      const name = this.name;
      const path = this.$route.path;
      const newName = isZhCN(name) ? name.replace(/-cn\/?$/, '') : `${name}-cn`;
      this.$router.push({
        path: path.replace(name, newName),
      });
      this.$i18n.locale = isZhCN(name) ? 'en-US' : 'zh-CN';
    },
    onSelect(val) {
      this.$router.push(val);
      this.value = val;
    },
  },
  render() {
    const name = this.name;
    const isCN = isZhCN(name);
    const path = this.$route.path;
    const selectedKeys = path === '/jobs/list-cn' ? ['jobs'] : ['components'];
    return (
      <header id="header">
        <a-row>
          <a-col class="header-left" xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
            <router-link to={{ path: '/' }} id="logo">
              <img alt="logo" height="32" src={logo} />
              <img alt="logo" height="16" src={antDesignVue} />
            </router-link>
            <a-button
              ghost
              size="small"
              onClick={this.handleClick}
              class="header-lang-button"
              key="lang-button"
            >
              {isCN ? 'English' : '中文'}
            </a-button>
          </a-col>
          <a-col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
            <div id="search-box">
              <SearchOutlined />
              <a-input
                placeholder={isCN ? '搜索组件...' : 'input search text'}
                style="width: 200px"
              />
            </div>
            <span id="github-btn" class="github-btn">
              <a class="gh-btn" href="//github.com/vueComponent/ant-design-vue/" target="_blank">
                <span class="gh-ico" aria-hidden="true"></span>
                <span class="gh-text">Star</span>
              </a>
            </span>
            <a-button
              ghost
              size="small"
              onClick={this.handleClick}
              class="header-lang-button"
              key="lang-button"
            >
              {isCN ? 'English' : '中文'}
            </a-button>
            <a-select
              style="width: 100px"
              size="small"
              defaultValue={packageInfo.version}
              class="version"
            >
              <a-select-option value={packageInfo.version}>{packageInfo.version}</a-select-option>
              <a-select-option value="1.x" onClick={() => (location.href = 'https://1x.antdv.com')}>
                1.x
              </a-select-option>
            </a-select>
            <a-menu selectedKeys={selectedKeys} mode="horizontal" class="menu-site" id="nav">
              <a-menu-item key="components">
                <router-link to="/docs/vue/introduce">{isCN ? '组件' : 'Components'}</router-link>
              </a-menu-item>

              {isCN ? (
                <a-menu-item key="store">
                  <a
                    href="https://store.antdv.com/pro/"
                    target="_blank"
                    style="position: relative;"
                  >
                    商店
                    <a-badge color="red" style="position: absolute;top: -10px;right: -10px;" />
                  </a>
                </a-menu-item>
              ) : null}
              {isCN ? (
                <a-menu-item key="geektime">
                  <a
                    href="https://time.geekbang.org/course/intro/100024601?code=KHKYcoBU6vZa8nMglg7AWfDxxi3BWrz9INAzAY3umPk%3D"
                    target="_blank"
                    style="position: relative;"
                  >
                    Vue 实战教程
                    <a-badge color="red" style="position: absolute;top: -10px;right: -10px;" />
                  </a>
                </a-menu-item>
              ) : null}
              <a-menu-item key="sponsor">
                <router-link
                  to={{
                    path: isCN ? '/docs/vue/sponsor-cn/' : '/docs/vue/sponsor/',
                  }}
                >
                  {isCN ? '支持我们' : 'Support us'}
                </router-link>
              </a-menu-item>
              <a-sub-menu key="Ecosystem" title={isCN ? '更多' : 'More'}>
                <a-menu-item key="pro">
                  <a target="_blank" href="https://pro.antdv.com">
                    Pro (Admin)
                  </a>
                </a-menu-item>
                <a-menu-item key="design">
                  <router-link
                    to={{
                      path: isCN ? '/docs/vue/download-cn/' : '/docs/vue/download/',
                    }}
                  >
                    {isCN ? '设计资源' : 'Design Resources'}
                  </router-link>
                </a-menu-item>
                <a-menu-item key="vscode">
                  <a
                    target="_blank"
                    href="https://marketplace.visualstudio.com/items?itemName=ant-design-vue.vscode-ant-design-vue-helper"
                  >
                    VS Code Extension
                  </a>
                </a-menu-item>
                <a-menu-item key="awesome">
                  <a target="_blank" href="https://github.com/vueComponent/ant-design-vue-awesome">
                    Awesome
                  </a>
                </a-menu-item>
                <a-menu-item key="wechat">
                  <a-popover
                    placement="right"
                    content={
                      <img
                        width="160"
                        height="160"
                        alt="wechat"
                        src="https://qn.antdv.com/wechat.jpeg"
                      />
                    }
                  >
                    <a>{isCN ? '微信' : 'WeChat'}</a>
                  </a-popover>
                </a-menu-item>
                <a-menu-item key="qq">
                  <a>QQ 群1：217490093（3000人已满）</a>
                  <a>QQ 群2：809774695</a>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-col>
        </a-row>
      </header>
    );
  },
};
