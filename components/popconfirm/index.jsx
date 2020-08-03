import omit from 'omit.js';
import { inject } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, hasProp, getComponent, mergeProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider';

const tooltipProps = abstractTooltipProps();
const btnProps = buttonTypes();
const Popconfirm = {
  name: 'APopconfirm',
  props: {
    ...tooltipProps,
    prefixCls: PropTypes.string,
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    disabled: PropTypes.bool.def(false),
    okText: PropTypes.any,
    cancelText: PropTypes.any,
    icon: PropTypes.any,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onVisibleChange: PropTypes.func,
    'onUpdate:visible': PropTypes.func,
  },
  mixins: [BaseMixin],
  watch: {
    visible(val) {
      this.sVisible = val;
    },
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    const props = getOptionProps(this);
    const state = { sVisible: false };
    if ('visible' in props) {
      state.sVisible = props.visible;
    }
    if ('defaultVisible' in props) {
      state.sVisible = props.defaultVisible;
    }
    return state;
  },
  methods: {
    onConfirmHandle(e) {
      this.setVisible(false, e);
      this.$emit('confirm', e);
    },

    onCancelHandle(e) {
      this.setVisible(false, e);
      this.$emit('cancel', e);
    },

    onVisibleChangeHandle(sVisible) {
      const { disabled } = this.$props;
      if (disabled) {
        return;
      }
      this.setVisible(sVisible);
    },

    setVisible(sVisible, e) {
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible });
      }
      this.$emit('update:visible', sVisible);
      this.$emit('visibleChange', sVisible, e);
    },
    getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay(prefixCls, popconfirmLocale) {
      const { okType, okButtonProps, cancelButtonProps } = this;
      const icon = getComponent(this, 'icon') || <ExclamationCircleFilled />;
      const cancelBtnProps = mergeProps({
        size: 'small',
        onClick: this.onCancelHandle,
        ...cancelButtonProps,
      });
      const okBtnProps = mergeProps({
        type: okType,
        size: 'small',
        onClick: this.onConfirmHandle,
        ...okButtonProps,
      });
      return (
        <div class={`${prefixCls}-inner-content`}>
          <div class={`${prefixCls}-message`}>
            {icon}
            <div class={`${prefixCls}-message-title`}>{getComponent(this, 'title')}</div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            <Button {...cancelBtnProps}>
              {getComponent(this, 'cancelText') || popconfirmLocale.cancelText}
            </Button>
            <Button {...okBtnProps}>
              {getComponent(this, 'okText') || popconfirmLocale.okText}
            </Button>
          </div>
        </div>
      );
    },
  },
  render() {
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('popover', customizePrefixCls);

    const otherProps = omit(props, [
      'title',
      'content',
      'cancelText',
      'okText',
      'onUpdate:visible',
    ]);
    const overlay = (
      <LocaleReceiver
        componentName="Popconfirm"
        defaultLocale={defaultLocale.Popconfirm}
        children={popconfirmLocale => this.renderOverlay(prefixCls, popconfirmLocale)}
      />
    );
    const tooltipProps = {
      ...otherProps,
      title: overlay,
      prefixCls,
      visible: this.sVisible,
      ref: 'tooltip',
      onVisibleChange: this.onVisibleChangeHandle,
    };
    return <Tooltip {...tooltipProps}>{this.$slots?.default()}</Tooltip>;
  },
};

/* istanbul ignore next */
Popconfirm.install = function(app) {
  app.component(Popconfirm.name, Popconfirm);
};

export default Popconfirm;
