import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { ColumnType, StickyOffsets } from '../interface';

export type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & {
  scrollbar?: boolean;
})[];
type SummaryContextProps = {
  stickyOffsets?: StickyOffsets;
  scrollColumnIndex?: number;
  flattenColumns?: FlattenColumns<any>;
};

export const SummaryContextKey: InjectionKey<SummaryContextProps> = Symbol('SummaryContextProps');

export const useProvideSummary = (props: SummaryContextProps) => {
  provide(SummaryContextKey, props);
};

export const useInjectSummary = () => {
  return inject(SummaryContextKey, {} as SummaryContextProps);
};
