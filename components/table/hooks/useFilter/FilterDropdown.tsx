import isEqual from 'lodash-es/isEqual';
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
} from '../../interface';
import FilterDropdownMenuWrapper from './FilterWrapper';
import type { FilterState } from '.';
import { computed, defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import classNames from '../../../_util/classNames';
import useConfigInject from '../../../_util/hooks/useConfigInject';
import { useInjectSlots } from '../../context';

const { SubMenu, Item: MenuItem } = Menu;

function hasSubMenu(filters: ColumnFilterItem[]) {
  return filters.some(({ children }) => children && children.length > 0);
}

function renderFilterItems({
  filters,
  prefixCls,
  filteredKeys,
  filterMultiple,
  locale,
}: {
  filters: ColumnFilterItem[];
  prefixCls: string;
  filteredKeys: Key[];
  filterMultiple: boolean;
  locale: TableLocale;
}) {
  if (filters.length === 0) {
    // wrapped with <div /> to avoid react warning
    // https://github.com/ant-design/ant-design/issues/25979
    return (
      <MenuItem key="empty">
        <div
          style={{
            margin: '16px 0',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={locale.filterEmptyText}
            imageStyle={{
              height: 24,
            }}
          />
        </div>
      </MenuItem>
    );
  }
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
            locale,
          })}
        </SubMenu>
      );
    }

    const Component = filterMultiple ? Checkbox : Radio;

    return (
      <MenuItem key={filter.value !== undefined ? key : index}>
        <Component checked={filteredKeys.includes(key)} />
        <span>{filter.text}</span>
      </MenuItem>
    );
  });
}

export interface FilterDropdownProps<RecordType> {
  tablePrefixCls: string;
  prefixCls: string;
  dropdownPrefixCls: string;
  column: ColumnType<RecordType>;
  filterState?: FilterState<RecordType>;
  filterMultiple: boolean;
  columnKey: Key;
  triggerFilter: (filterState: FilterState<RecordType>) => void;
  locale: TableLocale;
  getPopupContainer?: GetPopupContainer;
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
    'columnKey',
    'triggerFilter',
    'locale',
    'getPopupContainer',
  ] as any,
  setup(props, { slots }) {
    const contextSlots = useInjectSlots();
    const filterDropdownVisible = computed(() => props.column.filterDropdownVisible);
    const visible = ref(false);
    const filtered = computed(
      () =>
        !!(
          props.filterState &&
          (props.filterState.filteredKeys?.length || props.filterState.forceFiltered)
        ),
    );

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
      props.column.onFilterDropdownVisibleChange?.(newVisible);
    };

    const mergedVisible = computed(() =>
      typeof filterDropdownVisible.value === 'boolean'
        ? filterDropdownVisible.value
        : visible.value,
    );

    const propFilteredKeys = computed(() => props.filterState?.filteredKeys);

    const filteredKeys = shallowRef([]);

    const onSelectKeys = ({ selectedKeys }: { selectedKeys?: Key[] }) => {
      filteredKeys.value = selectedKeys;
    };

    watch(
      propFilteredKeys,
      () => {
        onSelectKeys({ selectedKeys: propFilteredKeys.value || [] });
      },
      { immediate: true },
    );

    const openKeys = shallowRef([]);

    const openRef = ref();

    const onOpenChange = (keys: string[]) => {
      openRef.value = window.setTimeout(() => {
        openKeys.value = keys;
      });
    };
    const onMenuClick = () => {
      window.clearTimeout(openRef.value);
    };

    onBeforeUnmount(() => {
      window.clearTimeout(openRef.value);
    });

    // ======================= Submit ========================
    const internalTriggerFilter = (keys: Key[] | undefined | null) => {
      const { column, columnKey, filterState } = props;
      const mergedKeys = keys && keys.length ? keys : null;
      if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
        return null;
      }

      if (isEqual(mergedKeys, filterState?.filteredKeys)) {
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

    const onReset = () => {
      filteredKeys.value = [];
      triggerVisible(false);
      internalTriggerFilter([]);
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
    return () => {
      const {
        tablePrefixCls,
        prefixCls,
        column,
        dropdownPrefixCls,
        filterMultiple,
        locale,
        getPopupContainer,
      } = props;
      // ======================== Style ========================
      const dropdownMenuClass = classNames({
        [`${dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(column.filters || []),
      });

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
        });
      } else if (filterDropdownRef.value) {
        dropdownContent = filterDropdownRef.value;
      } else {
        const selectedKeys = filteredKeys.value as any;
        dropdownContent = (
          <>
            <Menu
              multiple={filterMultiple}
              prefixCls={`${dropdownPrefixCls}-menu`}
              class={dropdownMenuClass}
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
                    prefixCls,
                    filteredKeys: filteredKeys.value,
                    filterMultiple,
                    locale,
                  }),
              }}
            ></Menu>
            <div class={`${prefixCls}-dropdown-btns`}>
              <Button
                type="link"
                size="small"
                disabled={selectedKeys.length === 0}
                onClick={onReset}
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
            visible={mergedVisible.value}
            onVisibleChange={onVisibleChange}
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
