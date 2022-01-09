import { toPathOptions } from '../utils/treeUtil';
import * as React from 'react';
import type {
  DefaultOptionType,
  SingleValueType,
  CascaderProps,
  InternalFieldNames,
} from '../Cascader';
import { toPathKey } from '../utils/commonUtil';

export default (
  rawValues: SingleValueType[],
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  multiple: boolean,
  displayRender: CascaderProps['displayRender'],
) => {
  return React.useMemo(() => {
    const mergedDisplayRender =
      displayRender ||
      // Default displayRender
      (labels => {
        const mergedLabels = multiple ? labels.slice(-1) : labels;
        const SPLIT = ' / ';

        if (mergedLabels.every(label => ['string', 'number'].includes(typeof label))) {
          return mergedLabels.join(SPLIT);
        }

        // If exist non-string value, use ReactNode instead
        return mergedLabels.reduce((list, label, index) => {
          const keyedLabel = React.isValidElement(label)
            ? React.cloneElement(label, { key: index })
            : label;

          if (index === 0) {
            return [keyedLabel];
          }

          return [...list, SPLIT, keyedLabel];
        }, []);
      });

    return rawValues.map(valueCells => {
      const valueOptions = toPathOptions(valueCells, options, fieldNames);

      const label = mergedDisplayRender(
        valueOptions.map(({ option, value }) => option?.[fieldNames.label] ?? value),
        valueOptions.map(({ option }) => option),
      );

      return {
        label,
        value: toPathKey(valueCells),
        valueCells,
      };
    });
  }, [rawValues, options, fieldNames, displayRender, multiple]);
};
