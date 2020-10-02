import {
  Transition,
  inject,
  cloneVNode,
  defineComponent,
  reactive,
  getCurrentInstance,
  VNode,
  App,
  computed,
  unref,
} from 'vue';
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
import getTransitionProps from '../_util/getTransitionProps';
import alertProps from './alertProps';
import { isValidElement, findDOMNodeBySetup, getComponentFromSetup } from '../_util/props-util';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import { AlertProps, VNodeElement } from './alertTypes';

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

const Alert = defineComponent({
  name: 'AAlert',
  inheritAttrs: false,
  props: alertProps,
  setup(propsValues, { attrs, emit, slots }) {
    const propsRef = computed(() => {
      return { ...attrs, ...propsValues } as AlertProps;
    });
    const instance = getCurrentInstance();

    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);

    const state = reactive({
      closing: false,
      closed: false,
    });

    function handleClose(e: Event) {
      e.preventDefault();
      const dom = findDOMNodeBySetup(instance as any);
      if (!dom) return;
      dom.style.height = `${dom.offsetHeight}px`;
      dom.style.height = `${dom.offsetHeight}px`;

      state.closing = true;
      emit('close', e);
    }
    function animationEnd() {
      state.closing = false;
      state.closed = true;
      unref(propsRef).afterClose?.();
    }
    return () => {
      const props = unref(propsRef);
      const { closing, closed } = state;
      const { prefixCls: customizePrefixCls, banner } = props;
      const prefixCls = getPrefixCls('alert', customizePrefixCls);

      let { closable, type, showIcon } = props;

      const closeText = getComponentFromSetup(propsValues, slots, 'closeText') as VNodeElement;
      const description = getComponentFromSetup(propsValues, slots, 'description') as VNodeElement;
      const message = getComponentFromSetup(propsValues, slots, 'message') as VNodeElement;
      const icon = getComponentFromSetup(propsValues, slots, 'icon') as VNode;
      // banner模式默认有 Icon
      showIcon = banner && showIcon === undefined ? true : showIcon;

      // banner模式默认为警告
      type = banner && type === undefined ? 'warning' : type || 'info';

      const IconType = (description ? iconMapOutlined : iconMapFilled)[type] || null;

      // closeable when closeText is assigned
      if (closeText) {
        closable = true;
      }
      const alertCls = classNames(prefixCls, {
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-closing`]: closing,
        [`${prefixCls}-with-description`]: !!description,
        [`${prefixCls}-no-icon`]: !showIcon,
        [`${prefixCls}-banner`]: !!banner,
        [`${prefixCls}-closable`]: closable,
      });

      const closeIcon = closable ? (
        <a type="button" onClick={handleClose} class={`${prefixCls}-close-icon`} tabindex={0}>
          {closeText ? (
            <span class={`${prefixCls}-close-text`}>{closeText}</span>
          ) : (
            <CloseOutlined />
          )}
        </a>
      ) : null;

      const iconNode = (icon &&
        (isValidElement(icon) ? (
          cloneVNode(icon, {
            class: `${prefixCls}-icon`,
          })
        ) : (
          <span class={`${prefixCls}-icon`}>{icon}</span>
        ))) || <IconType class={`${prefixCls}-icon`} />;

      const transitionProps = getTransitionProps(`${prefixCls}-slide-up`, {
        appear: false,
        onAfterLeave: animationEnd,
      });
      return closed ? null : (
        <Transition {...transitionProps}>
          <div v-show={!closing} class={alertCls} data-show={!closing}>
            {showIcon ? iconNode : null}
            <span class={`${prefixCls}-message`}>{message}</span>
            <span class={`${prefixCls}-description`}>{description}</span>
            {closeIcon}
          </div>
        </Transition>
      );
    };
  },
});

/* istanbul ignore next */
Alert.install = function(app: App<Element>) {
  app.component(Alert.name, Alert);
};

export default Alert;
