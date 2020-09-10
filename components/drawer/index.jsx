import { inject, provide, nextTick } from 'vue';
import classnames from '../_util/classNames';
import omit from 'omit.js';
import VcDrawer from '../vc-drawer/src';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { getComponent, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

const Drawer = {
  name: 'ADrawer',
  inheritAttrs: false,
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.any,
    maskClosable: PropTypes.bool.def(true),
    mask: PropTypes.bool.def(true),
    maskStyle: PropTypes.object,
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    headerStyle: PropTypes.object,
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
    afterVisibleChange: PropTypes.func,
    keyboard: PropTypes.bool.def(true),
    onClose: PropTypes.func,
    'onUpdate:visible': PropTypes.func,
  },
  mixins: [BaseMixin],
  data() {
    this.destroyClose = false;
    this.preVisible = this.$props.visible;
    return {
      _push: false,
    };
  },
  setup() {
    const configProvider = inject('configProvider', ConfigConsumerProps);
    return {
      configProvider,
    };
  },
  beforeCreate() {
    const parentDrawer = inject('parentDrawer', null);
    provide('parentDrawer', this);
    this.parentDrawer = parentDrawer;
  },
  mounted() {
    // fix: delete drawer in child and re-render, no push started.
    // <Drawer>{show && <Drawer />}</Drawer>
    const { visible } = this;
    if (visible && this.parentDrawer) {
      this.parentDrawer.push();
    }
  },
  updated() {
    nextTick(() => {
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
  beforeUnmount() {
    // unmount drawer in child, clear push.
    if (this.parentDrawer) {
      this.parentDrawer.pull();
    }
  },
  methods: {
    close(e) {
      this.$emit('update:visible', false);
      this.$emit('close', e);
    },
    // onMaskClick(e) {
    //   if (!this.maskClosable) {
    //     return;
    //   }
    //   this.close(e);
    // },
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
      const { closable, headerStyle } = this.$props;
      const title = getComponent(this, 'title');
      if (!title && !closable) {
        return null;
      }

      const headerClassName = title ? `${prefixCls}-header` : `${prefixCls}-header-no-title`;
      return (
        <div class={headerClassName} style={headerStyle}>
          {title && <div class={`${prefixCls}-title`}>{title}</div>}
          {closable ? this.renderCloseIcon(prefixCls) : null}
        </div>
      );
    },
    renderCloseIcon(prefixCls) {
      const { closable } = this;
      return (
        closable && (
          <button key="closer" onClick={this.close} aria-label="Close" class={`${prefixCls}-close`}>
            <CloseOutlined />
          </button>
        )
      );
    },
    // render drawer body dom
    renderBody(prefixCls) {
      if (this.destroyClose && !this.visible) {
        return null;
      }
      this.destroyClose = false;
      const { bodyStyle, drawerStyle } = this.$props;

      const containerStyle = {};

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
            {this.$slots.default && this.$slots.default()}
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
      mask,
      ...rest
    } = props;
    const haveMask = mask ? '' : 'no-mask';
    const offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? `${height}px` : height;
    }
    const handler = getComponent(this, 'handle') || false;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('drawer', customizePrefixCls);
    const { class: className } = this.$attrs;
    const vcDrawerProps = {
      ...this.$attrs,
      ...omit(rest, [
        'closable',
        'destroyOnClose',
        'drawerStyle',
        'headerStyle',
        'bodyStyle',
        'title',
        'push',
        'visible',
        'getPopupContainer',
        'rootPrefixCls',
        'getPrefixCls',
        'renderEmpty',
        'csp',
        'pageHeader',
        'autoInsertSpaceInButton',
      ]),
      onClose: this.close,
      handler,
      ...offsetStyle,
      prefixCls,
      open: visible,
      showMask: mask,
      placement,
      class: classnames({
        [className]: !!className,
        [wrapClassName]: !!wrapClassName,
        [haveMask]: !!haveMask,
      }),
      wrapStyle: this.getRcDrawerStyle(),
    };
    return <VcDrawer {...vcDrawerProps}>{this.renderBody(prefixCls)}</VcDrawer>;
  },
};

/* istanbul ignore next */
Drawer.install = function(app) {
  app.component(Drawer.name, Drawer);
};

export default Drawer;
