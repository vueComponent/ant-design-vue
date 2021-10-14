import type { ExtractPropTypes, PropType } from 'vue';
import { computed, onMounted, ref, toRef, defineComponent } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import type { ButtonProps, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import Button from '../button';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { withInstall } from '../_util/type';
import useMergedState from '../_util/hooks/useMergedState';
import devWarning from '../vc-util/devWarning';
import KeyCode from '../_util/KeyCode';
import useConfigInject from '../_util/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { getTransitionName } from '../_util/transition';
import { cloneVNodes } from '../_util/vnode';
import omit from '../_util/omit';
import { tooltipDefaultProps } from '../tooltip/Tooltip';

export const popconfirmProps = () => ({
  ...abstractTooltipProps(),
  prefixCls: PropTypes.string,
  content: PropTypes.any,
  title: PropTypes.any,
  okType: {
    type: String as PropType<LegacyButtonType>,
    default: 'primary',
  },
  disabled: PropTypes.looseBool.def(false),
  okText: PropTypes.any,
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
});

export type PopconfirmProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmProps>>>;

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

const Popconfirm = defineComponent({
  name: 'APopconfirm',
  props: initDefaultProps(popconfirmProps(), {
    ...tooltipDefaultProps,
    trigger: 'click',
    transitionName: 'zoom-big',
    align: () => ({}),
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
    okType: 'primary',
    disabled: false,
  }),
  slots: ['title', 'content', 'okText', 'icon', 'cancelText', 'cancelButton', 'okButton'],
  emits: ['update:visible', 'confirm', 'cancel', 'visibleChange'],
  setup(props: PopconfirmProps, { slots, emit, expose }) {
    onMounted(() => {
      devWarning(
        props.defaultVisible === undefined,
        'Popconfirm',
        `'defaultVisible' is deprecated, please use 'v-model:visible'`,
      );
    });
    const tooltipRef = ref();

    expose({
      getPopupDomNode: () => {
        return tooltipRef.value?.getPopupDomNode?.();
      },
    });
    const [visible, setVisible] = useMergedState(false, {
      value: toRef(props, 'visible'),
      defaultValue: props.defaultVisible,
    });

    const settingVisible = (value: boolean, e?: MouseEvent | KeyboardEvent) => {
      if (props.visible === undefined) {
        setVisible(value);
      }

      emit('update:visible', value);
      emit('visibleChange', value, e);
    };

    const onConfirm = (e: MouseEvent) => {
      settingVisible(false, e);
      emit('confirm', e);
    };

    const onCancel = (e: MouseEvent) => {
      settingVisible(false, e);
      emit('cancel', e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC && visible) {
        settingVisible(false, e);
      }
    };

    const onVisibleChange = (value: boolean) => {
      const { disabled } = props;
      if (disabled) {
        return;
      }
      settingVisible(value);
    };
    const { prefixCls: prefixClsConfirm, configProvider } = useConfigInject('popconfirm', props);
    const rootPrefixCls = computed(() => configProvider.getPrefixCls());
    const popoverPrefixCls = computed(() => configProvider.getPrefixCls('popover'));
    const [popconfirmLocale] = useLocaleReceiver('Popconfirm', defaultLocale.Popconfirm);
    const renderOverlay = () => {
      const {
        okButtonProps,
        cancelButtonProps,
        title = slots.title?.(),
        cancelText = slots.cancel?.(),
        okText = slots.okText?.(),
        okType,
        icon = slots.icon?.(),
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
        <div class={`${popoverPrefixCls.value}-inner-content`}>
          <div class={`${popoverPrefixCls.value}-message`}>
            {icon || <ExclamationCircleFilled />}
            <div class={`${popoverPrefixCls.value}-message-title`}>{title}</div>
          </div>
          <div class={`${popoverPrefixCls.value}-buttons`}>
            {cancelButton ? (
              cancelButton(cancelProps)
            ) : (
              <Button {...cancelProps}>{cancelText || popconfirmLocale.value.cancelText}</Button>
            )}
            {okButton ? (
              okButton(okProps)
            ) : (
              <Button {...okProps}>{okText || popconfirmLocale.value.okText}</Button>
            )}
          </div>
        </div>
      );
    };

    return () => {
      const { placement, overlayClassName, ...restProps } = props;
      const otherProps = omit(restProps, [
        'title',
        'content',
        'cancelText',
        'okText',
        'onUpdate:visible',
      ]);
      const overlayClassNames = classNames(prefixClsConfirm.value, overlayClassName);
      return (
        <Tooltip
          {...otherProps}
          prefixCls={popoverPrefixCls.value}
          placement={placement}
          onVisibleChange={onVisibleChange}
          visible={visible.value}
          overlayClassName={overlayClassNames}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          v-slots={{ title: renderOverlay }}
          ref={tooltipRef}
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
        </Tooltip>
      );
    };
  },
});
export default withInstall(Popconfirm);
