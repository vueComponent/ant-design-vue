import type { ExtractPropTypes, CSSProperties } from 'vue';
import { defineComponent, inject } from 'vue';
import VcTooltip from '../vc-tooltip';
import classNames from '../_util/classNames';
import getPlacements from './placements';
import PropTypes from '../_util/vue-types';
import { PresetColorTypes } from '../_util/colors';
import {
  hasProp,
  getComponent,
  getStyle,
  filterEmpty,
  getSlot,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { defaultConfigProvider } from '../config-provider';
import abstractTooltipProps from './abstractTooltipProps';

const splitObject = (obj: any, keys: string[]) => {
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

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);

const tooltipProps = {
  ...props,
  title: PropTypes.VNodeChild,
};

export type TooltipProps = Partial<ExtractPropTypes<typeof tooltipProps>>;

export default defineComponent({
  name: 'ATooltip',
  inheritAttrs: false,
  props: tooltipProps,
  emits: ['update:visible', 'visibleChange'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
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
    handleVisibleChange(visible: boolean) {
      if (!hasProp(this, 'visible')) {
        this.sVisible = this.isNoTitle() ? false : visible;
      }
      if (!this.isNoTitle()) {
        this.$emit('update:visible', visible);
        this.$emit('visibleChange', visible);
      }
    },

    getPopupDomNode() {
      return (this.$refs.tooltip as any).getPopupDomNode();
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
    getDisabledCompatibleChildren(ele: any) {
      if (
        ((typeof ele.type === 'object' &&
          (ele.type.__ANT_BUTTON === true ||
            ele.type.__ANT_SWITCH === true ||
            ele.type.__ANT_CHECKBOX === true)) ||
          ele.type === 'button') &&
        ele.props &&
        (ele.props.disabled || ele.props.disabled === '')
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
          width: ele.props && ele.props.block ? '100%' : null,
        };
        const buttonStyle = {
          ...omitted,
          pointerEvents: 'none',
        };
        const child = cloneElement(
          ele,
          {
            style: buttonStyle,
          },
          true,
        );
        return <span style={spanStyle}>{child}</span>;
      }
      return ele;
    },

    isNoTitle() {
      const title = getComponent(this, 'title');
      return !title && title !== 0;
    },

    getOverlay() {
      const title = getComponent(this, 'title');
      if (title === 0) {
        return title;
      }
      return title || '';
    },

    // 动态设置动画点
    onPopupAlign(domNode: HTMLElement, align: any) {
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
    const { $props, $data, $attrs } = this;
    const {
      prefixCls: customizePrefixCls,
      openClassName,
      getPopupContainer,
      color,
      overlayClassName,
    } = $props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tooltip', customizePrefixCls);
    let children = this.children || filterEmpty(getSlot(this));
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
    const childCls = classNames({
      [openClassName || `${prefixCls}-open`]: sVisible,
      [child.props && child.props.class]: child.props && child.props.class,
    });
    const customOverlayClassName = classNames(overlayClassName, {
      [`${prefixCls}-${color}`]: color && PresetColorRegex.test(color),
    });
    let formattedOverlayInnerStyle: CSSProperties;
    let arrowContentStyle: CSSProperties;
    if (color && !PresetColorRegex.test(color)) {
      formattedOverlayInnerStyle = { backgroundColor: color };
      arrowContentStyle = { backgroundColor: color };
    }

    const vcTooltipProps = {
      ...$attrs,
      ...$props,
      prefixCls,
      getTooltipContainer: getPopupContainer || getContextPopupContainer,
      builtinPlacements: this.getPlacements(),
      overlay: this.getOverlay(),
      visible: sVisible,
      ref: 'tooltip',
      overlayClassName: customOverlayClassName,
      overlayInnerStyle: formattedOverlayInnerStyle,
      arrowContent: <span class={`${prefixCls}-arrow-content`} style={arrowContentStyle}></span>,
      onVisibleChange: this.handleVisibleChange,
      onPopupAlign: this.onPopupAlign,
    };
    return (
      <VcTooltip {...vcTooltipProps}>
        {sVisible ? cloneElement(child, { class: childCls }) : child}
      </VcTooltip>
    );
  },
});
