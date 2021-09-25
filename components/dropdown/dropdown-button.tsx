import type { ExtractPropTypes } from 'vue';
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
  name: 'ADropdownButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: initDefaultProps(dropdownButtonProps(), {
    trigger: 'hover',
    placement: 'bottomRight',
    type: 'default',
  }),
  emits: ['click', 'visibleChange', 'update:visible'],
  slots: ['icon', 'leftButton', 'rightButton', 'overlay'],
  setup(props, { slots, attrs, emit }) {
    const handleClick = (e: MouseEvent) => {
      emit('click', e);
    };
    const handleVisibleChange = (val: boolean) => {
      emit('update:visible', val);
      emit('visibleChange', val);
    };

    const { prefixCls, direction, getPopupContainer } = useConfigInject('dropdown-button', props);

    return () => {
      const {
        type,
        disabled,
        htmlType,
        class: className = '',
        overlay = slots.overlay?.(),
        trigger,
        align,
        visible,
        onVisibleChange,
        placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
        href,
        title,
        icon = slots.icon?.() || <EllipsisOutlined />,
        mouseEnterDelay,
        mouseLeaveDelay,
        ...restProps
      } = { ...props, ...attrs };

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
      };

      const leftButton = (
        <Button
          type={type}
          disabled={disabled}
          onClick={handleClick}
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
