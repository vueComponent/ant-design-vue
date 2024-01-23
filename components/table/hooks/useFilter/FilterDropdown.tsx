import FilterFilled from '@ant-design/icons-vue/FilterFilled';
import Button from '../../../button';
import Menu from '../../../menu';
import Checkbox from '../../../checkbox';
import Radio from '../../../radio';
import Dropdown from '../../../dropdown';
import Empty from '../../../empty';
import type {
  ColumnType,
  ColumnFilterItem,
  Key,
  TableLocale,
  GetPopupContainer,
  FilterSearchType,
} from '../../interface';
import FilterDropdownMenuWrapper from './FilterWrapper';
import type { FilterState } from '.';
import { flattenKeys } from '.';
import { computed, defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue';
import classNames from '../../../_util/classNames';
import useConfigInject from '../../../config-provider/hooks/useConfigInject';
import { useInjectSlots } from '../../context';
import type { DataNode, EventDataNode } from '../../../tree';
import type { EventHandler } from '../../../_util/EventInterface';
import FilterSearch from './FilterSearch';
import Tree from '../../../tree';
import type { CheckboxChangeEvent } from '../../../checkbox/interface';
import devWarning from '../../../vc-util/devWarning';
import isEqual from '../../../vc-util/isEqual';

interface FilterResetProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

const { SubMenu, Item: MenuItem } = Menu;

function hasSubMenu(filters: ColumnFilterItem[]) {
  return filters.some(({ children }) => children && children.length > 0);
}

function searchValueMatched(searchValue: string, text: any) {
  if (typeof text === 'string' || typeof text === 'number') {
    return text?.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
  }
  return false;
}

function renderFilterItems({
  filters,
  prefixCls,
  filteredKeys,
  filterMultiple,
  searchValue,
  filterSearch,
}: {
  filters: ColumnFilterItem[];
  prefixCls: string;
  filteredKeys: Key[];
  filterMultiple: boolean;
  searchValue: string;
  filterSearch: FilterSearchType;
}) {
  return filters.map((filter, index) => {
    const key = String(filter.value);

    if (filter.children) {
      return (
        <SubMenu
          key={key || index}
          title={filter.text}
          popupClassName={`${prefixCls}-dropdown-submenu`}
        >
          {renderFilterItems({
            filters: filter.children,
            prefixCls,
            filteredKeys,
            filterMultiple,
            searchValue,
            filterSearch,
          })}
        </SubMenu>
      );
    }

    const Component = filterMultiple ? Checkbox : Radio;

    const item = (
      <MenuItem key={filter.value !== undefined ? key : index}>
        <Component checked={filteredKeys.includes(key)} />
        <span>{filter.text}</span>
      </MenuItem>
    );
    if (searchValue.trim()) {
      if (typeof filterSearch === 'function') {
        return filterSearch(searchValue, filter) ? item : undefined;
      }
      return searchValueMatched(searchValue, filter.text) ? item : undefined;
    }
    return item;
  });
}
export type TreeColumnFilterItem = ColumnFilterItem;
export interface FilterDropdownProps<RecordType> {
  tablePrefixCls: string;
  prefixCls: string;
  dropdownPrefixCls: string;
  column: ColumnType<RecordType>;
  filterState?: FilterState<RecordType>;
  filterMultiple: boolean;
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem | TreeColumnFilterItem>;
  columnKey: Key;
  triggerFilter: (filterState: FilterState<RecordType>) => void;
  locale: TableLocale;
  getPopupContainer?: GetPopupContainer;
  filterResetToDefaultFilteredValue?: boolean;
}

export default defineComponent<FilterDropdownProps<any>>({
  name: 'FilterDropdown',
  props: [
    'tablePrefixCls',
    'prefixCls',
    'dropdownPrefixCls',
    'column',
    'filterState',
    'filterMultiple',
    'filterMode',
    'filterSearch',
    'columnKey',
    'triggerFilter',
    'locale',
    'getPopupContainer',
  ] as any,
  setup(props, { slots }) {
    const contextSlots = useInjectSlots();
    const filterMode = computed(() => props.filterMode ?? 'menu');
    const filterSearch = computed(() => props.filterSearch ?? false);
    const filterDropdownOpen = computed(
      () => props.column.filterDropdownOpen || props.column.filterDropdownVisible,
    );
    const onFilterDropdownOpenChange = computed(
      () => props.column.onFilterDropdownOpenChange || props.column.onFilterDropdownVisibleChange,
    );

    if (process.env.NODE_ENV !== 'production') {
      [
        ['filterDropdownVisible', 'filterDropdownOpen', props.column.filterDropdownVisible],
        [
          'onFilterDropdownVisibleChange',
          'onFilterDropdownOpenChange',
          props.column.onFilterDropdownVisibleChange,
        ],
      ].forEach(([deprecatedName, newName, prop]) => {
        devWarning(
          prop === undefined || prop === null,
          'Table',
          `\`${deprecatedName}\` is deprecated. Please use \`${newName}\` instead.`,
        );
      });
    }
    const visible = shallowRef(false);
    const filtered = computed(
      () =>
        !!(
          props.filterState &&
          (props.filterState.filteredKeys?.length || props.filterState.forceFiltered)
        ),
    );
    const filterFlattenKeys = computed(() => flattenKeys(props.column?.filters));
    const filterDropdownRef = computed(() => {
      const { filterDropdown, slots = {}, customFilterDropdown } = props.column;
      return (
        filterDropdown ||
        (slots.filterDropdown && contextSlots.value[slots.filterDropdown]) ||
        (customFilterDropdown && contextSlots.value.customFilterDropdown)
      );
    });

    const filterIconRef = computed(() => {
      const { filterIcon, slots = {} } = props.column;
      return (
        filterIcon ||
        (slots.filterIcon && contextSlots.value[slots.filterIcon]) ||
        contextSlots.value.customFilterIcon
      );
    });

    const triggerVisible = (newVisible: boolean) => {
      visible.value = newVisible;
      onFilterDropdownOpenChange.value?.(newVisible);
    };

    const mergedVisible = computed(() =>
      typeof filterDropdownOpen.value === 'boolean' ? filterDropdownOpen.value : visible.value,
    );

    const propFilteredKeys = computed(() => props.filterState?.filteredKeys);

    const filteredKeys = shallowRef([]);

    const onSelectKeys = ({ selectedKeys }: { selectedKeys?: Key[] }) => {
      filteredKeys.value = selectedKeys;
    };

    const onCheck = (keys: Key[], { node, checked }: { node: EventDataNode; checked: boolean }) => {
      if (!props.filterMultiple) {
        onSelectKeys({ selectedKeys: checked && node.key ? [node.key] : [] });
      } else {
        onSelectKeys({ selectedKeys: keys as Key[] });
      }
    };

    watch(
      propFilteredKeys,
      () => {
        if (!visible.value) {
          return;
        }
        onSelectKeys({ selectedKeys: propFilteredKeys.value || [] });
      },
      { immediate: true },
    );

    // const expandKeys = shallowRef(filterFlattenKeys.value.slice());
    // const onExpandChange = keys => (expandKeys.value = keys);
    const openKeys = shallowRef([]);

    const openRef = shallowRef();

    const onOpenChange = (keys: string[]) => {
      openRef.value = setTimeout(() => {
        openKeys.value = keys;
      });
    };
    const onMenuClick = () => {
      clearTimeout(openRef.value);
    };

    onBeforeUnmount(() => {
      clearTimeout(openRef.value);
    });

    const searchValue = shallowRef('');
    const onSearch: EventHandler = e => {
      const { value } = e.target;
      searchValue.value = value;
    };
    // clear search value after close filter dropdown
    watch(visible, () => {
      if (!visible.value) {
        searchValue.value = '';
      }
    });

    // ======================= Submit ========================
    const internalTriggerFilter = (keys?: Key[]) => {
      const { column, columnKey, filterState } = props;
      const mergedKeys = keys && keys.length ? keys : null;
      if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
        return null;
      }

      if (isEqual(mergedKeys, filterState?.filteredKeys, true)) {
        return null;
      }

      props.triggerFilter({
        column,
        key: columnKey,
        filteredKeys: mergedKeys,
      });
    };

    const onConfirm = () => {
      triggerVisible(false);
      internalTriggerFilter(filteredKeys.value);
    };

    const onReset = (
      { confirm, closeDropdown }: FilterResetProps = { confirm: false, closeDropdown: false },
    ) => {
      if (confirm) {
        internalTriggerFilter([]);
      }
      if (closeDropdown) {
        triggerVisible(false);
      }
      searchValue.value = '';
      if (props.column.filterResetToDefaultFilteredValue) {
        filteredKeys.value = (props.column.defaultFilteredValue || []).map(key => String(key));
      } else {
        filteredKeys.value = [];
      }
    };

    const doFilter = ({ closeDropdown } = { closeDropdown: true }) => {
      if (closeDropdown) {
        triggerVisible(false);
      }
      internalTriggerFilter(filteredKeys.value);
    };

    const onVisibleChange = (newVisible: boolean) => {
      if (newVisible && propFilteredKeys.value !== undefined) {
        // Sync filteredKeys on appear in controlled mode (propFilteredKeys.value !== undefiend)
        filteredKeys.value = propFilteredKeys.value || [];
      }
      triggerVisible(newVisible);

      // Default will filter when closed
      if (!newVisible && !filterDropdownRef.value) {
        onConfirm();
      }
    };

    const { direction } = useConfigInject('', props);

    const onCheckAll = (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        const allFilterKeys = filterFlattenKeys.value;
        filteredKeys.value = allFilterKeys;
      } else {
        filteredKeys.value = [];
      }
    };

    const getTreeData = ({ filters }: { filters?: ColumnFilterItem[] }) =>
      (filters || []).map((filter, index) => {
        const key = String(filter.value);
        const item: DataNode = {
          title: filter.text,
          key: filter.value !== undefined ? key : index,
        };
        if (filter.children) {
          item.children = getTreeData({ filters: filter.children });
        }
        return item;
      });

    const getFilterData = (node: any): TreeColumnFilterItem => ({
      ...node,
      text: node.title,
      value: node.key,
      children: node.children?.map(item => getFilterData(item)) || [],
    });

    const treeData = computed(() => getTreeData({ filters: props.column.filters }));
    // ======================== Style ========================
    const dropdownMenuClass = computed(() =>
      classNames({
        [`${props.dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(
          props.column.filters || [],
        ),
      }),
    );
    const getFilterComponent = () => {
      const selectedKeys = filteredKeys.value;
      const {
        column,
        locale,
        tablePrefixCls,
        filterMultiple,
        dropdownPrefixCls,
        getPopupContainer,
        prefixCls,
      } = props;
      if ((column.filters || []).length === 0) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={locale.filterEmptyText}
            imageStyle={{
              height: 24,
            }}
            style={{
              margin: 0,
              padding: '16px 0',
            }}
          />
        );
      }
      if (filterMode.value === 'tree') {
        return (
          <>
            <FilterSearch
              filterSearch={filterSearch.value}
              value={searchValue.value}
              onChange={onSearch}
              tablePrefixCls={tablePrefixCls}
              locale={locale}
            />
            <div class={`${tablePrefixCls}-filter-dropdown-tree`}>
              {filterMultiple ? (
                <Checkbox
                  class={`${tablePrefixCls}-filter-dropdown-checkall`}
                  onChange={onCheckAll}
                  checked={selectedKeys.length === filterFlattenKeys.value.length}
                  indeterminate={
                    selectedKeys.length > 0 && selectedKeys.length < filterFlattenKeys.value.length
                  }
                >
                  {locale.filterCheckall}
                </Checkbox>
              ) : null}
              <Tree
                checkable
                selectable={false}
                blockNode
                multiple={filterMultiple}
                checkStrictly={!filterMultiple}
                class={`${dropdownPrefixCls}-menu`}
                onCheck={onCheck}
                checkedKeys={selectedKeys}
                selectedKeys={selectedKeys}
                showIcon={false}
                treeData={treeData.value}
                autoExpandParent
                defaultExpandAll
                // expandedKeys={expandKeys.value as Key[]}
                // onExpand={onExpandChange}
                filterTreeNode={
                  searchValue.value.trim()
                    ? node => {
                        if (typeof filterSearch.value === 'function') {
                          return filterSearch.value(searchValue.value, getFilterData(node));
                        }
                        return searchValueMatched(searchValue.value, node.title);
                      }
                    : undefined
                }
              />
            </div>
          </>
        );
      }
      return (
        <>
          <FilterSearch
            filterSearch={filterSearch.value}
            value={searchValue.value}
            onChange={onSearch}
            tablePrefixCls={tablePrefixCls}
            locale={locale}
          />
          <Menu
            multiple={filterMultiple}
            prefixCls={`${dropdownPrefixCls}-menu`}
            class={dropdownMenuClass.value}
            onClick={onMenuClick}
            onSelect={onSelectKeys}
            onDeselect={onSelectKeys}
            selectedKeys={selectedKeys}
            getPopupContainer={getPopupContainer}
            openKeys={openKeys.value}
            onOpenChange={onOpenChange}
            v-slots={{
              default: () =>
                renderFilterItems({
                  filters: column.filters || [],
                  filterSearch: filterSearch.value,
                  prefixCls,
                  filteredKeys: filteredKeys.value,
                  filterMultiple,
                  searchValue: searchValue.value,
                }),
            }}
          ></Menu>
        </>
      );
    };
    const resetDisabled = computed(() => {
      const selectedKeys = filteredKeys.value;
      if (props.column.filterResetToDefaultFilteredValue) {
        return isEqual(
          (props.column.defaultFilteredValue || []).map(key => String(key)),
          selectedKeys,
          true,
        );
      }

      return selectedKeys.length === 0;
    });
    return () => {
      const { tablePrefixCls, prefixCls, column, dropdownPrefixCls, locale, getPopupContainer } =
        props;

      let dropdownContent;

      if (typeof filterDropdownRef.value === 'function') {
        dropdownContent = filterDropdownRef.value({
          prefixCls: `${dropdownPrefixCls}-custom`,
          setSelectedKeys: (selectedKeys: Key[]) => onSelectKeys({ selectedKeys }),
          selectedKeys: filteredKeys.value,
          confirm: doFilter,
          clearFilters: onReset,
          filters: column.filters,
          visible: mergedVisible.value,
          column: column.__originColumn__,
          close: () => {
            triggerVisible(false);
          },
        });
      } else if (filterDropdownRef.value) {
        dropdownContent = filterDropdownRef.value;
      } else {
        dropdownContent = (
          <>
            {getFilterComponent()}
            <div class={`${prefixCls}-dropdown-btns`}>
              <Button
                type="link"
                size="small"
                disabled={resetDisabled.value}
                onClick={() => onReset()}
              >
                {locale.filterReset}
              </Button>
              <Button type="primary" size="small" onClick={onConfirm}>
                {locale.filterConfirm}
              </Button>
            </div>
          </>
        );
      }

      const menu = (
        <FilterDropdownMenuWrapper class={`${prefixCls}-dropdown`}>
          {dropdownContent}
        </FilterDropdownMenuWrapper>
      );

      let filterIcon;
      if (typeof filterIconRef.value === 'function') {
        filterIcon = filterIconRef.value({
          filtered: filtered.value,
          column: column.__originColumn__,
        });
      } else if (filterIconRef.value) {
        filterIcon = filterIconRef.value;
      } else {
        filterIcon = <FilterFilled />;
      }

      return (
        <div class={`${prefixCls}-column`}>
          <span class={`${tablePrefixCls}-column-title`}>{slots.default?.()}</span>
          <Dropdown
            overlay={menu}
            trigger={['click']}
            open={mergedVisible.value}
            onOpenChange={onVisibleChange}
            getPopupContainer={getPopupContainer}
            placement={direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight'}
          >
            <span
              role="button"
              tabindex={-1}
              class={classNames(`${prefixCls}-trigger`, {
                active: filtered.value,
              })}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {filterIcon}
            </span>
          </Dropdown>
        </div>
      );
    };
  },
});
