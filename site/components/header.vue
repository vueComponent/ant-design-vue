<script>
import { isZhCN } from '../util';
import sortBy from 'lodash/sortBy';
import packageInfo from '../../package.json';

export default {
  props: {
    name: String,
    searchData: Array,
  },
  data () {
    return {
      value: null,
    };
  },
  methods: {
    handleClick () {
      const name = this.name;
      const path = this.$route.path;
      const newName = isZhCN(name) ? name.replace(/-cn\/?$/, '') : `${name}-cn`;
      this.$router.push({
        path: path.replace(name, newName),
      });
      this.$i18n.locale = isZhCN(name) ? 'en-US' : 'zh-CN';
    },
    onSelect (val) {
      this.$router.push(val);
      this.value = val;
    },
  },
  render () {
    const name = this.name;
    const searchData = sortBy(this.searchData, ['title']);
    const isCN = isZhCN(name);
    return (
      <header id='header'>
        <a-row>
          <a-col class='header-left' xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
            <router-link to={{ path: '/ant-design-vue' }} id='logo'>
              <img alt='logo' height='32' src='https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/logo.png' />
              <span style='color: black;font-size: 16px;font-weight: 400;'>Ant Design Vue</span>
            </router-link>
            <a-button ghost size='small' onClick={this.handleClick} class='header-lang-button' key='lang-button'>
              {isCN ? 'English' : '中文'}
            </a-button>
          </a-col>
          <a-col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
            <div id='search-box' style='display: block'>
              <a-icon type='search' />
              <a-select
                ref='selectBox'
                placeholder={isCN ? '搜索组件...' : 'input search text'}
                style='width: 200px'
                defaultActiveFirstOption={false}
                showArrow={false}
                showSearch
                onSelect={this.onSelect}
                optionFilterProp='children'
                key={this.value}
              >
                {
                  searchData.map(({ title, subtitle, url }) =>
                    <a-select-option key={url}>
                      {title} {isCN && subtitle}
                    </a-select-option>)
                }
              </a-select>
            </div>
            <a-button ghost size='small' onClick={this.handleClick} class='header-lang-button' key='lang-button'>
              {isCN ? 'English' : '中文'}
            </a-button>
            <a-select size='small' defaultValue={packageInfo.version} class='version'>
              <a-select-option value={packageInfo.version}>{packageInfo.version}</a-select-option>
            </a-select>
            <a-menu selectedKeys={['components']} mode='horizontal' class='menu-site' id='nav'>
              <a-menu-item key='components'>
                {isCN ? '组件' : 'Components'}
              </a-menu-item>
              <a-menu-item key='github'>
                <a href='https://github.com/vueComponent/ant-design-vue'>GitHub</a>
              </a-menu-item>
              <a-menu-item key='sponsor'>
                <a-popover placement='bottom'>
                  <template slot='content'>
                    <img
                      width='160'
                      height='163'
                      alt='dingding'
                      src='https://user-images.githubusercontent.com/4122593/50038786-571eaf80-0060-11e9-98a1-ea202fc60859.png'
                    />
                  </template>
                  <a>
                    <a-icon type='dingding' style={{ color: '#1890ff' }}/>
                    {isCN ? '钉钉服务群' : 'Ding Group QR Code'}
                  </a>
                </a-popover>
              </a-menu-item>
            </a-menu>
          </a-col>
        </a-row>
      </header>
    );
  },
};
</script>
