<script>
import { Menu } from 'antd'
import * as AllDemo from './demo'
const MenuItem = Menu.Item
export default {
  render () {
    const { name, demo } = this.$route.params // eslint-disable-line
    const Demo = AllDemo[name]
    return (
      <div class='site page-container'>
        <Menu class='nav' selectedKeys={[name]}>
          {Object.keys(AllDemo).map(d => <MenuItem key={d}>
            <router-link to={{ path: `/components/${d}` }}>{d}</router-link>
          </MenuItem>)}
        </Menu>
        <div class='content'>
          {Demo ? <Demo /> : '正在紧急开发中...'}
        </div>

      </div>
    )
  },
}
</script>
