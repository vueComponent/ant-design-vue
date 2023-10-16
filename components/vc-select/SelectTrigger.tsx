import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import type { CSSProperties, PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';
import type { VueNode } from '../_util/type';
import type { DropdownRender, Placement, RenderDOMFunc } from './BaseSelect';
import type { AlignType } from '../vc-trigger/interface';

const getBuiltInPlacements = (dropdownMatchSelectWidth: number | boolean) => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = dropdownMatchSelectWidth === true ? 0 : 1;
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
    },
  };
};

export interface RefTriggerProps {
  getPopupElement: () => HTMLDivElement;
}

export interface SelectTriggerProps {
  prefixCls: string;
  disabled: boolean;
  visible: boolean;
  popupElement: VueNode;
  animation?: string;
  transitionName?: string;
  containerWidth: number;
  placement?: Placement;
  dropdownStyle: CSSProperties;
  dropdownClassName: string;
  direction: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: DropdownRender;
  getPopupContainer?: RenderDOMFunc;
  dropdownAlign: AlignType;
  empty: boolean;
  getTriggerDOMNode: () => any;
  onPopupVisibleChange?: (visible: boolean) => void;

  onPopupMouseEnter: () => void;
  onPopupFocusin: () => void;
  onPopupFocusout: () => void;
}

const SelectTrigger = defineComponent<SelectTriggerProps, { popupRef: any }>({
  name: 'SelectTrigger',
  inheritAttrs: false,
  props: {
    dropdownAlign: Object as PropType<AlignType>,
    visible: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    dropdownClassName: String,
    dropdownStyle: PropTypes.object,
    placement: String,
    empty: { type: Boolean, default: undefined },
    prefixCls: String,
    popupClassName: String,
    animation: String,
    transitionName: String,
    getPopupContainer: Function,
    dropdownRender: Function,
    containerWidth: Number,
    dropdownMatchSelectWidth: PropTypes.oneOfType([Number, Boolean]).def(true),
    popupElement: PropTypes.any,
    direction: String,
    getTriggerDOMNode: Function,
    onPopupVisibleChange: Function as PropType<(open: boolean) => void>,
    onPopupMouseEnter: Function,
    onPopupFocusin: Function,
    onPopupFocusout: Function,
  } as any,
  setup(props, { slots, attrs, expose }) {
    const builtInPlacements = computed(() => {
      const { dropdownMatchSelectWidth } = props;
      return getBuiltInPlacements(dropdownMatchSelectWidth);
    });
    const popupRef = ref();
    expose({
      getPopupElement: () => {
        return popupRef.value;
      },
    });
    return () => {
      const { empty = false, ...restProps } = { ...props, ...attrs };
      const {
        visible,
        dropdownAlign,
        prefixCls,
        popupElement,
        dropdownClassName,
        dropdownStyle,
        direction = 'ltr',
        placement,
        dropdownMatchSelectWidth,
        containerWidth,
        dropdownRender,
        animation,
        transitionName,
        getPopupContainer,
        getTriggerDOMNode,
        onPopupVisibleChange,
        onPopupMouseEnter,
        onPopupFocusin,
        onPopupFocusout,
      } = restProps as SelectTriggerProps;
      const dropdownPrefixCls = `${prefixCls}-dropdown`;

      let popupNode = popupElement;
      if (dropdownRender) {
        popupNode = dropdownRender({ menuNode: popupElement, props });
      }

      const mergedTransitionName = animation ? `${dropdownPrefixCls}-${animation}` : transitionName;

      const popupStyle = { minWidth: `${containerWidth}px`, ...dropdownStyle };

      if (typeof dropdownMatchSelectWidth === 'number') {
        popupStyle.width = `${dropdownMatchSelectWidth}px`;
      } else if (dropdownMatchSelectWidth) {
        popupStyle.width = `${containerWidth}px`;
      }
      return (
        <Trigger
          {...props}
          showAction={onPopupVisibleChange ? ['click'] : []}
          hideAction={onPopupVisibleChange ? ['click'] : []}
          popupPlacement={placement || (direction === 'rtl' ? 'bottomRight' : 'bottomLeft')}
          builtinPlacements={builtInPlacements.value}
          prefixCls={dropdownPrefixCls}
          popupTransitionName={mergedTransitionName}
          popupAlign={dropdownAlign}
          popupVisible={visible}
          getPopupContainer={getPopupContainer}
          popupClassName={classNames(dropdownClassName, {
            [`${dropdownPrefixCls}-empty`]: empty,
          })}
          popupStyle={popupStyle}
          getTriggerDOMNode={getTriggerDOMNode}
          onPopupVisibleChange={onPopupVisibleChange}
          v-slots={{
            default: slots.default,
            popup: () => (
              <div
                ref={popupRef}
                onMouseenter={onPopupMouseEnter}
                onFocusin={onPopupFocusin}
                onFocusout={onPopupFocusout}
              >
                {popupNode}
              </div>
            ),
          }}
        ></Trigger>
      );
    };
  },
});

export default SelectTrigger;
