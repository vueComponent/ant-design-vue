import Trigger from '../vc-trigger';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import createRef from '../_util/createRef';

const getBuiltInPlacements = dropdownMatchSelectWidth => {
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

export default {
  name: 'SelectTrigger',
  inheritAttrs: false,
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    empty: PropTypes.bool,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    // children: PropTypes.any,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    dropdownRender: PropTypes.func,
    containerWidth: PropTypes.number,
    dropdownMatchSelectWidth: PropTypes.oneOfType([Number, Boolean]).def(true),
    popupElement: PropTypes.any,
    direction: PropTypes.string,
    getTriggerDOMNode: PropTypes.func,
  },

  created() {
    this.popupRef = createRef();
  },

  methods: {
    getDropdownTransitionName() {
      const props = this.$props;
      let transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
      }
      return transitionName;
    },
    getPopupElement() {
      return this.popupRef.current;
    },
  },

  render() {
    const { empty, ...props } = { ...this.$props, ...this.$attrs };
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
    } = props;
    const dropdownPrefixCls = `${prefixCls}-dropdown`;

    let popupNode = popupElement;
    if (dropdownRender) {
      popupNode = dropdownRender({ menuNode: popupElement, props });
    }

    const builtInPlacements = getBuiltInPlacements(dropdownMatchSelectWidth);
    const popupStyle = { minWidth: containerWidth, ...dropdownStyle };

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
        popupPlacement={this.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
        popupPlacement="bottomLeft"
        builtinPlacements={builtInPlacements}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.onDropdownVisibleChange}
        popup={<div ref={this.popupRef}>{popupNode}</div>}
        popupAlign={dropdownAlign}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classNames(dropdownClassName, {
          [`${dropdownPrefixCls}-empty`]: empty,
        })}
        popupStyle={popupStyle}
        getTriggerDOMNode={this.getTriggerDOMNode}
      >
        {getSlot(this)[0]}
      </Trigger>
    );
  },
};
