<script>
import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { hasProp } from '../../_util/props-util'
import { cloneElement, getPropsData, isEmptyElement } from '../../_util/vnode'
import openAnimationFactory from './openAnimationFactory'
import { collapseProps } from './commonProps'

function _toArray (activeKey) {
  let currentActiveKey = activeKey
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : []
  }
  return currentActiveKey
}

export default {
  name: 'Collapse',
  mixins: [BaseMixin],
  props: {
    ...collapseProps,
    openAnimation: PropTypes.object,
  },
  data () {
    const { value, defaultValue, openAnimation, prefixCls } = this.$props
    let currentActiveKey = defaultValue
    if (hasProp(this, 'value')) {
      currentActiveKey = value
    }
    const currentOpenAnimations = openAnimation || openAnimationFactory(prefixCls)
    return {
      currentOpenAnimations,
      stateActiveKey: _toArray(currentActiveKey),
    }
  },
  methods: {
    onClickItem (key) {
      let activeKey = this.stateActiveKey
      if (this.accordion) {
        activeKey = activeKey[0] === key ? [] : [key]
      } else {
        activeKey = [...activeKey]
        const index = activeKey.indexOf(key)
        const isActive = index > -1
        if (isActive) {
        // remove active state
          activeKey.splice(index, 1)
        } else {
          activeKey.push(key)
        }
      }
      this.setActiveKey(activeKey)
    },
    getItems () {
      const activeKey = this.stateActiveKey
      const { prefixCls, accordion, destroyInactivePanel } = this.$props
      const newChildren = []
      this.$slots.default.forEach((child, index) => {
        if (isEmptyElement(child)) return
        const { header, headerClass, disabled, name = String(index) } = getPropsData(child)
        let isActive = false
        if (accordion) {
          isActive = activeKey[0] === name
        } else {
          isActive = activeKey.indexOf(name) > -1
        }

        let panelEvents = {}
        if (!disabled && disabled !== '') {
          panelEvents = {
            itemClick: () => { this.onClickItem(name) },
          }
        }

        const props = {
          props: {
            header,
            headerClass,
            isActive,
            prefixCls,
            destroyInactivePanel,
            openAnimation: this.currentOpenAnimations,
          },
          on: {
            ...panelEvents,
          },
        }

        newChildren.push(cloneElement(child, props))
      })
      return newChildren
    },
    setActiveKey (activeKey) {
      this.setState({ stateActiveKey: activeKey })
      this.$emit('change', this.accordion ? activeKey[0] : activeKey)
      this.$emit('input', this.accordion ? activeKey[0] : activeKey)
    },
  },
  watch: {
    value (val) {
      this.setState({
        stateActiveKey: _toArray(val),
      })
    },
    openAnimation (val) {
      this.setState({
        currentOpenAnimations: val,
      })
    },
  },
  render () {
    const { prefixCls } = this.$props
    const collapseClassName = {
      [prefixCls]: true,
    }
    return (
      <div class={collapseClassName}>
        {this.getItems()}
      </div>
    )
  },
}
</script>
