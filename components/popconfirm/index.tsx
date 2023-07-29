import type { ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import { computed, ref, toRef, defineComponent } from 'vue';
import Popover from '../popover';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { initDefaultProps } from '../_util/props-util';
import type { ButtonProps, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import Button from '../button';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';

import defaultLocale from '../locale/en_US';
import { anyType, objectType, stringType, withInstall } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';

import useMergedState from '../_util/hooks/useMergedState';

import KeyCode from '../_util/KeyCode';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { getTransitionName } from '../_util/transition';
import { cloneVNodes } from '../_util/vnode';
import omit from '../_util/omit';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import ActionButton from '../_util/ActionButton';
import usePopconfirmStyle from './style';
import warning from '../_util/warning';

export const popconfirmProps = () => ({
  ...abstractTooltipProps(),
  prefixCls: String,
  content: anyType(),
  title: anyType<string | number>(),
  description: anyType<string | number>(),
  okType: stringType<LegacyButtonType>('primary'),
  disabled: { type: Boolean, default: false },
  okText: anyType(),
  cancelText: anyType(),
  icon: anyType(),
  okButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  cancelButtonProps: objectType<ButtonProps & HTMLAttributes>(),
  showCancel: { type: Boolean, default: true },
  onConfirm: Function as PropType<(e: MouseEvent) => void>,
  onCancel: Function as PropType<(e: MouseEvent) => void>,
});

export type PopconfirmProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmProps>>>;

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

const Popconfirm = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopconfirm',
  inheritAttrs: false,
  props: initDefaultProps(popconfirmProps(), {
    ...tooltipDefaultProps(),
    trigger: 'click',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
    okType: 'primary',
    disabled: false,
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    content?: any;
    description?: any;
    okText?: any;
    icon?: any;
    cancel?: any;
    cancelText?: any;
    cancelButton?: any;
    okButton?: any;
    default?: any;
  }>,
  // emits: ['update:open', 'visibleChange'],
  setup(props: PopconfirmProps, { slots, emit, expose, attrs }) {
    const rootRef = ref();
    warning(
      props.visible === undefined,
      'Popconfirm',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );
    expose({
      getPopupDomNode: () => {
        return rootRef.value?.getPopupDomNode?.();
      },
    });
    const [open, setOpen] = useMergedState(false, {
      value: toRef(props, 'open'),
    });

    const settingOpen = (value: boolean, e?: MouseEvent | KeyboardEvent) => {
      if (props.open === undefined) {
        setOpen(value);
      }

      emit('update:open', value);
      emit('openChange', value, e);
    };

    const close = (e: MouseEvent) => {
      settingOpen(false, e);
    };

    const onConfirm = (e: MouseEvent) => {
      return props.onConfirm?.(e);
    };

    const onCancel = (e: MouseEvent) => {
      settingOpen(false, e);
      props.onCancel?.(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC && open) {
        settingOpen(false, e);
      }
    };

    const onOpenChange = (value: boolean) => {
      const { disabled } = props;
      if (disabled) {
        return;
      }
      settingOpen(value);
    };
    const { prefixCls: prefixClsConfirm, getPrefixCls } = useConfigInject('popconfirm', props);
    const rootPrefixCls = computed(() => getPrefixCls());
    const btnPrefixCls = computed(() => getPrefixCls('btn'));
    const [wrapSSR] = usePopconfirmStyle(prefixClsConfirm);
    const [popconfirmLocale] = useLocaleReceiver('Popconfirm', defaultLocale.Popconfirm);
    const renderOverlay = () => {
      const {
        okButtonProps,
        cancelButtonProps,
        title = slots.title?.(),
        description = slots.description?.(),
        cancelText = slots.cancel?.(),
        okText = slots.okText?.(),
        okType,
        icon = slots.icon?.() || <ExclamationCircleFilled />,
        showCancel = true,
      } = props;
      const { cancelButton, okButton } = slots;
      const cancelProps: ButtonProps = {
        onClick: onCancel,
        size: 'small',
        ...cancelButtonProps,
      };
      const okProps: ButtonProps = {
        onClick: onConfirm,
        ...convertLegacyProps(okType),
        size: 'small',
        ...okButtonProps,
      };
      return (
        <div class={`${prefixClsConfirm.value}-inner-content`}>
          <div class={`${prefixClsConfirm.value}-message`}>
            {icon && <span class={`${prefixClsConfirm.value}-message-icon`}>{icon}</span>}
            <div
              class={[
                `${prefixClsConfirm.value}-message-title`,
                { [`${prefixClsConfirm.value}-message-title-only`]: !!description },
              ]}
            >
              {title}
            </div>
          </div>
          {description && <div class={`${prefixClsConfirm.value}-description`}>{description}</div>}
          <div class={`${prefixClsConfirm.value}-buttons`}>
            {showCancel ? (
              cancelButton ? (
                cancelButton(cancelProps)
              ) : (
                <Button {...cancelProps}>{cancelText || popconfirmLocale.value.cancelText}</Button>
              )
            ) : null}
            {okButton ? (
              okButton(okProps)
            ) : (
              <ActionButton
                buttonProps={{ size: 'small', ...convertLegacyProps(okType), ...okButtonProps }}
                actionFn={onConfirm}
                close={close}
                prefixCls={btnPrefixCls.value}
                quitOnNullishReturnValue
                emitEvent
              >
                {okText || popconfirmLocale.value.okText}
              </ActionButton>
            )}
          </div>
        </div>
      );
    };

    return () => {
      const { placement, overlayClassName, trigger = 'click', ...restProps } = props;
      const otherProps = omit(restProps, [
        'title',
        'content',
        'cancelText',
        'okText',
        'onUpdate:open',
        'onConfirm',
        'onCancel',
        'prefixCls',
      ]);
      const overlayClassNames = classNames(prefixClsConfirm.value, overlayClassName);
      return wrapSSR(
        <Popover
          {...otherProps}
          {...attrs}
          trigger={trigger}
          placement={placement}
          onOpenChange={onOpenChange}
          open={open.value}
          overlayClassName={overlayClassNames}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          v-slots={{ content: renderOverlay }}
          ref={rootRef}
          data-popover-inject
        >
          {cloneVNodes(
            slots.default?.() || [],
            {
              onKeydown: (e: KeyboardEvent) => {
                onKeyDown(e);
              },
            },
            false,
          )}
        </Popover>,
      );
    };
  },
});
export default withInstall(Popconfirm);
