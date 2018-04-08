
import Button from '../button'
import { ButtonGroupProps } from '../button/button-group'
import Icon from '../icon'
import Dropdown from './dropdown'
import PropTypes from '../_util/vue-types'
import { hasProp, getComponentFromProp } from '../_util/props-util'
import getDropdownProps from './getDropdownProps'
const DropdownProps = getDropdownProps()
const ButtonGroup = Button.Group
const DropdownButtonProps = {
  ...ButtonGroupProps,
  ...DropdownProps,
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'default']).def('default'),
  disabled: PropTypes.bool,
  prefixCls: PropTypes.string.def('ant-dropdown-button'),
  placement: DropdownProps.placement.def('bottomRight'),
}
export { DropdownButtonProps }
export default {
  name: 'ADropdownButton',
  props: DropdownButtonProps,
  methods: {
    onClick (e) {
      this.$emit('click', e)
    },
    onVisibleChange (val) {
      this.$emit('visibleChange', val)
    },
  },
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  render () {
    const {
      type, disabled,
      prefixCls, trigger, align,
      visible, placement, getPopupContainer,
      ...restProps
    } = this.$props

    const dropdownProps = {
      props: {
        align,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer,
      },
      on: {
        visibleChange: this.onVisibleChange,
      },
    }
    if (hasProp(this, 'visible')) {
      dropdownProps.props.visible = visible
    }

    return (
      <ButtonGroup
        {...restProps}
        class={prefixCls}
      >
        <Button
          type={type}
          disabled={disabled}
          onClick={this.onClick}
        >
          {this.$slots.default}
        </Button>
        <Dropdown {...dropdownProps}>
          <template slot='overlay'>
            {getComponentFromProp(this, 'overlay')}
          </template>
          <Button type={type}>
            <Icon type='down' />
          </Button>
        </Dropdown>
      </ButtonGroup>
    )
  },
}

