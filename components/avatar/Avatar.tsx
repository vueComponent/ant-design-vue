import { tuple, VueNode } from '../_util/type';
import { CSSProperties, defineComponent, inject, nextTick, PropType } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import { getComponent } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export default defineComponent({
  name: 'AAvatar',
  props: {
    prefixCls: PropTypes.string,
    shape: PropTypes.oneOf(tuple('circle', 'square')),
    size: {
      type: [Number, String] as PropType<'large' | 'small' | 'default' | number>,
      default: 'default',
    },
    src: PropTypes.string,
    /** Srcset of image avatar */
    srcset: PropTypes.string,
    /** @deprecated please use `srcset` instead `srcSet` */
    srcSet: PropTypes.string,
    icon: PropTypes.VNodeChild,
    alt: PropTypes.string,
    loadError: {
      type: Function as PropType<() => boolean>,
    },
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      isImgExist: true,
      isMounted: false,
      scale: 1,
      lastChildrenWidth: undefined,
      lastNodeWidth: undefined,
    };
  },
  watch: {
    src() {
      nextTick(() => {
        this.isImgExist = true;
        this.scale = 1;
        // force uodate for position
        this.$forceUpdate();
      });
    },
  },
  mounted() {
    nextTick(() => {
      this.setScale();
      this.isMounted = true;
    });
  },
  updated() {
    nextTick(() => {
      this.setScale();
    });
  },
  methods: {
    setScale() {
      if (!this.$refs.avatarChildren || !this.$refs.avatarNode) {
        return;
      }
      const childrenWidth = (this.$refs.avatarChildren as HTMLElement).offsetWidth; // offsetWidth avoid affecting be transform scale
      const nodeWidth = (this.$refs.avatarNode as HTMLElement).offsetWidth;
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
    const { prefixCls: customizePrefixCls, shape, size, src, alt, srcset, srcSet } = this.$props;
    const icon = getComponent(this, 'icon');
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

    const sizeStyle: CSSProperties =
      typeof size === 'number'
        ? {
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: `${size}px`,
            fontSize: icon ? `${size / 2}px` : '18px',
          }
        : {};

    let children: VueNode = this.$slots.default?.();
    if (src && isImgExist) {
      children = (
        <img src={src} srcset={srcset || srcSet} onError={this.handleImgLoadError} alt={alt} />
      );
    } else if (icon) {
      children = icon;
    } else {
      const childrenNode = this.$refs.avatarChildren;
      if (childrenNode || scale !== 1) {
        const transformString = `scale(${scale}) translateX(-50%)`;
        const childrenStyle: CSSProperties = {
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
        const childrenStyle: CSSProperties = {};
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
      <span ref="avatarNode" class={classString} style={sizeStyle}>
        {children}
      </span>
    );
  },
});
