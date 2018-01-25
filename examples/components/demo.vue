<script>
import { Menu } from 'antd'
import * as AllDemo from '../demo'
const MenuItem = Menu.Item
export default {
  render () {
    const { name, demo } = this.$route.params // eslint-disable-line
    let { lang } = this.$route.params
    const Demo = AllDemo[name]
    if (lang !== 'cn') {
      lang = 'us'
    }
    return (
      <div class='site page-container'>
        <Menu class='nav' selectedKeys={[name]}>
          {Object.keys(AllDemo).map(d => <MenuItem key={d}>
            <router-link to={{ path: `/components/${lang}/${d}` }}>{d}</router-link>
          </MenuItem>)}
        </Menu>
        <div class='content main-container'>
          {Demo ? <Demo /> : '正在紧急开发中...'}
        </div>

      </div>
    )
  },
}
</script>
