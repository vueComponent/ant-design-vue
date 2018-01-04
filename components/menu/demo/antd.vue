<script>
import { cloneElement } from '../../_util/vnode'
import Menu, { SubMenu, Item as MenuItem, Divider } from '../src/index'
import { Icon } from 'antd'
import '../assets/index.less'
import animate from 'css-animation'

function handleSelect (info) {
  console.log(info)
  console.log(`selected ${info.key}`)
}

const animation = {
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

  appear () {
    return this.enter.apply(this, arguments)
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
}
export default {
  methods: {

  },
  render () {
    // const nestSubMenu = (<SubMenu title={<span>sub menu 2</span>} key='4'>
    //   <MenuItem key='4-1'>inner inner</MenuItem>
    //   <Divider/>
    //   <SubMenu
    //     key='4-2'
    //     title={<span>sub menu 3</span>}
    //   >
    //     <SubMenu title='sub 4-2-0' key='4-2-0'>
    //       <MenuItem key='4-2-0-1'>inner inner</MenuItem>
    //       <MenuItem key='4-2-0-2'>inner inner2</MenuItem>
    //     </SubMenu>
    //     <MenuItem key='4-2-1'>inn</MenuItem>
    //     <SubMenu title={<span>sub menu 4</span>} key='4-2-2'>
    //       <MenuItem key='4-2-2-1'>inner inner</MenuItem>
    //       <MenuItem key='4-2-2-2'>inner inner2</MenuItem>
    //     </SubMenu>
    //     <SubMenu title='sub 4-2-3' key='4-2-3'>
    //       <MenuItem key='4-2-3-1'>inner inner</MenuItem>
    //       <MenuItem key='4-2-3-2'>inner inner2</MenuItem>
    //     </SubMenu>
    //   </SubMenu>
    // </SubMenu>)

    function onOpenChange (value) {
      console.log('onOpenChange', value)
    }
    const commonMenu = (<Menu class='test' onSelect={handleSelect} onOpenChange={onOpenChange}>
      <SubMenu key='1'>
        <template slot='title'><span>sub menu</span></template>
        <MenuItem key='1-1'>
          0-1
          <Icon type='search'/>
        </MenuItem>
        <MenuItem key='1-2'>0-2</MenuItem>
      </SubMenu>
    </Menu>)
    const horizontalMenu = cloneElement(commonMenu, { props: {
      mode: 'horizontal',
      // use openTransition for antd
      openAnimation: 'slide-up',
    }})

    // const horizontalMenu2 = cloneElement(commonMenu, { props: {
    //   mode: 'horizontal',
    //   openAnimation: 'slide-up',
    //   triggerSubMenuAction: 'click',
    // }})

    // const verticalMenu = cloneElement(commonMenu, { props: {
    //   mode: 'vertical',
    //   openAnimation: 'zoom',
    // }})

    // const inlineMenu = cloneElement(commonMenu, { props: {
    //   mode: 'inline',
    //   defaultOpenKeys: ['1'],
    //   openAnimation: animation,
    // }})
    return (
      <div style={{ margin: '20px' }}>
        <h2>antd menu</h2>
        <div>
          <h3>horizontal</h3>

          <div style={{ margin: '20px', width: '800px' }}>{horizontalMenu}</div>
          <h3>horizontal and click</h3>
          {/*
          <div style={{ margin: '20px', width: '800px' }}>{horizontalMenu2}</div>
          <h3>vertical</h3>

          <div style={{ margin: '20px', width: '200px' }}>{verticalMenu}</div>
          <h3>inline</h3>

          <div style={{ margin: '20px', width: '400px' }}>{inlineMenu}</div>
          */}
        </div>
      </div>
    )
  },
}

</script>
