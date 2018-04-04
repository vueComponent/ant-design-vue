<script>
import * as AllDemo from '../demo'
import Header from './header'
import zhCN from 'antd/locale-provider/zh_CN'
import enUS from 'antd/locale-provider/default'
import _ from 'lodash'
import { isZhCN } from '../util'

export default {
  render () {
    const { name } = this.$route.params
    const lang = isZhCN(name) ? 'cn' : 'us'
    // name = name.replace('-cn', '')
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
    const Demo = AllDemo[titleMap[name.replace('-cn', '')]]
    const MenuGroup = []
    for (const [type, menus] of Object.entries(menuConfig)) {
      const MenuItems = []
      _.sortBy(menus, ['title']).forEach(({ title, subtitle }) => {
        const linkValue = lang === 'cn'
          ? [<span>{title}</span>, <span class='chinese'>{subtitle}</span>]
          : [<span>{title}</span>]
        let key = `${title.replace(/(\B[A-Z])/g, '-$1').toLowerCase()}`
        if (lang === 'cn') {
          key = `${key}-cn`
        }
        MenuItems.push(<a-menu-item key={key}>
          <router-link to={{ path: `/ant-design/components/${key}` }}>{linkValue}</router-link>
        </a-menu-item>)
      })
      MenuGroup.push(<a-menu-item-group title={type}>{MenuItems}</a-menu-item-group>)
    }
    let locale = zhCN
    if (lang !== 'cn') {
      locale = enUS
    }
    return (
      <div class='page-wrapper'>
        <Header num={Object.keys(AllDemo).length}/>
        <a-locale-provider locale={locale}>
          <div class='main-wrapper'>
            <a-row>
              <a-col xxl={4} xl={5} lg={5} md={6} sm={24} xs={24}>
                <a-menu
                  class='aside-container menu-site'
                  selectedKeys={[name]}
                  defaultOpenKeys={['Components']}
                  inlineIndent={40}
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
      </div>
    )
  },
}
</script>
