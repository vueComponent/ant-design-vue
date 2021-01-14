import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';
import { getListeners, getComponentFromProp } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export default {
  name: 'AAvatar',
  props: {
    prefixCls: {
      type: String,
      default: undefined,
    },
    shape: {
      validator: val => ['circle', 'square'].includes(val),
      default: 'circle',
    },
    size: {
      validator: val => {
        return typeof val === 'number' || ['small', 'large', 'default'].includes(val);
      },
      default: 'default',
    },
    src: String,
    /** Srcset of image avatar */
    srcSet: String,
    icon: PropTypes.any,
    alt: String,
    loadError: Function,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      isImgExist: true,
      isMounted: false,
      scale: 1,
    };
  },
  watch: {
    src() {
      this.$nextTick(() => {
        this.isImgExist = true;
        this.scale = 1;
        // force uodate for position
        this.$forceUpdate();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setScale();
      this.isMounted = true;
    });
  },
  updated() {
    this.$nextTick(() => {
      this.setScale();
    });
  },
  methods: {
    setScale() {
      if (!this.$refs.avatarChildren || !this.$refs.avatarNode) {
        return;
      }
      const childrenWidth = this.$refs.avatarChildren.offsetWidth; // offsetWidth avoid affecting be transform scale
      const nodeWidth = this.$refs.avatarNode.offsetWidth;
      // denominator is 0 is no meaning
      if (
        childrenWidth === 0 ||
        nodeWidth === 0 ||
        (this.lastChildrenWidth === childrenWidth && this.lastNodeWidth === nodeWidth)
      ) {
        return;
      }
      this.lastChildrenWidth = childrenWidth;
      this.lastNodeWidth = nodeWidth;
      // add 4px gap for each side to get better performance
      this.scale = nodeWidth - 8 < childrenWidth ? (nodeWidth - 8) / childrenWidth : 1;
    },
    handleImgLoadError() {
      const { loadError } = this.$props;
      const errorFlag = loadError ? loadError() : undefined;
      if (errorFlag !== false) {
        this.isImgExist = false;
      }
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, shape, size, src, alt, srcSet } = this.$props;
    const icon = getComponentFromProp(this, 'icon');
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('avatar', customizePrefixCls);

    const { isImgExist, scale, isMounted } = this.$data;

    const sizeCls = {
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    };

    const classString = {
      [prefixCls]: true,
      ...sizeCls,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-image`]: src && isImgExist,
      [`${prefixCls}-icon`]: icon,
    };

    const sizeStyle =
      typeof size === 'number'
        ? {
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: `${size}px`,
            fontSize: icon ? `${size / 2}px` : '18px',
          }
        : {};

    let children = this.$slots.default;
    if (src && isImgExist) {
      children = <img src={src} srcSet={srcSet} onError={this.handleImgLoadError} alt={alt} />;
    } else if (icon) {
      if (typeof icon === 'string') {
        children = <Icon type={icon} />;
      } else {
        children = icon;
      }
    } else {
      const childrenNode = this.$refs.avatarChildren;
      if (childrenNode || scale !== 1) {
        const transformString = `scale(${scale}) translateX(-50%)`;
        const childrenStyle = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString,
        };
        const sizeChildrenStyle =
          typeof size === 'number'
            ? {
                lineHeight: `${size}px`,
              }
            : {};
        children = (
          <span
            class={`${prefixCls}-string`}
            ref="avatarChildren"
            style={{ ...sizeChildrenStyle, ...childrenStyle }}
          >
            {children}
          </span>
        );
      } else {
        const childrenStyle = {};
        if (!isMounted) {
          childrenStyle.opacity = 0;
        }
        children = (
          <span class={`${prefixCls}-string`} ref="avatarChildren" style={{ opacity: 0 }}>
            {children}
          </span>
        );
      }
    }
    return (
      <span ref="avatarNode" {...{ on: getListeners(this), class: classString, style: sizeStyle }}>
        {children}
      </span>
    );
  },
};
