<script>
import Clone from '../../_util/Clone'
import Menu, { SubMenu, Item as MenuItem, Divider } from '../src/index'
import animate from 'css-animation'

function handleSelect (info) {
  console.log(info)
  console.log(`selected ${info.key}`)
}

const animation = {
  on: {
    enter (node, done) {
      let height
      return animate(node, 'rc-menu-collapse', {
        start () {
          height = node.offsetHeight
          node.style.height = 0
        },
        active () {
          node.style.height = `${height}px`
        },
        end () {
          node.style.height = ''
          done()
        },
      })
    },
    leave (node, done) {
      return animate(node, 'rc-menu-collapse', {
        start () {
          node.style.height = `${node.offsetHeight}px`
        },
        active () {
          node.style.height = 0
        },
        end () {
          node.style.height = ''
          done()
        },
      })
    },
  },
  props: {
    appear: false,
  },
}
export default {
  methods: {

  },
  render () {
    const nestSubMenu = () => (<SubMenu title={<span>sub menu 2</span>} key='4'>
      <MenuItem key='4-1'>inner inner</MenuItem>
      <Divider/>
      <SubMenu
        key='4-2'
        title={<span>sub menu 3</span>}
      >
        <SubMenu title='sub 4-2-0' key='4-2-0'>
          <MenuItem key='4-2-0-1'>inner inner</MenuItem>
          <MenuItem key='4-2-0-2'>inner inner2</MenuItem>
        </SubMenu>
        <MenuItem key='4-2-1'>inn</MenuItem>
        <SubMenu title={<span>sub menu 4</span>} key='4-2-2'>
          <MenuItem key='4-2-2-1'>inner inner</MenuItem>
          <MenuItem key='4-2-2-2'>inner inner2</MenuItem>
        </SubMenu>
        <SubMenu title='sub 4-2-3' key='4-2-3'>
          <MenuItem key='4-2-3-1'>inner inner</MenuItem>
          <MenuItem key='4-2-3-2'>inner inner2</MenuItem>
        </SubMenu>
      </SubMenu>
    </SubMenu>)
    const onOpenChange = (value) => {
      console.log('onOpenChange', value, this.$refs)
    }
    const commonMenu = () => (
      <Menu onSelect={handleSelect} onOpenChange={onOpenChange}>
        <SubMenu ref='test' key='1' title={<span>sub menu</span>}>
          <MenuItem key='1-1'>
          0-1
          </MenuItem>
          <MenuItem key='1-2' disabled>0-2</MenuItem>
        </SubMenu>
        {nestSubMenu()}
        <MenuItem key='2'>1</MenuItem>
        <MenuItem key='3'>outer</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem key='5'>outer3</MenuItem>
      </Menu>
    )
    return (
      <div style={{ margin: '20px' }}>
        <h2>antd menu</h2>
        <div>
          <h3>horizontal</h3>
          <div style={{ margin: '20px', width: '800px', position: 'relative' }}>
            <Clone childProps={{
              mode: 'horizontal',
              openAnimation: 'rc-menu-open-slide-up',
            }} >
              {commonMenu()}
            </Clone>
          </div>
          <h3>horizontal and click</h3>
          <div style={{ margin: '20px', width: '800px' }}>
            <Clone childProps={{
              mode: 'horizontal',
              openAnimation: 'rc-menu-open-slide-up',
              triggerSubMenuAction: 'click',
              defaultOpenKeys: ['1'],
            }} >
              {commonMenu()}
            </Clone>
          </div>
          <h3>vertical</h3>
          <div style={{ margin: '20px', width: '200px' }}>
            <Clone childProps={{
              mode: 'vertical',
              openAnimation: 'rc-menu-open-zoom',
            }} >
              {commonMenu()}
            </Clone></div>

          <h3>inline</h3>
          <div style={{ margin: '20px', width: '400px' }}><Clone childProps={{
            mode: 'inline',
            defaultOpenKeys: ['1'],
            defaultSelectedKeys: ['1-2', '4-1'],
            openAnimation: animation,
          }} >
            {commonMenu()}
          </Clone></div>
        </div>
      </div>
    )
  },
}

</script>
