<script>
import { isZhCN } from '../util'
import sortBy from 'lodash/sortBy'
export default {
  props: {
    name: String,
    searchData: Array,
  },
  data () {
    return {
      value: null,
    }
  },
  methods: {
    handleClick () {
      const name = this.name
      const path = this.$route.path
      const newName = isZhCN(name) ? name.replace(/-cn\/?$/, '') : `${name}-cn`
      this.$router.push({
        path: path.replace(name, newName),
      })
    },
    onSelect (val) {
      this.$router.push(val)
      this.value = val
    },
  },
  render () {
    const name = this.name
    const searchData = sortBy(this.searchData, ['title'])
    const isCN = isZhCN(name)
    return (
      <header id='header'>
        <a-row>
          <a-col xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
            <router-link to={{ path: '/ant-design' }} id='logo'>
              <img alt='logo' height='32' src='https://raw.githubusercontent.com/vueComponent/ant-design/master/logo.png' />
              <span>  VUE-ANTD</span>
            </router-link>
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
            <a-menu selectedKeys={['components']} mode='horizontal' class='menu-site' id='nav'>
              <a-menu-item key='components'>
                {isCN ? '组件' : 'Components'}
              </a-menu-item>
              <a-menu-item key='github'>
                <a href='https://github.com/vueComponent/ant-design'>GitHub</a>
              </a-menu-item>
            </a-menu>
          </a-col>
        </a-row>
      </header>
    )
  },
}
</script>
