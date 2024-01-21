import type { DefaultRecordType } from '../../../vc-table/interface';
import devWarning from '../../../vc-util/devWarning';
import useState from '../../../_util/hooks/useState';
import type { Ref } from 'vue';
import { computed } from 'vue';
import type {
  TransformColumns,
  ColumnsType,
  ColumnType,
  ColumnTitleProps,
  Key,
  TableLocale,
  FilterValue,
  FilterKey,
  GetPopupContainer,
  ColumnFilterItem,
} from '../../interface';
import { getColumnPos, renderColumnTitle, getColumnKey } from '../../util';
import FilterDropdown from './FilterDropdown';

export interface FilterState<RecordType = DefaultRecordType> {
  column: ColumnType<RecordType>;
  key: Key;
  filteredKeys?: FilterKey;
  forceFiltered?: boolean;
}

function collectFilterStates<RecordType>(
  columns: ColumnsType<RecordType>,
  init: boolean,
  pos?: string,
): FilterState<RecordType>[] {
  let filterStates: FilterState<RecordType>[] = [];

  (columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const hasFilterDropdown =
      column.filterDropdown || column?.slots?.filterDropdown || column.customFilterDropdown;
    if (column.filters || hasFilterDropdown || 'onFilter' in column) {
      if ('filteredValue' in column) {
        // Controlled
        let filteredValues = column.filteredValue;
        if (!hasFilterDropdown) {
          filteredValues = filteredValues?.map(String) ?? filteredValues;
        }
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: column.filtered,
        });
      } else {
        // Uncontrolled
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: (init && column.defaultFilteredValue
            ? column.defaultFilteredValue!
            : undefined) as FilterKey,
          forceFiltered: column.filtered,
        });
      }
    }
    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)];
    }
  });

  return filterStates;
}

function injectFilter<RecordType>(
  prefixCls: string,
  dropdownPrefixCls: string,
  columns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  locale: TableLocale,
  triggerFilter: (filterState: FilterState<RecordType>) => void,
  getPopupContainer?: GetPopupContainer | undefined,
  pos?: string,
): ColumnsType<RecordType> {
  return columns.map((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const { filterMultiple = true, filterMode, filterSearch } = column as ColumnType<RecordType>;

    let newColumn: ColumnsType<RecordType>[number] = column;
    const hasFilterDropdown =
      column.filterDropdown || column?.slots?.filterDropdown || column.customFilterDropdown;
    if (newColumn.filters || hasFilterDropdown) {
      const columnKey = getColumnKey(newColumn, columnPos);
      const filterState = filterStates.find(({ key }) => columnKey === key);

      newColumn = {
        ...newColumn,
        title: (renderProps: ColumnTitleProps<RecordType>) => (
          <FilterDropdown
            tablePrefixCls={prefixCls}
            prefixCls={`${prefixCls}-filter`}
            dropdownPrefixCls={dropdownPrefixCls}
            column={newColumn}
            columnKey={columnKey}
            filterState={filterState}
            filterMultiple={filterMultiple}
            filterMode={filterMode}
            filterSearch={filterSearch}
            triggerFilter={triggerFilter}
            locale={locale}
            getPopupContainer={getPopupContainer}
          >
            {renderColumnTitle(column.title, renderProps)}
          </FilterDropdown>
        ),
      };
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectFilter(
          prefixCls,
          dropdownPrefixCls,
          newColumn.children,
          filterStates,
          locale,
          triggerFilter,
          getPopupContainer,
          columnPos,
        ),
      };
    }

    return newColumn;
  });
}

export function flattenKeys(filters?: ColumnFilterItem[]) {
  let keys: FilterValue = [];
  (filters || []).forEach(({ value, children }) => {
    keys.push(value);
    if (children) {
      keys = [...keys, ...flattenKeys(children)];
    }
  });
  return keys;
}

function generateFilterInfo<RecordType>(filterStates: FilterState<RecordType>[]) {
  const currentFilters: Record<string, FilterValue | null> = {};

  filterStates.forEach(({ key, filteredKeys, column }) => {
    const hasFilterDropdown =
      column.filterDropdown || column?.slots?.filterDropdown || column.customFilterDropdown;
    const { filters } = column;
    if (hasFilterDropdown) {
      currentFilters[key] = filteredKeys || null;
    } else if (Array.isArray(filteredKeys)) {
      const keys = flattenKeys(filters);
      currentFilters[key] = keys.filter(originKey => filteredKeys.includes(String(originKey)));
    } else {
      currentFilters[key] = null;
    }
  });

  return currentFilters;
}

export function getFilterData<RecordType>(
  data: RecordType[],
  filterStates: FilterState<RecordType>[],
) {
  return filterStates.reduce((currentData, filterState) => {
    const {
      column: { onFilter, filters },
      filteredKeys,
    } = filterState;
    if (onFilter && filteredKeys && filteredKeys.length) {
      return currentData.filter(record =>
        filteredKeys.some(key => {
          const keys = flattenKeys(filters);
          const keyIndex = keys.findIndex(k => String(k) === String(key));
          const realKey = keyIndex !== -1 ? keys[keyIndex] : key;
          return onFilter(realKey, record);
        }),
      );
    }
    return currentData;
  }, data);
}

function getMergedColumns<RecordType>(
  rawMergedColumns: ColumnsType<RecordType>,
): ColumnsType<RecordType> {
  return rawMergedColumns.flatMap(column => {
    if ('children' in column) {
      return [column, ...getMergedColumns(column.children || [])];
    }
    return [column];
  });
}

interface FilterConfig<RecordType> {
  prefixCls: Ref<string>;
  dropdownPrefixCls: Ref<string>;
  mergedColumns: Ref<ColumnsType<RecordType>>;
  locale: Ref<TableLocale>;
  onFilterChange: (
    filters: Record<string, FilterValue | null>,
    filterStates: FilterState<RecordType>[],
  ) => void;
  getPopupContainer?: Ref<GetPopupContainer>;
}

function useFilter<RecordType>({
  prefixCls,
  dropdownPrefixCls,
  mergedColumns: rawMergedColumns,
  locale,
  onFilterChange,
  getPopupContainer,
}: FilterConfig<RecordType>): [
  TransformColumns<RecordType>,
  Ref<FilterState<RecordType>[]>,
  Ref<Record<string, FilterValue | null>>,
] {
  const mergedColumns = computed(() => getMergedColumns(rawMergedColumns.value));

  const [filterStates, setFilterStates] = useState<FilterState<RecordType>[]>(
    collectFilterStates(mergedColumns.value, true),
  );

  const mergedFilterStates = computed(() => {
    const collectedStates = collectFilterStates(mergedColumns.value, false);
    if (collectedStates.length === 0) {
      return collectedStates;
    }
    let filteredKeysIsAllNotControlled = true;
    let filteredKeysIsAllControlled = true;
    collectedStates.forEach(({ filteredKeys }) => {
      if (filteredKeys !== undefined) {
        filteredKeysIsAllNotControlled = false;
      } else {
        filteredKeysIsAllControlled = false;
      }
    });

    // Return if not controlled
    if (filteredKeysIsAllNotControlled) {
      // Filter column may have been removed
      const keyList = (mergedColumns.value || []).map((column, index) =>
        getColumnKey(column, getColumnPos(index)),
      );
      return filterStates.value
        .filter(({ key }) => keyList.includes(key))
        .map(item => {
          const col = mergedColumns.value[keyList.findIndex(key => key === item.key)];
          return {
            ...item,
            column: {
              ...item.column,
              ...col,
            },
            forceFiltered: col.filtered,
          };
        });
    }

    devWarning(
      filteredKeysIsAllControlled,
      'Table',
      'Columns should all contain `filteredValue` or not contain `filteredValue`.',
    );

    return collectedStates;
  });

  const filters = computed(() => generateFilterInfo(mergedFilterStates.value));

  const triggerFilter = (filterState: FilterState<RecordType>) => {
    const newFilterStates = mergedFilterStates.value.filter(({ key }) => key !== filterState.key);
    newFilterStates.push(filterState);
    setFilterStates(newFilterStates);
    onFilterChange(generateFilterInfo(newFilterStates), newFilterStates);
  };

  const transformColumns = (innerColumns: ColumnsType<RecordType>) => {
    return injectFilter(
      prefixCls.value,
      dropdownPrefixCls.value,
      innerColumns,
      mergedFilterStates.value,
      locale.value,
      triggerFilter,
      getPopupContainer.value,
    );
  };
  return [transformColumns, mergedFilterStates, filters];
}

export default useFilter;
