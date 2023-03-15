<script>
import { isZhCN } from '../utils/util';
import docsearch from 'docsearch.js';
import packageInfo from '../../package.json';
import logo from '../public/logo.svg';
import antDesignVue from '../public/ant-design-vue.svg';

export default {
  inject: {
    demoContext: { default: {} },
  },
  props: {
    name: String,
    searchData: Array,
  },
  data() {
    return {
      visibleAdblockBanner: !!this.demoContext.blocked,
      value: null,
      showTopBanner: !localStorage.getItem('notification-key-surelyform'),
    };
  },
  watch: {
    'demoContex.blocked': function blocked(val) {
      this.visibleAdblockBanner = !!val;
    },
  },
  mounted() {
    this.initDocSearch(this.$i18n.locale);
  },
  methods: {
    handleClose(key) {
      localStorage.removeItem(`notification-key-${key}`);
      localStorage.setItem(`notification-key-${key}`, true);
      this.showTopBanner = false;
    },
    initDocSearch(locale) {
      docsearch({
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
    closeTopBanner() {},
    changeVersion(v) {
      location.href = `https://${v}.antdv.com${this.$route.fullPath}`;
    },
  },
  render() {
    const name = this.name;
    const visibleAdblockBanner = false; // this.visibleAdblockBanner;
    const isCN = isZhCN(name);
    const path = this.$route.path;
    const selectedKeys = path === '/jobs/list-cn' ? ['jobs'] : ['components'];
    return (
      <header id="header">
        {visibleAdblockBanner && (
          <div class="adblock-banner">
            {isZhCN
              ? '我们检测到你可能使用了 AdBlock 或 Adblock Plus，它会影响到正常功能的使用（如复制、展开代码等）。'
              : 'We have detected that you may use AdBlock or Adblock Plus, which will affect the use of normal functions (such as copying, expanding code, etc.)'}
            <br />
            {isZhCN
              ? '你可以将 Ant Design Vue 加入白名单，以便我们更好地提供服务。'
              : 'You can add Ant Design Vue to the whitelist so that we can provide better services.'}

            <CloseOutlined class="close-icon" onClick={() => (this.visibleAdblockBanner = false)} />
          </div>
        )}
        {isCN && this.showTopBanner && (
          <div class="global-notification">
            <span>
              Surely Form 私有化部署专属的调研，投票、NPS、报名等系统，访问 &nbsp;&nbsp;
              <a href="https://form.antdv.com/" target="_blank">
                form.antdv.com
              </a>
              &nbsp;&nbsp;立即体验
            </span>
            <a-icon
              type="close"
              style="position: absolute;top: 13px;right: 15px;"
              onClick={() => this.handleClose('surelyform')}
            />
          </div>
        )}
        {/* {!isCN && this.showTopBanner && (
          <div class="global-notification">
            <span>
              v3 beta is out! Discover more about it on &nbsp;
              <a href="https://next.antdv.com/" target="_blank">
                next.antdv.com
              </a>
              &nbsp;
            </span>
            <a-icon
              type="close"
              style="position: absolute;top: 8px;right: 15px;"
              onClick={() => this.handleClose('next')}
            />
          </div>
        )} */}
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
              <a-icon type="search" />
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
            <a-select size="small" defaultValue={packageInfo.version} class="version">
              <a-select-option value={packageInfo.version}>{packageInfo.version}</a-select-option>
              <a-select-option value="2.x" onClick={() => this.changeVersion('2x')}>
                v2 LST
              </a-select-option>
              <a-select-option value="www" onClick={() => this.changeVersion('www')}>
                v3 Current (Latest Features)
              </a-select-option>
            </a-select>
            <a-menu selectedKeys={selectedKeys} mode="horizontal" class="menu-site" id="nav">
              <a-menu-item key="components">
                <router-link to="/docs/vue/introduce">{isCN ? '组件' : 'Components'}</router-link>
              </a-menu-item>
              <a-sub-menu
                v-if="isZhCN"
                key="advanced"
                title={
                  <span style="position: relative">
                    高级组件
                    <a-badge color="red" style="position: absolute; top: -35px; right: -15px" />
                  </span>
                }
              >
                <a-menu-item key="surely-table">
                  <a
                    href="https://www.surely.cool"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="position: relative;"
                  >
                    Surely Table
                  </a>
                </a-menu-item>
                <a-menu-item key="surely-form">
                  <a
                    href="https://form.antdv.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="position: relative;"
                  >
                    Surely Form
                  </a>
                </a-menu-item>
              </a-sub-menu>
              {isCN ? (
                <a-menu-item key="store">
                  <a
                    href="https://store.antdv.com/pro/"
                    target="_blank"
                    style="position: relative;"
                  >
                    商店
                  </a>
                </a-menu-item>
              ) : (
                <a-menu-item key="store">
                  <a
                    href="https://store.antdv.com/pro/?lang=en"
                    target="_blank"
                    style="position: relative;"
                  >
                    Store{' '}
                  </a>
                </a-menu-item>
              )}
              {isCN ? (
                <a-menu-item key="geektime">
                  <a
                    href="https://time.geekbang.org/course/intro/100024601?code=KHKYcoBU6vZa8nMglg7AWfDxxi3BWrz9INAzAY3umPk%3D"
                    target="_blank"
                    style="position: relative;"
                  >
                    Vue 实战教程
                  </a>
                </a-menu-item>
              ) : null}
              <a-menu-item key="sponsor">
                <router-link to={{ path: isCN ? '/docs/vue/sponsor-cn/' : '/docs/vue/sponsor/' }}>
                  {isCN ? '支持我们' : 'Support us'}
                </router-link>
              </a-menu-item>
              <a-sub-menu key="Ecosystem" title={isCN ? '更多' : 'More'}>
                <a-menu-item key="pro">
                  <a target="_blank" href="https://pro.antdv.com">
                    Pro (Admin)
                  </a>
                </a-menu-item>
                <a-menu-item key="vip">
                  <a target="_blank" href="https://store.antdv.com/pro/">
                    Pro For VIP
                  </a>
                </a-menu-item>
                <a-menu-item key="design">
                  <router-link
                    to={{ path: isCN ? '/docs/vue/download-cn/' : '/docs/vue/download/' }}
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
                  <a-popover placement="right">
                    <template slot="content">
                      <img
                        width="160"
                        height="160"
                        alt="wechat"
                        src="https://qn.antdv.com/wechat.jpeg"
                      />
                    </template>
                    <a>{isCN ? '微信' : 'WeChat'}</a>
                  </a-popover>
                </a-menu-item>
                <a-menu-item key="qq1">
                  <a>QQ 1群(217490093) 已满</a>
                </a-menu-item>
                <a-menu-item key="qq2">
                  <a>QQ 2群(809774695) 已满</a>
                </a-menu-item>
                <a-menu-item key="qq3">
                  <a>QQ 3群(927828249)</a>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-col>
        </a-row>
      </header>
    );
  },
};
</script>

<style scope>
.adblock-banner {
  position: relative;
  z-index: 100;
  min-width: 1000px;
  padding: 16px;
  line-height: 28px;
  color: #8590a6;
  text-align: center;
  background-color: #ebebeb;
}
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
}
.global-notification {
  text-align: center;
  background: #001529;
  padding: 20px 0;
  font-size: 16px;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: #fff;
  z-index: 99;
}
.global-notification a {
  color: #177ddc;
}
</style>
