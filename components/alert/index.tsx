import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, shallowRef, Transition } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getTransitionProps } from '../_util/transition';
import { isValidElement } from '../_util/props-util';
import { tuple, withInstall } from '../_util/type';
import { cloneElement } from '../_util/vnode';
import type { NodeMouseEventHandler } from '../vc-tree/contextTypes';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};

const iconMapOutlined = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
};

const AlertTypes = tuple('success', 'info', 'warning', 'error');

export type AlertType = (typeof AlertTypes)[number];

export const alertProps = () => ({
  /**
   * Type of Alert styles, options: `success`, `info`, `warning`, `error`
   */
  type: PropTypes.oneOf(AlertTypes),
  /** Whether Alert can be closed */
  closable: { type: Boolean, default: undefined },
  /** Close text to show */
  closeText: PropTypes.any,
  /** Content of Alert */
  message: PropTypes.any,
  /** Additional content of Alert */
  description: PropTypes.any,
  /** Trigger when animation ending of Alert */
  afterClose: Function as PropType<() => void>,
  /** Whether to show icon */
  showIcon: { type: Boolean, default: undefined },
  prefixCls: String,
  banner: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  closeIcon: PropTypes.any,
  onClose: Function as PropType<NodeMouseEventHandler>,
});

export type AlertProps = Partial<ExtractPropTypes<ReturnType<typeof alertProps>>>;

const Alert = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAlert',
  inheritAttrs: false,
  props: alertProps(),
  setup(props, { slots, emit, attrs, expose }) {
    const { prefixCls, direction } = useConfigInject('alert', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const closing = shallowRef(false);
    const closed = shallowRef(false);
    const alertNode = shallowRef();

    const handleClose = (e: MouseEvent) => {
      e.preventDefault();

      const dom = alertNode.value;

      dom.style.height = `${dom.offsetHeight}px`;
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = `${dom.offsetHeight}px`;

      closing.value = true;
      emit('close', e);
    };

    const animationEnd = () => {
      closing.value = false;
      closed.value = true;
      props.afterClose?.();
    };
    const mergedType = computed(() => {
      const { type } = props;
      if (type !== undefined) {
        return type;
      }
      // banner 模式默认为警告
      return props.banner ? 'warning' : 'info';
    });
    expose({ animationEnd });
    const motionStyle = shallowRef<CSSProperties>({});
    return () => {
      const { banner, closeIcon: customCloseIcon = slots.closeIcon?.() } = props;

      let { closable, showIcon } = props;

      const closeText = props.closeText ?? slots.closeText?.();
      const description = props.description ?? slots.description?.();
      const message = props.message ?? slots.message?.();
      const icon = props.icon ?? slots.icon?.();
      const action = slots.action?.();

      // banner模式默认有 Icon
      showIcon = banner && showIcon === undefined ? true : showIcon;

      const IconType = (description ? iconMapOutlined : iconMapFilled)[mergedType.value] || null;

      // closeable when closeText is assigned
      if (closeText) {
        closable = true;
      }
      const prefixClsValue = prefixCls.value;
      const alertCls = classNames(prefixClsValue, {
        [`${prefixClsValue}-${mergedType.value}`]: true,
        [`${prefixClsValue}-closing`]: closing.value,
        [`${prefixClsValue}-with-description`]: !!description,
        [`${prefixClsValue}-no-icon`]: !showIcon,
        [`${prefixClsValue}-banner`]: !!banner,
        [`${prefixClsValue}-closable`]: closable,
        [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true,
      });

      const closeIcon = closable ? (
        <button
          type="button"
          onClick={handleClose}
          class={`${prefixClsValue}-close-icon`}
          tabindex={0}
        >
          {closeText ? (
            <span class={`${prefixClsValue}-close-text`}>{closeText}</span>
          ) : customCloseIcon === undefined ? (
            <CloseOutlined />
          ) : (
            customCloseIcon
          )}
        </button>
      ) : null;

      const iconNode = (icon &&
        (isValidElement(icon) ? (
          cloneElement(icon, {
            class: `${prefixClsValue}-icon`,
          })
        ) : (
          <span class={`${prefixClsValue}-icon`}>{icon}</span>
        ))) || <IconType class={`${prefixClsValue}-icon`} />;

      const transitionProps = getTransitionProps(`${prefixClsValue}-motion`, {
        appear: false,
        css: true,
        onAfterLeave: animationEnd,
        onBeforeLeave: (node: HTMLDivElement) => {
          node.style.maxHeight = `${node.offsetHeight}px`;
        },
        onLeave: (node: HTMLDivElement) => {
          node.style.maxHeight = '0px';
        },
      });
      return wrapSSR(
        closed.value ? null : (
          <Transition {...transitionProps}>
            <div
              role="alert"
              {...attrs}
              style={[attrs.style as CSSProperties, motionStyle.value]}
              v-show={!closing.value}
              class={[attrs.class, alertCls]}
              data-show={!closing.value}
              ref={alertNode}
            >
              {showIcon ? iconNode : null}
              <div class={`${prefixClsValue}-content`}>
                {message ? <div class={`${prefixClsValue}-message`}>{message}</div> : null}
                {description ? (
                  <div class={`${prefixClsValue}-description`}>{description}</div>
                ) : null}
              </div>
              {action ? <div class={`${prefixClsValue}-action`}>{action}</div> : null}
              {closeIcon}
            </div>
          </Transition>
        ),
      );
    };
  },
});

export default withInstall(Alert);
