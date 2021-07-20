import { CSSProperties } from '@vue/runtime-dom';
import { AlignType } from '../vc-align/interface';
import Trigger from '../vc-trigger';
import classNames from '../_util/classNames';
import { VueNode } from '../_util/type';
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
  popupElement: VueNode;
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
    popupElement,
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
      popup={popupElement}
      popupAlign={dropdownAlign}
      popupVisible={visible}
      popupClassName={classNames(dropdownClassName, {
        [`${dropdownPrefixCls}-range`]: range,
        [`${dropdownPrefixCls}-rtl`]: direction === 'rtl',
      })}
      popupStyle={popupStyle}
      getPopupContainer={getPopupContainer}
    >
      {slots.default?.()}
    </Trigger>
  );
}

export default PickerTrigger;
