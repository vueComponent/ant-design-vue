import type { ExtractPropTypes, CSSProperties } from 'vue';
import { computed, watch, defineComponent, onMounted, ref } from 'vue';
import VcTooltip from '../vc-tooltip';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { PresetColorTypes } from '../_util/colors';
import warning from '../_util/warning';
import { getStyle, filterEmpty, isValidElement, initDefaultProps } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
export type { TriggerType, TooltipPlacement } from './abstractTooltipProps';
import abstractTooltipProps from './abstractTooltipProps';
import useConfigInject from '../_util/hooks/useConfigInject';
import getPlacements from './placements';
import firstNotUndefined from '../_util/firstNotUndefined';
import raf from '../_util/raf';
export type { AdjustOverflow, PlacementsConfig } from './placements';

// https://github.com/react-component/tooltip
// https://github.com/yiminghe/dom-align
export interface TooltipAlignConfig {
  points?: [string, string];
  offset?: [number | string, number | string];
  targetOffset?: [number | string, number | string];
  overflow?: { adjustX: boolean; adjustY: boolean };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
}

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

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);

export const tooltipProps = () => ({
  ...abstractTooltipProps(),
  title: PropTypes.any,
});

export const tooltipDefaultProps = () => ({
  trigger: 'hover',
  transitionName: 'zoom-big-fast',
  align: {},
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true,
});

export type TooltipProps = Partial<ExtractPropTypes<ReturnType<typeof tooltipProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATooltip',
  inheritAttrs: false,
  props: initDefaultProps(tooltipProps(), {
    trigger: 'hover',
    transitionName: 'zoom-big-fast',
    align: {},
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
  }),
  slots: ['title'],
  // emits: ['update:visible', 'visibleChange'],
  setup(props, { slots, emit, attrs, expose }) {
    const { prefixCls, getPopupContainer } = useConfigInject('tooltip', props);

    const visible = ref(firstNotUndefined([props.visible, props.defaultVisible]));

    const tooltip = ref();

    onMounted(() => {
      warning(
        props.defaultVisible === undefined,
        'Tooltip',
        `'defaultVisible' is deprecated, please use 'v-model:visible'`,
      );
    });
    let rafId: any;
    watch(
      () => props.visible,
      val => {
        raf.cancel(rafId);
        rafId = raf(() => {
          visible.value = !!val;
        });
      },
    );
    const isNoTitle = () => {
      const title = props.title ?? slots.title;
      return !title && title !== 0;
    };

    const handleVisibleChange = (val: boolean) => {
      const noTitle = isNoTitle();
      if (props.visible === undefined) {
        visible.value = noTitle ? false : val;
      }
      if (!noTitle) {
        emit('update:visible', val);
        emit('visibleChange', val);
      }
    };

    const getPopupDomNode = () => {
      return tooltip.value.getPopupDomNode();
    };

    expose({ getPopupDomNode, visible, forcePopupAlign: () => tooltip.value?.forcePopupAlign() });

    const tooltipPlacements = computed(() => {
      const { builtinPlacements, arrowPointAtCenter, autoAdjustOverflow } = props;
      return (
        builtinPlacements ||
        getPlacements({
          arrowPointAtCenter,
          autoAdjustOverflow,
        })
      );
    });
    const isTrueProps = (val: boolean | '') => {
      return val || val === '';
    };
    const getDisabledCompatibleChildren = (ele: any) => {
      const elementType = ele.type as any;
      if (typeof elementType === 'object' && ele.props) {
        if (
          ((elementType.__ANT_BUTTON === true || elementType === 'button') &&
            isTrueProps(ele.props.disabled)) ||
          (elementType.__ANT_SWITCH === true &&
            (isTrueProps(ele.props.disabled) || isTrueProps(ele.props.loading)))
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
            lineHeight: 1, // use the true height of child nodes
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
          return (
            <span style={spanStyle} class={`${prefixCls.value}-disabled-compatible-wrapper`}>
              {child}
            </span>
          );
        }
      }
      return ele;
    };

    const getOverlay = () => {
      return props.title ?? slots.title?.();
    };

    const onPopupAlign = (domNode: HTMLElement, align: any) => {
      const placements = tooltipPlacements.value;
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
    };

    return () => {
      const { openClassName, color, overlayClassName } = props;
      let children = filterEmpty(slots.default?.()) ?? null;
      children = children.length === 1 ? children[0] : children;

      let tempVisible = visible.value;
      // Hide tooltip when there is no title
      if (props.visible === undefined && isNoTitle()) {
        tempVisible = false;
      }
      if (!children) {
        return null;
      }
      const child = getDisabledCompatibleChildren(
        isValidElement(children) ? children : <span>{children}</span>,
      );
      const childCls = classNames({
        [openClassName || `${prefixCls.value}-open`]: true,
        [child.props && child.props.class]: child.props && child.props.class,
      });
      const customOverlayClassName = classNames(overlayClassName, {
        [`${prefixCls.value}-${color}`]: color && PresetColorRegex.test(color),
      });
      let formattedOverlayInnerStyle: CSSProperties;
      let arrowContentStyle: CSSProperties;
      if (color && !PresetColorRegex.test(color)) {
        formattedOverlayInnerStyle = { backgroundColor: color };
        arrowContentStyle = { backgroundColor: color };
      }
      const vcTooltipProps = {
        ...attrs,
        ...(props as TooltipProps),
        prefixCls: prefixCls.value,
        getPopupContainer: getPopupContainer.value,
        builtinPlacements: tooltipPlacements.value,
        visible: tempVisible,
        ref: tooltip,
        overlayClassName: customOverlayClassName,
        overlayInnerStyle: formattedOverlayInnerStyle,
        onVisibleChange: handleVisibleChange,
        onPopupAlign,
      };
      return (
        <VcTooltip
          {...vcTooltipProps}
          v-slots={{
            arrowContent: () => (
              <span class={`${prefixCls.value}-arrow-content`} style={arrowContentStyle}></span>
            ),
            overlay: getOverlay,
          }}
        >
          {visible.value ? cloneElement(child, { class: childCls }) : child}
        </VcTooltip>
      );
    };
  },
});
