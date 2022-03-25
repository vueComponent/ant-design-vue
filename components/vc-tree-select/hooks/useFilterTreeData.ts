import type { Ref, ShallowRef } from 'vue';
import { computed } from 'vue';
import type { DefaultOptionType, InternalFieldName, TreeSelectProps } from '../TreeSelect';
import { fillLegacyProps } from '../utils/legacyUtil';

type GetFuncType<T> = T extends boolean ? never : T;
type FilterFn = GetFuncType<TreeSelectProps['filterTreeNode']>;

export default (
  treeData: ShallowRef<DefaultOptionType[]>,
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
    const searchValueVal = searchValue.value;
    const treeNodeFilterPropValue = treeNodeFilterProp?.value;
    if (!searchValueVal || filterTreeNode.value === false) {
      return treeData.value;
    }

    let filterOptionFunc: FilterFn;
    if (typeof filterTreeNode.value === 'function') {
      filterOptionFunc = filterTreeNode.value;
    } else {
      const upperStr = searchValueVal.toUpperCase();
      filterOptionFunc = (_, dataNode) => {
        const value = dataNode[treeNodeFilterPropValue];

        return String(value).toUpperCase().includes(upperStr);
      };
    }

    function dig(list: DefaultOptionType[], keepAll = false) {
      const res = [];
      for (let index = 0, len = list.length; index < len; index++) {
        const dataNode = list[index];
        const children = dataNode[fieldChildren];

        const match = keepAll || filterOptionFunc(searchValueVal, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList.length) {
          res.push({
            ...dataNode,
            [fieldChildren]: childList,
          });
        }
      }
      return res;
    }

    return dig(treeData.value);
  });
};
