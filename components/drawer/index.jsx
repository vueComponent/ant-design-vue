import classnames from 'classnames';
import VcDrawer from '../vc-drawer/src';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Icon from '../icon';
import { getComponentFromProp, getOptionProps } from '../_util/props-util';

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
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string.def('ant-drawer'),
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('right'),
    level: PropTypes.any.def(null),
    wrapClassName: PropTypes.string, // not use class like react, vue will add class to root dom
    handle: PropTypes.any,
  },
  mixins: [BaseMixin],
  data() {
    this.destoryClose = false;
    this.preVisible = this.$props.visible;
    return {
      _push: false,
    };
  },
  inject: {
    parentDrawer: {
      default: () => null,
    },
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
    onDestoryTransitionEnd() {
      const isDestroyOnClose = this.getDestoryOnClose();
      if (!isDestroyOnClose) {
        return;
      }
      if (!this.visible) {
        this.destoryClose = true;
        this.$forceUpdate();
      }
    },

    getDestoryOnClose() {
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
    // render drawer body dom
    renderBody() {
      if (this.destoryClose && !this.visible) {
        return null;
      }
      this.destoryClose = false;
      const { placement } = this.$props;

      const containerStyle =
        placement === 'left' || placement === 'right'
          ? {
              overflow: 'auto',
              height: '100%',
            }
          : {};

      const isDestroyOnClose = this.getDestoryOnClose();
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }
      const { prefixCls, closable } = this.$props;
      const title = getComponentFromProp(this, 'title');
      // is have header dom
      let header;
      if (title) {
        header = (
          <div key="header" class={`${prefixCls}-header`}>
            <div class={`${prefixCls}-title`}>{title}</div>
          </div>
        );
      }
      // is have closer button
      let closer;
      if (closable) {
        closer = (
          <button key="closer" onClick={this.close} aria-label="Close" class={`${prefixCls}-close`}>
            <span class={`${prefixCls}-close-x`}>
              <Icon type="close" />
            </span>
          </button>
        );
      }

      return (
        <div
          class={`${prefixCls}-wrapper-body`}
          style={containerStyle}
          onTransitionend={this.onDestoryTransitionEnd}
        >
          {header}
          {closer}
          <div key="body" class={`${prefixCls}-body`}>
            {this.$slots.default}
          </div>
        </div>
      );
    },
    getRcDrawerStyle() {
      const { zIndex, placement, maskStyle, wrapStyle } = this.$props;
      const { _push: push } = this.$data;
      return {
        ...maskStyle,
        zIndex,
        transform: push ? this.getPushTransform(placement) : undefined,
        ...wrapStyle,
      };
    },
  },
  render() {
    const props = getOptionProps(this);
    const { width, height, visible, placement, wrapClassName, ...rest } = props;
    const haveMask = rest.mask ? '' : 'no-mask';
    const offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? `${height}px` : height;
    }
    const handler = getComponentFromProp(this, 'handle') || false;
    const vcDrawerProps = {
      props: {
        ...rest,
        handler,
        ...offsetStyle,
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
        ...this.$listeners,
      },
    };
    return <VcDrawer {...vcDrawerProps}>{this.renderBody()}</VcDrawer>;
  },
};

/* istanbul ignore next */
Drawer.install = function(Vue) {
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
