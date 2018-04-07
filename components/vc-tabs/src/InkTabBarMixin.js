import { setTransform, isTransformSupported } from './utils'

export function getScroll (w, top) {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`]
  const method = `scroll${top ? 'Top' : 'Left'}`
  if (typeof ret !== 'number') {
    const d = w.document
    // ie6,7,8 standard mode
    ret = d.documentElement[method]
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method]
    }
  }
  return ret
}

function offset (elem) {
  let x
  let y
  const doc = elem.ownerDocument
  const body = doc.body
  const docElem = doc && doc.documentElement
  const box = elem.getBoundingClientRect()
  x = box.left
  y = box.top
  x -= docElem.clientLeft || body.clientLeft || 0
  y -= docElem.clientTop || body.clientTop || 0
  const w = doc.defaultView || doc.parentWindow
  x += getScroll(w)
  y += getScroll(w, true)
  return {
    left: x, top: y,
  }
}

function componentDidUpdate (component, init) {
  const { styles = {}} = component.$props
  const rootNode = component.$refs.root
  const wrapNode = component.$refs.nav || rootNode
  const containerOffset = offset(wrapNode)
  const inkBarNode = component.$refs.inkBar
  const activeTab = component.$refs.activeTab
  const inkBarNodeStyle = inkBarNode.style
  const tabBarPosition = component.$props.tabBarPosition
  if (init) {
    // prevent mount animation
    inkBarNodeStyle.display = 'none'
  }
  if (activeTab) {
    const tabNode = activeTab
    const tabOffset = offset(tabNode)
    const transformSupported = isTransformSupported(inkBarNodeStyle)
    if (tabBarPosition === 'top' || tabBarPosition === 'bottom') {
      let left = tabOffset.left - containerOffset.left
      let width = tabNode.offsetWidth

      // If tabNode'width width equal to wrapNode'width when tabBarPosition is top or bottom
      // It means no css working, then ink bar should not have width until css is loaded
      // Fix https://github.com/ant-design/ant-design/issues/7564
      if (width === rootNode.offsetWidth) {
        width = 0
      } else if (styles.inkBar && styles.inkBar.width !== undefined) {
        width = parseFloat(styles.inkBar.width, 10)
        if (width) {
          left = left + (tabNode.offsetWidth - width) / 2
        }
      }
      // use 3d gpu to optimize render
      if (transformSupported) {
        setTransform(inkBarNodeStyle, `translate3d(${left}px,0,0)`)
        inkBarNodeStyle.width = `${width}px`
        inkBarNodeStyle.height = ''
      } else {
        inkBarNodeStyle.left = `${left}px`
        inkBarNodeStyle.top = ''
        inkBarNodeStyle.bottom = ''
        inkBarNodeStyle.right = `${wrapNode.offsetWidth - left - width}px`
      }
    } else {
      let top = tabOffset.top - containerOffset.top
      let height = tabNode.offsetHeight
      if (styles.inkBar && styles.inkBar.height !== undefined) {
        height = parseFloat(styles.inkBar.height, 10)
        if (height) {
          top = top + (tabNode.offsetHeight - height) / 2
        }
      }
      if (transformSupported) {
        setTransform(inkBarNodeStyle, `translate3d(0,${top}px,0)`)
        inkBarNodeStyle.height = `${height}px`
        inkBarNodeStyle.width = ''
      } else {
        inkBarNodeStyle.left = ''
        inkBarNodeStyle.right = ''
        inkBarNodeStyle.top = `${top}px`
        inkBarNodeStyle.bottom = `${wrapNode.offsetHeight - top - height}px`
      }
    }
  }
  inkBarNodeStyle.display = activeTab ? 'block' : 'none'
}

export default {
  props: {
    inkBarAnimated: {
      type: Boolean,
      default: true,
    },
    prefixCls: String,
    styles: Object,
  },
  updated () {
    this.$nextTick(function () {
      componentDidUpdate(this)
    })
  },

  mounted () {
    this.$nextTick(function () {
      componentDidUpdate(this, true)
    })
  },
  methods: {
    getInkBarNode () {
      const { prefixCls, styles = {}, inkBarAnimated } = this
      const className = `${prefixCls}-ink-bar`
      const classes = {
        [className]: true,
        [
        inkBarAnimated
          ? `${className}-animated`
          : `${className}-no-animated`
        ]: true,
      }
      return (
        <div
          style={styles.inkBar}
          class={classes}
          key='inkBar'
          ref='inkBar'
        />
      )
    },
  },
}
