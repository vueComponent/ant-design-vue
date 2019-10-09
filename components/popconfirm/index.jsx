import omit from 'omit.js';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, hasProp, getComponentFromProp, mergeProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import Icon from '../icon';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

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
    okText: PropTypes.any,
    cancelText: PropTypes.any,
    icon: PropTypes.any,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
  },
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  watch: {
    visible(val) {
      this.sVisible = val;
    },
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const props = getOptionProps(this);
    const state = { sVisible: false };
    if ('visible' in props) {
      state.sVisible = props.visible;
    } else if ('defaultVisible' in props) {
      state.sVisible = props.defaultVisible;
    }
    return state;
  },
  methods: {
    onConfirm(e) {
      this.setVisible(false, e);
      this.$emit('confirm', e);
    },

    onCancel(e) {
      this.setVisible(false, e);
      this.$emit('cancel', e);
    },

    onVisibleChange(sVisible) {
      this.setVisible(sVisible);
    },

    setVisible(sVisible, e) {
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible });
      }
      this.$emit('visibleChange', sVisible, e);
    },
    getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay(prefixCls, popconfirmLocale) {
      const { okType, okButtonProps, cancelButtonProps } = this;
      const icon = getComponentFromProp(this, 'icon') || (
        <Icon type="exclamation-circle" theme="filled" />
      );
      const cancelBtnProps = mergeProps(
        {
          props: {
            size: 'small',
          },
          on: {
            click: this.onCancel,
          },
        },
        cancelButtonProps,
      );
      const okBtnProps = mergeProps(
        {
          props: {
            type: okType,
            size: 'small',
          },
          on: {
            click: this.onConfirm,
          },
        },
        okButtonProps,
      );
      return (
        <div class={`${prefixCls}-inner-content`}>
          <div class={`${prefixCls}-message`}>
            {icon}
            <div class={`${prefixCls}-message-title`}>{getComponentFromProp(this, 'title')}</div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            <Button {...cancelBtnProps}>
              {getComponentFromProp(this, 'cancelText') || popconfirmLocale.cancelText}
            </Button>
            <Button {...okBtnProps}>
              {getComponentFromProp(this, 'okText') || popconfirmLocale.okText}
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

    const otherProps = omit(props, ['title', 'content', 'cancelText', 'okText']);
    const tooltipProps = {
      props: {
        ...otherProps,
        prefixCls,
        visible: this.sVisible,
      },
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange,
      },
    };
    const overlay = (
      <LocaleReceiver
        componentName="Popconfirm"
        defaultLocale={defaultLocale.Popconfirm}
        scopedSlots={{
          default: popconfirmLocale => this.renderOverlay(prefixCls, popconfirmLocale),
        }}
      />
    );
    return (
      <Tooltip {...tooltipProps}>
        <template slot="title">{overlay}</template>
        {this.$slots.default}
      </Tooltip>
    );
  },
};

/* istanbul ignore next */
Popconfirm.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Popconfirm.name, Popconfirm);
};

export default Popconfirm;
