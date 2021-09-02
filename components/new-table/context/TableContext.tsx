import { inject, InjectionKey, provide } from 'vue';
import { GetComponent } from '../interface';
import { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps {
  // Table context
  prefixCls: string;

  getComponent: GetComponent;

  scrollbarSize: number;

  direction: 'ltr' | 'rtl';

  fixedInfoList: readonly FixedInfo[];

  isSticky: boolean;
}

export const BodyContextKey: InjectionKey<TableContextProps> = Symbol('TableContextProps');

export const useProvideTable = (props: TableContextProps) => {
  provide(BodyContextKey, props);
};

export const useInjectTable = () => {
  return inject(BodyContextKey, {} as TableContextProps);
};
