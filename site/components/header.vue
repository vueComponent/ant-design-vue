<script>
import { isZhCN } from '../util';
import sortBy from 'lodash/sortBy';
import packageInfo from '../../package.json';
import logo from '../logo.svg';
import antDesignVue from '../ant-design-vue.svg';

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
  methods: {
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
    const searchData = sortBy(this.searchData, ['title']);
    const isCN = isZhCN(name);
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
              <a-icon type="search" />
              <a-select
                ref="selectBox"
                placeholder={isCN ? '搜索组件...' : 'input search text'}
                style="width: 200px"
                defaultActiveFirstOption={false}
                showArrow={false}
                showSearch
                onSelect={this.onSelect}
                optionFilterProp="children"
                key={this.value}
              >
                {searchData.map(({ title, subtitle, url }) => (
                  <a-select-option key={url}>
                    {title} {isCN && subtitle}
                  </a-select-option>
                ))}
              </a-select>
            </div>
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
            </a-select>
            <a-menu selectedKeys={['components']} mode="horizontal" class="menu-site" id="nav">
              <a-menu-item key="components">{isCN ? '组件' : 'Components'}</a-menu-item>
              <a-sub-menu key="Ecosystem" title={isCN ? '生态系统' : 'Ecosystem'}>
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
                <a-menu-item key="github">
                  <a target="_blank" href="https://github.com/vueComponent/ant-design-vue">
                    GitHub
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
                <a-menu-item key="qq">
                  <a-popover placement="right">
                    <template slot="content">
                      <img width="160" height="160" alt="qq" src="https://qn.antdv.com/qq.png" />
                    </template>
                    <a>{isCN ? 'QQ(217490093)' : 'QQ(217490093)'}</a>
                  </a-popover>
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item key="sponsor">
                <router-link to={{ path: isCN ? '/docs/vue/sponsor-cn/' : '/docs/vue/sponsor/' }}>
                  {isCN ? '支持我们' : 'Support us'}
                </router-link>
              </a-menu-item>
            </a-menu>
          </a-col>
        </a-row>
      </header>
    );
  },
};
</script>
