<script>
export default {
  props: {
    num: Number,
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick () {
      const { lang, name } = this.$route.params
      this.$router.push({
        path: `/${lang === 'cn' ? 'us' : 'cn'}/components/${name}`,
      })
    },
  },
  render () {
    const { lang } = this.$route.params
    return (
      <header id='header'>
        <a-row>
          <a-col xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
            <router-link to={{ path: `/${lang}` }} id='logo'>
              <img alt='logo' src='https://raw.githubusercontent.com/vueComponent/ant-design/master/logo.png' />
              <span>   VUE-ANTD</span>
            </router-link>
          </a-col>
          <a-col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
            <div id='search-box'>
              进度：{this.num} / 52
            </div>
            <a-button ghost size='small' onClick={this.handleClick} class='header-lang-button' key='lang-button'>
              {lang === 'cn' ? 'English' : '中文'}
            </a-button>
            <a-menu selectedKeys={['components']} mode='horizontal' class='menu-site' id='nav'>
              <a-menu-item key='components'>
                {lang === 'cn' ? '组件' : 'Components'}
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
