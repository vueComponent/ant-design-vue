import type { CSSProperties } from 'vue';
import type { AlignType } from '../vc-align/interface';
import Trigger from '../vc-trigger';
import classNames from '../_util/classNames';
import useMergeProps from './hooks/useMergeProps';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type PickerTriggerProps = {
  prefixCls: string;
  visible: boolean;
  popupStyle?: CSSProperties;
  dropdownClassName?: string;
  transitionName?: string;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  dropdownAlign?: AlignType;
  range?: boolean;
  popupPlacement?: Placement;
  direction?: 'ltr' | 'rtl';
};

function PickerTrigger(props: PickerTriggerProps, { slots }) {
  const {
    prefixCls,
    popupStyle,
    visible,
    dropdownClassName,
    dropdownAlign,
    transitionName,
    getPopupContainer,
    range,
    popupPlacement,
    direction,
  } = useMergeProps(props);
  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  const getPopupPlacement = () => {
    if (popupPlacement !== undefined) {
      return popupPlacement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  };

  return (
    <Trigger
      showAction={[]}
      hideAction={[]}
      popupPlacement={getPopupPlacement()}
      builtinPlacements={BUILT_IN_PLACEMENTS}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={transitionName}
      popupAlign={dropdownAlign}
      popupVisible={visible}
      popupClassName={classNames(dropdownClassName, {
        [`${dropdownPrefixCls}-range`]: range,
        [`${dropdownPrefixCls}-rtl`]: direction === 'rtl',
      })}
      popupStyle={popupStyle}
      getPopupContainer={getPopupContainer}
      v-slots={{
        default: slots.default,
        popup: slots.popupElement,
      }}
    ></Trigger>
  );
}

export default PickerTrigger;
