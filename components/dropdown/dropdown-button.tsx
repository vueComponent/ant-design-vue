import type { ExtractPropTypes, HTMLAttributes } from 'vue';
import { defineComponent } from 'vue';
import Button from '../button';
import classNames from '../_util/classNames';
import Dropdown from './dropdown';
import { initDefaultProps } from '../_util/props-util';
import { dropdownButtonProps } from './props';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import useConfigInject from '../_util/hooks/useConfigInject';
const ButtonGroup = Button.Group;

export type DropdownButtonProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownButtonProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADropdownButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: initDefaultProps(dropdownButtonProps(), {
    trigger: 'hover',
    placement: 'bottomRight',
    type: 'default',
  }),
  // emits: ['click', 'visibleChange', 'update:visible'],
  slots: ['icon', 'leftButton', 'rightButton', 'overlay'],
  setup(props, { slots, attrs, emit }) {
    const handleVisibleChange = (val: boolean) => {
      emit('update:visible', val);
      emit('visibleChange', val);
    };

    const { prefixCls, direction, getPopupContainer } = useConfigInject('dropdown-button', props);

    return () => {
      const {
        type = 'default',
        disabled,
        loading,
        htmlType,
        class: className = '',
        overlay = slots.overlay?.(),
        trigger,
        align,
        visible,
        onVisibleChange: _onVisibleChange,
        placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
        href,
        title,
        icon = slots.icon?.() || <EllipsisOutlined />,
        mouseEnterDelay,
        mouseLeaveDelay,
        overlayClassName,
        overlayStyle,
        destroyPopupOnHide,
        onClick,
        'onUpdate:visible': _updateVisible,
        ...restProps
      } = { ...props, ...attrs } as DropdownButtonProps & HTMLAttributes;

      const dropdownProps = {
        align,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer: getPopupContainer.value,
        onVisibleChange: handleVisibleChange,
        mouseEnterDelay,
        mouseLeaveDelay,
        visible,
        overlayClassName,
        overlayStyle,
        destroyPopupOnHide,
      };

      const leftButton = (
        <Button
          type={type}
          disabled={disabled}
          loading={loading}
          onClick={onClick}
          htmlType={htmlType}
          href={href}
          title={title}
          v-slots={{ default: slots.default }}
        ></Button>
      );

      const rightButton = <Button type={type} icon={icon} />;

      return (
        <ButtonGroup {...restProps} class={classNames(prefixCls.value, className)}>
          {slots.leftButton ? slots.leftButton({ button: leftButton }) : leftButton}
          <Dropdown {...dropdownProps} v-slots={{ overlay: () => overlay }}>
            {slots.rightButton ? slots.rightButton({ button: rightButton }) : rightButton}
          </Dropdown>
        </ButtonGroup>
      );
    };
  },
});
