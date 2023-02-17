import useState from '../../_util/hooks/useState';
import type { Ref } from 'vue';
import { computed } from 'vue';
import type { PaginationProps } from '../../pagination';
import type { TablePaginationConfig } from '../interface';
import extendsObject from '../../_util/extendsObject';

export const DEFAULT_PAGE_SIZE = 10;

export function getPaginationParam(
  mergedPagination: TablePaginationConfig,
  pagination: TablePaginationConfig | boolean | undefined,
) {
  const param: any = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  };
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};

  Object.keys(paginationObj).forEach(pageProp => {
    const value = (mergedPagination as any)[pageProp];

    if (typeof value !== 'function') {
      param[pageProp] = value;
    }
  });

  return param;
}

export default function usePagination(
  totalRef: Ref<number>,
  paginationRef: Ref<TablePaginationConfig | false | undefined>,
  onChange: (current: number, pageSize: number) => void,
): [Ref<TablePaginationConfig>, () => void] {
  const pagination = computed(() =>
    paginationRef.value && typeof paginationRef.value === 'object' ? paginationRef.value : {},
  );
  const paginationTotal = computed(() => pagination.value.total || 0);
  const [innerPagination, setInnerPagination] = useState<{
    current?: number;
    pageSize?: number;
  }>(() => ({
    current: 'defaultCurrent' in pagination.value ? pagination.value.defaultCurrent : 1,
    pageSize:
      'defaultPageSize' in pagination.value ? pagination.value.defaultPageSize : DEFAULT_PAGE_SIZE,
  }));

  // ============ Basic Pagination Config ============
  const mergedPagination = computed(() => {
    const mP = extendsObject<Partial<TablePaginationConfig>>(
      innerPagination.value,
      pagination.value,
      {
        total: paginationTotal.value > 0 ? paginationTotal.value : totalRef.value,
      },
    );
    // Reset `current` if data length or pageSize changed
    const maxPage = Math.ceil((paginationTotal.value || totalRef.value) / mP.pageSize!);
    if (mP.current! > maxPage) {
      // Prevent a maximum page count of 0
      mP.current = maxPage || 1;
    }
    return mP;
  });

  const refreshPagination = (current?: number, pageSize?: number) => {
    if (paginationRef.value === false) return;
    setInnerPagination({
      current: current ?? 1,
      pageSize: pageSize || mergedPagination.value.pageSize,
    });
  };

  const onInternalChange: PaginationProps['onChange'] = (current, pageSize) => {
    if (paginationRef.value) {
      pagination.value.onChange?.(current, pageSize);
    }
    refreshPagination(current, pageSize);
    onChange(current, pageSize || mergedPagination.value.pageSize);
  };

  return [
    computed(() => {
      return paginationRef.value === false
        ? {}
        : { ...mergedPagination.value, onChange: onInternalChange };
    }),
    refreshPagination,
  ];
}
