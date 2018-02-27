<script>
import * as AllDemo from '../demo'
import Header from './header'
import zhCN from 'antd/locale-provider/zh_CN'
import enUS from 'antd/locale-provider/default'
export default {
  render () {
    const { name, demo } = this.$route.params // eslint-disable-line
    let { lang } = this.$route.params
    const Demo = AllDemo[name]
    let locale = zhCN
    if (lang !== 'cn') {
      lang = 'us'
      locale = enUS
    }
    return (
      <a-locale-provider locale={locale}>
        <div class='site'>
          <Header />
          <div class='main-wrapper'>
            <a-menu class='nav' selectedKeys={[name]}>
              {Object.keys(AllDemo).map(d => <a-menu-item key={d}>
                <router-link to={{ path: `/${lang}/components/${d}` }}>{d}</router-link>
              </a-menu-item>)}
            </a-menu>
            <div class='content main-container'>
              {Demo ? <Demo /> : '正在紧急开发中...'}
            </div>
          </div>
        </div>
      </a-locale-provider>
    )
  },
}
</script>
