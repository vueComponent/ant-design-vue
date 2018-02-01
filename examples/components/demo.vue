<script>
import * as AllDemo from '../demo'
import Header from './header'
export default {
  render () {
    const { name, demo } = this.$route.params // eslint-disable-line
    let { lang } = this.$route.params
    const Demo = AllDemo[name]
    if (lang !== 'cn') {
      lang = 'us'
    }
    return (
      <div class='site'>
        <Header />
        <div class='main-wrapper'>
          <a-menu class='nav' selectedKeys={[name]}>
            {Object.keys(AllDemo).map(d => <a-menu-item key={d}>
              <router-link to={{ path: `/components/${lang}/${d}` }}>{d}</router-link>
            </a-menu-item>)}
          </a-menu>
          <div class='content main-container'>
            {Demo ? <Demo /> : '正在紧急开发中...'}
          </div>
        </div>

      </div>
    )
  },
}
</script>
