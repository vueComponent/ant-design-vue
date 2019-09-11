import Button from '../button';
import buttonTypes from '../button/buttonTypes';
import { ButtonGroupProps } from '../button/button-group';
import Dropdown from './dropdown';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import { ConfigConsumerProps } from '../config-provider';
const ButtonTypesProps = buttonTypes();
const DropdownProps = getDropdownProps();
const ButtonGroup = Button.Group;
const DropdownButtonProps = {
  ...ButtonGroupProps,
  ...DropdownProps,
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'default']).def('default'),
  size: PropTypes.oneOf(['small', 'large', 'default']).def('default'),
  htmlType: ButtonTypesProps.htmlType,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  prefixCls: PropTypes.string,
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
  provide() {
    return {
      savePopupRef: this.savePopupRef,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    savePopupRef(ref) {
      this.popupRef = ref;
    },
    onClick(e) {
      this.$emit('click', e);
    },
    onVisibleChange(val) {
      this.$emit('visibleChange', val);
    },
  },
  render() {
    const {
      type,
      disabled,
      htmlType,
      prefixCls: customizePrefixCls,
      trigger,
      align,
      visible,
      placement,
      getPopupContainer,
      href,
      ...restProps
    } = this.$props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('dropdown-button', customizePrefixCls);
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

    const buttonGroupProps = {
      props: {
        ...restProps,
      },
      class: prefixCls,
    };

    return (
      <ButtonGroup {...buttonGroupProps}>
        <Button
          type={type}
          disabled={disabled}
          onClick={this.onClick}
          htmlType={htmlType}
          href={href}
        >
          {this.$slots.default}
        </Button>
        <Dropdown {...dropdownProps}>
          <template slot="overlay">{getComponentFromProp(this, 'overlay')}</template>
          <Button type={type} disabled={disabled} icon="ellipsis" />
        </Dropdown>
      </ButtonGroup>
    );
  },
};
