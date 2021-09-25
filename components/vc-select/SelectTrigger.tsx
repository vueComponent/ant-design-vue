import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import createRef from '../_util/createRef';
import type { CSSProperties, VNodeChild } from 'vue';
import { defineComponent } from 'vue';
import type { RenderDOMFunc } from './interface';
import type { DropdownRender } from './interface/generator';

const getBuiltInPlacements = (dropdownMatchSelectWidth: number | boolean) => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = typeof dropdownMatchSelectWidth !== 'number' ? 0 : 1;

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
export interface SelectTriggerProps {
  prefixCls: string;
  disabled: boolean;
  visible: boolean;
  popupElement: VNodeChild | JSX.Element;
  animation?: string;
  transitionName?: string;
  containerWidth: number;
  dropdownStyle: CSSProperties;
  dropdownClassName: string;
  direction: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: DropdownRender;
  getPopupContainer?: RenderDOMFunc;
  dropdownAlign: object;
  empty: boolean;
  getTriggerDOMNode: () => any;
}

const SelectTrigger = defineComponent<SelectTriggerProps, { popupRef: any }>({
  name: 'SelectTrigger',
  inheritAttrs: false,
  created() {
    this.popupRef = createRef();
  },

  methods: {
    getPopupElement() {
      return this.popupRef.current;
    },
  },

  render() {
    const { empty = false, ...props } = { ...this.$props, ...this.$attrs };
    const {
      visible,
      dropdownAlign,
      prefixCls,
      popupElement,
      dropdownClassName,
      dropdownStyle,
      dropdownMatchSelectWidth,
      containerWidth,
      dropdownRender,
      animation,
      transitionName,
      direction,
      getPopupContainer,
      getTriggerDOMNode,
    } = props as SelectTriggerProps;
    const dropdownPrefixCls = `${prefixCls}-dropdown`;

    let popupNode = popupElement;
    if (dropdownRender) {
      popupNode = dropdownRender({ menuNode: popupElement, props });
    }

    const builtInPlacements = getBuiltInPlacements(dropdownMatchSelectWidth);

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
        showAction={[]}
        hideAction={[]}
        popupPlacement={direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
        builtinPlacements={builtInPlacements}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={mergedTransitionName}
        popup={<div ref={this.popupRef}>{popupNode}</div>}
        popupAlign={dropdownAlign}
        popupVisible={visible}
        getPopupContainer={getPopupContainer}
        popupClassName={classNames(dropdownClassName, {
          [`${dropdownPrefixCls}-empty`]: empty,
        })}
        popupStyle={popupStyle}
        getTriggerDOMNode={getTriggerDOMNode}
      >
        {getSlot(this)[0]}
      </Trigger>
    );
  },
});

SelectTrigger.props = {
  dropdownAlign: PropTypes.object,
  visible: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  dropdownClassName: PropTypes.string,
  dropdownStyle: PropTypes.object,
  empty: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  animation: PropTypes.string,
  transitionName: PropTypes.string,
  getPopupContainer: PropTypes.func,
  dropdownRender: PropTypes.func,
  containerWidth: PropTypes.number,
  dropdownMatchSelectWidth: PropTypes.oneOfType([Number, Boolean]).def(true),
  popupElement: PropTypes.any,
  direction: PropTypes.string,
  getTriggerDOMNode: PropTypes.func,
};

export default SelectTrigger;
