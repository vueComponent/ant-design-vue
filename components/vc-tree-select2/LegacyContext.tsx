/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { DataEntity, IconType } from '../vc-tree/interface';
import type { Key, LegacyDataNode, RawValueType } from './interface';

interface LegacyContextProps {
  checkable: boolean;
  checkedKeys: Key[];
  customCheckable: () => any;
  halfCheckedKeys: Key[];
  treeExpandedKeys: Key[];
  treeDefaultExpandedKeys: Key[];
  onTreeExpand: (keys: Key[]) => void;
  treeDefaultExpandAll: boolean;
  treeIcon: IconType;
  showTreeIcon: boolean;
  switcherIcon: IconType;
  treeLine: boolean;
  treeNodeFilterProp: string;
  treeLoadedKeys: Key[];
  treeMotion: any;
  loadData: (treeNode: LegacyDataNode) => Promise<unknown>;
  onTreeLoad: (loadedKeys: Key[]) => void;

  keyEntities: Record<RawValueType, DataEntity<any>>;

  // slots: {
  //   title?: (data: InternalDataEntity) => any;
  //   titleRender?: (data: InternalDataEntity) => any;
  //   [key: string]: ((...args: any[]) => any) | undefined;
  // };
}

const TreeSelectLegacyContextPropsKey: InjectionKey<LegacyContextProps> = Symbol(
  'TreeSelectLegacyContextPropsKey',
);

// export const LegacySelectContext = defineComponent({
//   name: 'SelectContext',
//   props: {
//     value: { type: Object as PropType<LegacyContextProps> },
//   },
//   setup(props, { slots }) {
//     provide(
//       TreeSelectLegacyContextPropsKey,
//       computed(() => props.value),
//     );
//     return () => slots.default?.();
//   },
// });

export function useProvideLegacySelectContext(props: LegacyContextProps) {
  return provide(TreeSelectLegacyContextPropsKey, props);
}

export default function useInjectLegacySelectContext() {
  return inject(TreeSelectLegacyContextPropsKey, {} as LegacyContextProps);
}
