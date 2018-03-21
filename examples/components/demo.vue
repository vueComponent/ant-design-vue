<script>
import * as AllDemo from '../demo'
import Header from './header'
import zhCN from 'antd/locale-provider/zh_CN'
import enUS from 'antd/locale-provider/default'
export default {
  render () {
    const { name } = this.$route.params
    let { lang } = this.$route.params
    const titleMap = {}
    const menuConfig = {
      General: [],
      Layout: [],
      Navigation: [],
      'Data Entry': [],
      'Data Display': [],
      Feedback: [],
      Other: [],
    }
    for (const [title, d] of Object.entries(AllDemo)) {
      const type = d.type || 'Other'
      const key = `${title.replace(/(\B[A-Z])/g, '-$1').toLowerCase()}`
      titleMap[key] = title
      menuConfig[type] = menuConfig[type] || []
      menuConfig[type].push(d)
    }
    const Demo = AllDemo[titleMap[name]]
    const MenuGroup = []
    for (const [type, menus] of Object.entries(menuConfig)) {
      const MenuItems = []
      menus.forEach(({ title, subtitle }) => {
        const linkValue = lang === 'cn'
          ? [<span>{title}</span>, <span class='chinese'>{subtitle}</span>]
          : [<span>{title}</span>]
        const key = `${title.replace(/(\B[A-Z])/g, '-$1').toLowerCase()}`
        MenuItems.push(<a-menu-item key={key} style='padding-left: 80px'>
          <router-link to={{ path: `/${lang}/components/${key}` }}>{linkValue}</router-link>
        </a-menu-item>)
      })
      MenuGroup.push(<a-menu-item-group title={type}>{MenuItems}</a-menu-item-group>)
    }
    let locale = zhCN
    if (lang !== 'cn') {
      lang = 'us'
      locale = enUS
    }
    return (
      <a-locale-provider locale={locale}>
        <div class='site'>
          <Header />
          <a-row>
            <a-col xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
              <a-menu
                class='aside-container menu-site'
                selectedKeys={[name]}
                defaultOpenKeys={['Components']}
                mode='inline'>
                <a-sub-menu title='Components' key='Components'>
                  {MenuGroup}
                </a-sub-menu>
              </a-menu>
            </a-col>
            <a-col xxl={20} xl={19} lg={19} md={18} sm={0} xs={0}>
              <div class='content main-container'>
                {Demo ? <Demo key={lang}/> : '正在紧急开发中...'}
              </div>
            </a-col>
          </a-row>
        </div>
      </a-locale-provider>
    )
  },
}
</script>
