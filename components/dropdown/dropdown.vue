<script>
import RcDropdown from './src/index'
import DropdownButton from './dropdown-button'
// import warning from '../_util/warning'
import PropTypes from '../_util/vue-types'
import { cloneElement, getPropsData } from '../_util/vnode'
import { getOptionProps } from '../_util/props-util'
import getDropdownProps from './getDropdownProps'
const DropdownProps = getDropdownProps()
const Dropdown = {
  props: {
    ...DropdownProps,
    prefixCls: PropTypes.string.def('ant-dropdown'),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft'),
  },
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  methods: {
    getTransitionName () {
      const { placement = '', transitionName } = this.$props
      if (transitionName !== undefined) {
        return transitionName
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down'
      }
      return 'slide-up'
    },
  },

  render () {
    const { $slots, prefixCls, trigger, disabled, $listeners } = this
    const dropdownTrigger = cloneElement($slots.default, {
      class: `${prefixCls}-trigger`,
      disabled,
    })
    const overlay = $slots.overlay && $slots.overlay[0]
    // menu cannot be selectable in dropdown defaultly
    const overlayProps = overlay && getPropsData(overlay)
    const selectable = overlayProps.selectable || false
    const fixedModeOverlay = cloneElement(overlay, {
      props: {
        mode: 'vertical',
        selectable,
        isRootMenu: false,
      },
    })
    const dropdownProps = {
      props: {
        ...getOptionProps(this),
        transitionName: this.getTransitionName(),
        trigger: disabled ? [] : trigger,
      },
      on: $listeners,
    }
    return (
      <RcDropdown
        {...dropdownProps}
      >
        {dropdownTrigger}
        <template slot='overlay'>
          {fixedModeOverlay}
        </template>
      </RcDropdown>
    )
  },
}

Dropdown.Button = DropdownButton
export default Dropdown
export { DropdownProps }

</script>
