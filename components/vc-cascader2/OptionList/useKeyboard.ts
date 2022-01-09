import * as React from 'react';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import KeyCode from 'rc-util/lib/KeyCode';
import type { DefaultOptionType, InternalFieldNames, SingleValueType } from '../Cascader';
import { toPathKey } from '../utils/commonUtil';
import { useBaseProps } from 'rc-select';

export default (
  ref: React.Ref<RefOptionListProps>,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  activeValueCells: React.Key[],
  setActiveValueCells: (activeValueCells: React.Key[]) => void,
  containerRef: React.RefObject<HTMLElement>,
  onKeyBoardSelect: (valueCells: SingleValueType, option: DefaultOptionType) => void,
) => {
  const { direction, searchValue, toggleOpen, open } = useBaseProps();
  const rtl = direction === 'rtl';

  const [validActiveValueCells, lastActiveIndex, lastActiveOptions] = React.useMemo(() => {
    let activeIndex = -1;
    let currentOptions = options;

    const mergedActiveIndexes: number[] = [];
    const mergedActiveValueCells: React.Key[] = [];

    const len = activeValueCells.length;

    // Fill validate active value cells and index
    for (let i = 0; i < len; i += 1) {
      // Mark the active index for current options
      const nextActiveIndex = currentOptions.findIndex(
        option => option[fieldNames.value] === activeValueCells[i],
      );

      if (nextActiveIndex === -1) {
        break;
      }

      activeIndex = nextActiveIndex;
      mergedActiveIndexes.push(activeIndex);
      mergedActiveValueCells.push(activeValueCells[i]);

      currentOptions = currentOptions[activeIndex][fieldNames.children];
    }

    // Fill last active options
    let activeOptions = options;
    for (let i = 0; i < mergedActiveIndexes.length - 1; i += 1) {
      activeOptions = activeOptions[mergedActiveIndexes[i]][fieldNames.children];
    }

    return [mergedActiveValueCells, activeIndex, activeOptions];
  }, [activeValueCells, fieldNames, options]);

  // Update active value cells and scroll to target element
  const internalSetActiveValueCells = (next: React.Key[]) => {
    setActiveValueCells(next);

    const ele = containerRef.current?.querySelector(`li[data-path-key="${toPathKey(next)}"]`);
    ele?.scrollIntoView?.({ block: 'nearest' });
  };

  // Same options offset
  const offsetActiveOption = (offset: number) => {
    const len = lastActiveOptions.length;

    let currentIndex = lastActiveIndex;
    if (currentIndex === -1 && offset < 0) {
      currentIndex = len;
    }

    for (let i = 0; i < len; i += 1) {
      currentIndex = (currentIndex + offset + len) % len;
      const option = lastActiveOptions[currentIndex];

      if (option && !option.disabled) {
        const value = option[fieldNames.value];
        const nextActiveCells = validActiveValueCells.slice(0, -1).concat(value);
        internalSetActiveValueCells(nextActiveCells);
        return;
      }
    }
  };

  // Different options offset
  const prevColumn = () => {
    if (validActiveValueCells.length > 1) {
      const nextActiveCells = validActiveValueCells.slice(0, -1);
      internalSetActiveValueCells(nextActiveCells);
    } else {
      toggleOpen(false);
    }
  };

  const nextColumn = () => {
    const nextOptions: DefaultOptionType[] =
      lastActiveOptions[lastActiveIndex]?.[fieldNames.children] || [];

    const nextOption = nextOptions.find(option => !option.disabled);

    if (nextOption) {
      const nextActiveCells = [...validActiveValueCells, nextOption[fieldNames.value]];
      internalSetActiveValueCells(nextActiveCells);
    }
  };

  React.useImperativeHandle(ref, () => ({
    // scrollTo: treeRef.current?.scrollTo,
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          }

          if (offset !== 0) {
            offsetActiveOption(offset);
          }

          break;
        }

        case KeyCode.LEFT: {
          if (rtl) {
            nextColumn();
          } else {
            prevColumn();
          }
          break;
        }

        case KeyCode.RIGHT: {
          if (rtl) {
            prevColumn();
          } else {
            nextColumn();
          }
          break;
        }

        case KeyCode.BACKSPACE: {
          if (!searchValue) {
            prevColumn();
          }
          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          if (validActiveValueCells.length) {
            onKeyBoardSelect(validActiveValueCells, lastActiveOptions[lastActiveIndex]);
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);

          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},
  }));
};
