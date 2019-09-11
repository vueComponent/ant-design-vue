import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';

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
    icon: String,
    alt: String,
    loadError: Function,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      isImgExist: true,
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
    this.prevChildren = this.$slots.default;
    this.prevState = { ...this.$data };
    this.$nextTick(() => {
      this.setScale();
    });
  },
  updated() {
    if (
      this.preChildren !== this.$slots.default ||
      (this.prevState.scale !== this.$data.scale && this.$data.scale === 1) ||
      this.prevState.isImgExist !== this.$data.isImgExist
    ) {
      this.$nextTick(() => {
        this.setScale();
      });
    }
    this.preChildren = this.$slots.default;
    this.prevState = { ...this.$data };
  },
  methods: {
    setScale() {
      const childrenNode = this.$refs.avatarChildren;
      if (childrenNode) {
        const childrenWidth = childrenNode.offsetWidth;
        const avatarWidth = this.$el.getBoundingClientRect().width;
        if (avatarWidth - 8 < childrenWidth) {
          this.scale = (avatarWidth - 8) / childrenWidth;
        } else {
          this.scale = 1;
        }
        this.$forceUpdate();
      }
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
    const { prefixCls: customizePrefixCls, shape, size, src, icon, alt, srcSet } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('avatar', customizePrefixCls);

    const { isImgExist, scale } = this.$data;

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
      children = <Icon type={icon} />;
    } else {
      const childrenNode = this.$refs.avatarChildren;
      if (childrenNode || (scale !== 1 && childrenNode)) {
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
        children = (
          <span class={`${prefixCls}-string`} ref="avatarChildren">
            {children}
          </span>
        );
      }
    }
    return (
      <span {...{ on: this.$listeners, class: classString, style: sizeStyle }}>{children}</span>
    );
  },
};
