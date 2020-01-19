import classnames from 'classnames';
import VcDrawer from '../vc-drawer/src';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Icon from '../icon';
import { getComponentFromProp, getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

const Drawer = {
  name: 'ADrawer',
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.any,
    maskClosable: PropTypes.bool.def(true),
    mask: PropTypes.bool.def(true),
    maskStyle: PropTypes.object,
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    drawerStyle: PropTypes.object,
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('right'),
    level: PropTypes.any.def(null),
    wrapClassName: PropTypes.string, // not use class like react, vue will add class to root dom
    handle: PropTypes.any,
  },
  mixins: [BaseMixin],
  data() {
    this.destroyClose = false;
    this.preVisible = this.$props.visible;
    return {
      _push: false,
    };
  },
  inject: {
    parentDrawer: {
      default: () => null,
    },
    configProvider: { default: () => ConfigConsumerProps },
  },
  provide() {
    return {
      parentDrawer: this,
    };
  },
  updated() {
    this.$nextTick(() => {
      if (this.preVisible !== this.visible && this.parentDrawer) {
        if (this.visible) {
          this.parentDrawer.push();
        } else {
          this.parentDrawer.pull();
        }
      }
      this.preVisible = this.visible;
    });
  },
  methods: {
    close(e) {
      if (this.visible !== undefined) {
        this.$emit('close', e);
        return;
      }
    },
    onMaskClick(e) {
      if (!this.maskClosable) {
        return;
      }
      this.close(e);
    },
    push() {
      this.setState({
        _push: true,
      });
    },
    pull() {
      this.setState({
        _push: false,
      });
    },
    onDestroyTransitionEnd() {
      const isDestroyOnClose = this.getDestroyOnClose();
      if (!isDestroyOnClose) {
        return;
      }
      if (!this.visible) {
        this.destroyClose = true;
        this.$forceUpdate();
      }
    },

    getDestroyOnClose() {
      return this.destroyOnClose && !this.visible;
    },
    // get drawar push width or height
    getPushTransform(placement) {
      if (placement === 'left' || placement === 'right') {
        return `translateX(${placement === 'left' ? 180 : -180}px)`;
      }
      if (placement === 'top' || placement === 'bottom') {
        return `translateY(${placement === 'top' ? 180 : -180}px)`;
      }
    },
    getRcDrawerStyle() {
      const { zIndex, placement, wrapStyle } = this.$props;
      const { _push: push } = this.$data;
      return {
        zIndex,
        transform: push ? this.getPushTransform(placement) : undefined,
        ...wrapStyle,
      };
    },
    renderHeader(prefixCls) {
      const { closable } = this.$props;
      const title = getComponentFromProp(this, 'title');
      if (!title && !closable) {
        return null;
      }

      const headerClassName = title ? `${prefixCls}-header` : `${prefixCls}-header-no-title`;
      return (
        <div class={headerClassName}>
          {title && <div class={`${prefixCls}-title`}>{title}</div>}
          {closable ? this.renderCloseIcon(prefixCls) : null}
        </div>
      );
    },
    renderCloseIcon(prefixCls) {
      return (
        <button key="closer" onClick={this.close} aria-label="Close" class={`${prefixCls}-close`}>
          <Icon type="close" />
        </button>
      );
    },
    // render drawer body dom
    renderBody(prefixCls) {
      if (this.destroyClose && !this.visible) {
        return null;
      }
      this.destroyClose = false;
      const { placement, bodyStyle, drawerStyle } = this.$props;

      const containerStyle =
        placement === 'left' || placement === 'right'
          ? {
              overflow: 'auto',
              height: '100%',
            }
          : {};

      const isDestroyOnClose = this.getDestroyOnClose();
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }

      return (
        <div
          class={`${prefixCls}-wrapper-body`}
          style={{ ...containerStyle, ...drawerStyle }}
          onTransitionend={this.onDestroyTransitionEnd}
        >
          {this.renderHeader(prefixCls)}
          <div key="body" class={`${prefixCls}-body`} style={bodyStyle}>
            {this.$slots.default}
          </div>
        </div>
      );
    },
  },
  render() {
    const props = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      width,
      height,
      visible,
      placement,
      wrapClassName,
      ...rest
    } = props;
    const haveMask = rest.mask ? '' : 'no-mask';
    const offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? `${height}px` : height;
    }
    const handler = getComponentFromProp(this, 'handle') || false;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('drawer', customizePrefixCls);

    const vcDrawerProps = {
      props: {
        ...rest,
        handler,
        ...offsetStyle,
        prefixCls,
        open: visible,
        showMask: props.mask,
        placement,
        className: classnames({
          [wrapClassName]: !!wrapClassName,
          [haveMask]: !!haveMask,
        }),
        wrapStyle: this.getRcDrawerStyle(),
      },
      on: {
        maskClick: this.onMaskClick,
        ...getListeners(this),
      },
    };
    return <VcDrawer {...vcDrawerProps}>{this.renderBody(prefixCls)}</VcDrawer>;
  },
};

/* istanbul ignore next */
Drawer.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
