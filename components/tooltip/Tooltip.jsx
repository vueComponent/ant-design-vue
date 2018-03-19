
import { cloneElement } from '../_util/vnode'
import VcTooltip from '../vc-tooltip'
import getPlacements from './placements'
import PropTypes from '../_util/vue-types'
import { hasProp, getComponentFromProp, getClass, getStyle, isValidElement } from '../_util/props-util'
import abstractTooltipProps from './abstractTooltipProps'

const splitObject = (obj, keys) => {
  const picked = {}
  const omited = { ...obj }
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key]
      delete omited[key]
    }
  })
  return { picked, omited }
}
const props = abstractTooltipProps()
export default {
  name: 'Tooltip',
  props: {
    ...props,
    title: PropTypes.any,
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  data () {
    return {
      sVisible: !!this.$props.visible,
    }
  },
  watch: {
    visible (val) {
      this.sVisible = val
    },
  },
  methods: {
    onVisibleChange (visible) {
      if (!hasProp(this, 'visible')) {
        this.sVisible = this.isNoTitle() ? false : visible
      }
      if (!this.isNoTitle()) {
        this.$emit('change', visible)
      }
    },

    getPopupDomNode () {
      return this.$refs.tooltip.getPopupDomNode()
    },

    getPlacements () {
      const { builtinPlacements, arrowPointAtCenter, autoAdjustOverflow } = this.$props
      return builtinPlacements || getPlacements({
        arrowPointAtCenter,
        verticalArrowShift: 8,
        autoAdjustOverflow,
      })
    },

    isHoverTrigger () {
      const { trigger } = this.$props
      if (!trigger || trigger === 'hover') {
        return true
      }
      if (Array.isArray(trigger)) {
        return trigger.indexOf('hover') >= 0
      }
      return false
    },

    // Fix Tooltip won't hide at disabled button
    // mouse events don't trigger at disabled button in Chrome
    // https://github.com/react-component/tooltip/issues/18
    getDisabledCompatibleChildren (ele) {
      const isAntBtn = ele.componentOptions && ele.componentOptions.Ctor.options.__ANT_BUTTON
      if (((isAntBtn && ele.componentOptions.propsData.disabled) || (ele.tag === 'button' && ele.data && ele.data.attrs.disabled !== false)) && this.isHoverTrigger()) {
      // Pick some layout related style properties up to span
      // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
        const { picked, omited } = splitObject(
          getStyle(ele),
          ['position', 'left', 'right', 'top', 'bottom', 'float', 'display', 'zIndex'],
        )
        const spanStyle = {
          display: 'inline-block', // default inline-block is important
          ...picked,
          cursor: 'not-allowed',
        }
        const buttonStyle = {
          ...omited,
          pointerEvents: 'none',
        }
        const spanCls = getClass(ele)
        const child = cloneElement(ele, {
          style: buttonStyle,
          class: null,
        })
        return (
          <span style={spanStyle} class={spanCls}>
            {child}
          </span>
        )
      }
      return ele
    },

    isNoTitle () {
      const { $slots, title } = this
      return !$slots.title && !title
    },

    // 动态设置动画点
    onPopupAlign (domNode, align) {
      const placements = this.getPlacements()
      // 当前返回的位置
      const placement = Object.keys(placements).filter(
        key => (
          placements[key].points[0] === align.points[0] &&
        placements[key].points[1] === align.points[1]
        ),
      )[0]
      if (!placement) {
        return
      }
      // 根据当前坐标设置动画点
      const rect = domNode.getBoundingClientRect()
      const transformOrigin = {
        top: '50%',
        left: '50%',
      }
      if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
        transformOrigin.top = `${rect.height - align.offset[1]}px`
      } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
        transformOrigin.top = `${-align.offset[1]}px`
      }
      if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
        transformOrigin.left = `${rect.width - align.offset[0]}px`
      } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
        transformOrigin.left = `${-align.offset[0]}px`
      }
      domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`
    },
  },

  render (h) {
    const { $props, $data, $slots } = this
    const { prefixCls, openClassName, getPopupContainer, getTooltipContainer } = $props
    const children = ($slots.default || []).filter(c => c.tag || c.text.trim() !== '')[0]
    let sVisible = $data.sVisible
    // Hide tooltip when there is no title
    if (!hasProp(this, 'visible') && this.isNoTitle()) {
      sVisible = false
    }
    if (!children) {
      return null
    }
    const child = this.getDisabledCompatibleChildren(isValidElement(children) ? children : <span>{children}</span>)
    const childCls = {
      [openClassName || `${prefixCls}-open`]: true,
    }
    const tooltipProps = {
      props: {
        ...$props,
        getTooltipContainer: getPopupContainer || getTooltipContainer,
        builtinPlacements: this.getPlacements(),
        visible: sVisible,
      },
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange,
        popupAlign: this.onPopupAlign,
      },
    }
    return (
      <VcTooltip {...tooltipProps}>
        <template slot='overlay'>
          {getComponentFromProp(this, 'title')}
        </template>
        {sVisible ? cloneElement(child, { class: childCls }) : child}
      </VcTooltip>
    )
  },
}

