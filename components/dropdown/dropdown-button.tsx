import type { VNode, ExtractPropTypes } from 'vue';
import { provide, inject, defineComponent } from 'vue';
import Button from '../button';
import classNames from '../_util/classNames';
import buttonTypes from '../button/buttonTypes';
import Dropdown from './dropdown';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponent, getSlot } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import { defaultConfigProvider } from '../config-provider';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import { tuple } from '../_util/type';

const ButtonTypesProps = buttonTypes();
const DropdownProps = getDropdownProps();
const ButtonGroup = Button.Group;
const dropdownButtonProps = {
  ...DropdownProps,
  type: PropTypes.oneOf(tuple('primary', 'ghost', 'dashed', 'danger', 'default')).def('default'),
  size: PropTypes.oneOf(tuple('small', 'large', 'default')).def('default'),
  htmlType: ButtonTypesProps.htmlType,
  href: PropTypes.string,
  disabled: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  placement: DropdownProps.placement.def('bottomRight'),
  icon: PropTypes.any,
  title: PropTypes.string,
  onClick: PropTypes.func,
  onVisibleChange: PropTypes.func,
  'onUpdate:visible': PropTypes.func,
};
export type DropdownButtonProps = Partial<ExtractPropTypes<typeof dropdownButtonProps>>;
export default defineComponent({
  name: 'ADropdownButton',
  inheritAttrs: false,
  props: dropdownButtonProps,
  emits: ['click', 'visibleChange', 'update:visible'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      popupRef: null,
    };
  },
  created() {
    provide('savePopupRef', this.savePopupRef);
  },
  methods: {
    savePopupRef(ref: VNode) {
      this.popupRef = ref;
    },
    handleClick(e: Event) {
      this.$emit('click', e);
    },
    handleVisibleChange(val: boolean) {
      this.$emit('update:visible', val);
      this.$emit('visibleChange', val);
    },
  },
  render() {
    const {
      type,
      disabled,
      onClick,
      htmlType,
      class: className,
      prefixCls: customizePrefixCls,
      overlay,
      trigger,
      align,
      visible,
      onVisibleChange,
      placement,
      getPopupContainer,
      href,
      title,
      ...restProps
    } = { ...this.$props, ...this.$attrs } as any;
    const icon = getComponent(this, 'icon') || <EllipsisOutlined />;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('dropdown-button', customizePrefixCls);
    const dropdownProps: any = {
      align,
      disabled,
      trigger: disabled ? [] : trigger,
      placement,
      getPopupContainer: getPopupContainer || getContextPopupContainer,
      onVisibleChange: this.handleVisibleChange,
    };
    if (hasProp(this, 'visible')) {
      dropdownProps.visible = visible;
    }

    const buttonGroupProps = {
      ...restProps,
      class: classNames(prefixCls, className),
    };

    return (
      <ButtonGroup {...buttonGroupProps}>
        <Button
          type={type}
          disabled={disabled}
          onClick={this.handleClick}
          htmlType={htmlType}
          href={href}
          title={title}
        >
          {getSlot(this)}
        </Button>
        <Dropdown {...dropdownProps} overlay={getComponent(this, 'overlay')}>
          <Button type={type}>{icon}</Button>
        </Dropdown>
      </ButtonGroup>
    );
  },
});
