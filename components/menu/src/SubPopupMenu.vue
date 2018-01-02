<script>
import PropTypes from '../../_util/vue-types'
import MenuMixin from './MenuMixin'

export default {
  name: 'SubPopupMenu',
  props: {
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    onOpenChange: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
    children: PropTypes.any,
  },

  mixins: [MenuMixin],

  onDeselect (selectInfo) {
    this.$emit('deselect', selectInfo)
  },

  onSelect (selectInfo) {
    this.$emit('select', selectInfo)
  },

  onClick (e) {
    this.$emit('click', e)
  },

  onOpenChange (e) {
    this.$emit('openChange', e)
  },

  onDestroy (key) {
    this.$$emit('destroy', key)
  },

  getOpenTransitionName () {
    return this.$props.openTransitionName
  },

  renderMenuItem (c, i, subIndex) {
    if (!c) {
      return null
    }
    const props = this.$props
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      triggerSubMenuAction: props.triggerSubMenuAction,
    }
    return this.renderCommonMenuItem(c, i, subIndex, extraProps)
  },

  render () {
    const props = { ...this.$props }

    const haveRendered = this.haveRendered
    this.haveRendered = true

    this.haveOpened = this.haveOpened || props.visible || props.forceSubMenuRender
    if (!this.haveOpened) {
      return null
    }

    const transitionAppear = !(!haveRendered && props.visible && props.mode === 'inline')

    props.className += ` ${props.prefixCls}-sub`
    const animProps = {}
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName
    } else if (typeof props.openAnimation === 'object') {
      animProps.animation = { ...props.openAnimation }
      if (!transitionAppear) {
        delete animProps.animation.appear
      }
    }
    return (
      <transition
        appear
        name={animProps.transitionName}
      >
        {this.renderRoot(props)}
      </transition>
    )
  },
}
</script>
