import generateSelector, { GenerateConfig } from '../vc-select/generate';
import TreeNode from './TreeNode';
import type {
  Key,
  DefaultValueType,
  DataNode,
  LabelValueType,
  SimpleModeConfig,
  RawValueType,
  ChangeEventExtra,
  LegacyDataNode,
  SelectSource,
  FlattenDataNode,
  FieldNames,
} from './interface';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  addValue,
  removeValue,
  getRawValueLabeled,
  toArray,
  fillFieldNames,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import type { CheckedStrategy } from './utils/strategyUtil';
import { formatStrategyKeys, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './utils/strategyUtil';
import { fillAdditionalInfo } from './utils/legacyUtil';
import useSelectValues from './hooks/useSelectValues';
import { treeSelectProps, TreeSelectProps } from './props';
import { getLabeledValue } from '../vc-select/utils/valueUtil';
import omit from '../_util/omit';
import { defineComponent } from 'vue';

const OMIT_PROPS: (keyof TreeSelectProps)[] = [
  'expandedKeys' as any,
  'treeData',
  'treeCheckable',
  'showCheckedStrategy',
  'searchPlaceholder',
  'treeLine',
  'treeIcon',
  'showTreeIcon',
  'switcherIcon',
  'treeNodeFilterProp',
  'filterTreeNode',
  'dropdownPopupAlign',
  'treeDefaultExpandAll',
  'treeCheckStrictly',
  'treeExpandedKeys',
  'treeLoadedKeys',
  'treeMotion',
  'onTreeExpand',
  'onTreeLoad',
  'labelRender',
  'loadData',
  'treeDataSimpleMode',
  'treeNodeLabelProp',
  'treeDefaultExpandedKeys',
];

export default function generate(config: {
  prefixCls: string;
  optionList: GenerateConfig<DataNode>['components']['optionList'];
}) {
  const { prefixCls, optionList } = config;

  const RefSelect = generateSelector<DataNode>({
    prefixCls,
    components: {
      optionList,
    },
    // Not use generate since we will handle ourself
    convertChildrenToData: () => null,
    flattenOptions,
    // Handle `optionLabelProp` in TreeSelect component
    getLabeledValue: getLabeledValue as any,
    filterOptions,
    isValueDisabled,
    findValueOption,
    omitDOMProps: (props: TreeSelectProps<any>) => omit(props, OMIT_PROPS),
  });

  return defineComponent({
    props: treeSelectProps(),
    slots: [],
    name: 'TreeSelect',
    setup(props) {
      return () => {
        return null;
      };
    },
  });
}
