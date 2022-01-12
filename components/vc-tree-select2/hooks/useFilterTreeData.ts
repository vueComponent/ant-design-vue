import type { Ref } from 'vue';
import { computed } from 'vue';
import type { DefaultOptionType, InternalFieldName, TreeSelectProps } from '../TreeSelect';
import { fillLegacyProps } from '../utils/legacyUtil';

type GetFuncType<T> = T extends boolean ? never : T;
type FilterFn = GetFuncType<TreeSelectProps['filterTreeNode']>;

export default (
  treeData: Ref<DefaultOptionType[]>,
  searchValue: Ref<string>,
  {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames,
  }: {
    fieldNames: Ref<InternalFieldName>;
    treeNodeFilterProp: Ref<string>;
    filterTreeNode: Ref<TreeSelectProps['filterTreeNode']>;
  },
) => {
  return computed(() => {
    const { children: fieldChildren } = fieldNames.value;
    if (!searchValue.value || filterTreeNode.value === false) {
      return treeData.value;
    }

    let filterOptionFunc: FilterFn;
    if (typeof filterTreeNode.value === 'function') {
      filterOptionFunc = filterTreeNode.value;
    } else {
      const upperStr = searchValue.value.toUpperCase();
      filterOptionFunc = (_, dataNode) => {
        const value = dataNode[treeNodeFilterProp.value];

        return String(value).toUpperCase().includes(upperStr);
      };
    }

    function dig(list: DefaultOptionType[], keepAll = false) {
      return list
        .map(dataNode => {
          const children = dataNode[fieldChildren];

          const match = keepAll || filterOptionFunc(searchValue.value, fillLegacyProps(dataNode));
          const childList = dig(children || [], match);

          if (match || childList.length) {
            return {
              ...dataNode,
              [fieldChildren]: childList,
            };
          }
          return null;
        })
        .filter(node => node);
    }

    return dig(treeData.value);
  });
};
