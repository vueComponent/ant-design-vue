
import RcDropdown from './src/index'
import DropdownButton from './dropdown-button'
// import warning from '../_util/warning'
import PropTypes from '../_util/vue-types'
import { cloneElement } from '../_util/vnode'
import { getOptionProps, getPropsData } from '../_util/props-util'
import getDropdownProps from './getDropdownProps'
const DropdownProps = getDropdownProps()
const Dropdown = {
  name: 'ADropdown',
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
    const overlay = this.overlay || $slots.overlay && $slots.overlay[0]
    // menu cannot be selectable in dropdown defaultly, but multiple type can be selectable
    const overlayProps = overlay && getPropsData(overlay)
    let selectable = false
    if (overlayProps) {
      selectable = !!overlayProps.selectable || overlayProps.multiple
    }
    const fixedModeOverlay = overlay && cloneElement(overlay, {
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

