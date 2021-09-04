import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { GetComponent } from '../interface';
import type { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps {
  // Table context
  prefixCls: string;

  getComponent: GetComponent;

  scrollbarSize: number;

  direction: 'ltr' | 'rtl';

  fixedInfoList: readonly FixedInfo[];

  isSticky: boolean;

  summaryCollect: (uniKey: string, fixed: boolean | string) => void;
}

export const BodyContextKey: InjectionKey<TableContextProps> = Symbol('TableContextProps');

export const useProvideTable = (props: TableContextProps) => {
  provide(BodyContextKey, props);
};

export const useInjectTable = () => {
  return inject(BodyContextKey, {} as TableContextProps);
};
