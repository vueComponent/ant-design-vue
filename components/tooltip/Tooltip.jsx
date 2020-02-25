import { cloneElement } from '../_util/vnode';
import VcTooltip from '../vc-tooltip';
import getPlacements from './placements';
import PropTypes from '../_util/vue-types';
import {
  hasProp,
  getComponentFromProp,
  getClass,
  getStyle,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import abstractTooltipProps from './abstractTooltipProps';

const splitObject = (obj, keys) => {
  const picked = {};
  const omitted = { ...obj };
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked, omitted };
};
const props = abstractTooltipProps();
export default {
  name: 'ATooltip',
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  props: {
    ...props,
    title: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      sVisible: !!this.$props.visible || !!this.$props.defaultVisible,
    };
  },
  watch: {
    visible(val) {
      this.sVisible = val;
    },
  },
  methods: {
    onVisibleChange(visible) {
      if (!hasProp(this, 'visible')) {
        this.sVisible = this.isNoTitle() ? false : visible;
      }
      if (!this.isNoTitle()) {
        this.$emit('visibleChange', visible);
      }
    },

    getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },

    getPlacements() {
      const { builtinPlacements, arrowPointAtCenter, autoAdjustOverflow } = this.$props;
      return (
        builtinPlacements ||
        getPlacements({
          arrowPointAtCenter,
          verticalArrowShift: 8,
          autoAdjustOverflow,
        })
      );
    },

    // Fix Tooltip won't hide at disabled button
    // mouse events don't trigger at disabled button in Chrome
    // https://github.com/react-component/tooltip/issues/18
    getDisabledCompatibleChildren(ele) {
      const isAntBtn = ele.componentOptions && ele.componentOptions.Ctor.options.__ANT_BUTTON;
      if (
        (isAntBtn &&
          (ele.componentOptions.propsData.disabled ||
            ele.componentOptions.propsData.disabled === '')) ||
        (ele.tag === 'button' &&
          ele.data &&
          ele.data.attrs &&
          ele.data.attrs.disabled !== undefined)
      ) {
        // Pick some layout related style properties up to span
        // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
        const { picked, omitted } = splitObject(getStyle(ele), [
          'position',
          'left',
          'right',
          'top',
          'bottom',
          'float',
          'display',
          'zIndex',
        ]);
        const spanStyle = {
          display: 'inline-block', // default inline-block is important
          ...picked,
          cursor: 'not-allowed',
          width: isAntBtn && ele.componentOptions.propsData.block ? '100%' : null,
        };
        const buttonStyle = {
          ...omitted,
          pointerEvents: 'none',
        };
        const spanCls = getClass(ele);
        const child = cloneElement(ele, {
          style: buttonStyle,
          class: null,
        });
        return (
          <span style={spanStyle} class={spanCls}>
            {child}
          </span>
        );
      }
      return ele;
    },

    isNoTitle() {
      const { $slots, title } = this;
      return !$slots.title && !title;
    },

    // 动态设置动画点
    onPopupAlign(domNode, align) {
      const placements = this.getPlacements();
      // 当前返回的位置
      const placement = Object.keys(placements).filter(
        key =>
          placements[key].points[0] === align.points[0] &&
          placements[key].points[1] === align.points[1],
      )[0];
      if (!placement) {
        return;
      }
      // 根据当前坐标设置动画点
      const rect = domNode.getBoundingClientRect();
      const transformOrigin = {
        top: '50%',
        left: '50%',
      };
      if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
        transformOrigin.top = `${rect.height - align.offset[1]}px`;
      } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
        transformOrigin.top = `${-align.offset[1]}px`;
      }
      if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
        transformOrigin.left = `${rect.width - align.offset[0]}px`;
      } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
        transformOrigin.left = `${-align.offset[0]}px`;
      }
      domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
    },
  },

  render() {
    const { $props, $data, $slots } = this;
    const { prefixCls: customizePrefixCls, openClassName, getPopupContainer } = $props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tooltip', customizePrefixCls);
    let children = ($slots.default || []).filter(c => c.tag || c.text.trim() !== '');
    children = children.length === 1 ? children[0] : children;
    let sVisible = $data.sVisible;
    // Hide tooltip when there is no title
    if (!hasProp(this, 'visible') && this.isNoTitle()) {
      sVisible = false;
    }
    if (!children) {
      return null;
    }
    const child = this.getDisabledCompatibleChildren(
      isValidElement(children) ? children : <span>{children}</span>,
    );
    const childCls = {
      [openClassName || `${prefixCls}-open`]: true,
    };
    const tooltipProps = {
      props: {
        ...$props,
        prefixCls,
        getTooltipContainer: getPopupContainer || getContextPopupContainer,
        builtinPlacements: this.getPlacements(),
        visible: sVisible,
      },
      ref: 'tooltip',
      on: {
        ...getListeners(this),
        visibleChange: this.onVisibleChange,
        popupAlign: this.onPopupAlign,
      },
    };
    return (
      <VcTooltip {...tooltipProps}>
        <template slot="overlay">{getComponentFromProp(this, 'title')}</template>
        {sVisible ? cloneElement(child, { class: childCls }) : child}
      </VcTooltip>
    );
  },
};
