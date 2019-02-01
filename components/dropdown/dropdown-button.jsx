import Button from '../button';
import buttonTypes from '../button/buttonTypes';
import { ButtonGroupProps } from '../button/button-group';
import Dropdown from './dropdown';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
const ButtonTypesProps = buttonTypes();
const DropdownProps = getDropdownProps();
const ButtonGroup = Button.Group;
const DropdownButtonProps = {
  ...ButtonGroupProps,
  ...DropdownProps,
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'default']).def('default'),
  htmlType: ButtonTypesProps.htmlType,
  disabled: PropTypes.bool,
  prefixCls: PropTypes.string.def('ant-dropdown-button'),
  placement: DropdownProps.placement.def('bottomRight'),
};
export { DropdownButtonProps };
export default {
  name: 'ADropdownButton',
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  props: DropdownButtonProps,
  methods: {
    onClick(e) {
      this.$emit('click', e);
    },
    onVisibleChange(val) {
      this.$emit('visibleChange', val);
    },
  },
  inject: {
    configProvider: { default: () => ({}) },
  },
  render() {
    const {
      type,
      disabled,
      htmlType,
      prefixCls,
      trigger,
      align,
      visible,
      placement,
      getPopupContainer,
      ...restProps
    } = this.$props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const dropdownProps = {
      props: {
        align,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
      },
      on: {
        visibleChange: this.onVisibleChange,
      },
    };
    if (hasProp(this, 'visible')) {
      dropdownProps.props.visible = visible;
    }

    return (
      <ButtonGroup {...restProps} class={prefixCls}>
        <Button type={type} disabled={disabled} onClick={this.onClick} htmlType={htmlType}>
          {this.$slots.default}
        </Button>
        <Dropdown {...dropdownProps}>
          <template slot="overlay">{getComponentFromProp(this, 'overlay')}</template>
          <Button type={type} icon="ellipsis" />
        </Dropdown>
      </ButtonGroup>
    );
  },
};
