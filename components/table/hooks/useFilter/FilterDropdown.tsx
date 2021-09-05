import isEqual from 'lodash-es/isEqual';
import FilterFilled from '@ant-design/icons-vue/FilterFilled';
import Button from '../../../button';
import Menu from '../../../menu';
import Checkbox from '../../../checkbox';
import Radio from '../../../radio';
import Dropdown from '../../../dropdown';
import Empty from '../../../empty';
import { ColumnType, ColumnFilterItem, Key, TableLocale, GetPopupContainer } from '../../interface';
import FilterDropdownMenuWrapper from './FilterWrapper';
import { FilterState } from '.';
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import useConfigInject from 'ant-design-vue/es/_util/hooks/useConfigInject';

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
    const filterDropdownVisible = computed(() => props.column.filterDropdownVisible);
    const visible = ref(false);
    const filtered = computed(
      () =>
        !!(
          props.filterState &&
          (props.filterState.filteredKeys?.length || props.filterState.forceFiltered)
        ),
    );

    const triggerVisible = (newVisible: boolean) => {
      visible.value = newVisible;
      props.column.onFilterDropdownVisibleChange?.(newVisible);
    };

    const mergedVisible = computed(() =>
      typeof filterDropdownVisible.value === 'boolean'
        ? filterDropdownVisible.value
        : visible.value,
    );

    const filteredKeys = ref([]);

    const mergedFilteredKeys = computed(
      () => props.filterState?.filteredKeys || filteredKeys.value || [],
    );

    const onSelectKeys = ({ selectedKeys }: { selectedKeys?: Key[] }) => {
      filteredKeys.value = selectedKeys;
    };

    const openKeys = ref([]);

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
      internalTriggerFilter(mergedFilteredKeys.value);
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
      internalTriggerFilter(mergedFilteredKeys.value);
    };

    const onVisibleChange = (newVisible: boolean) => {
      triggerVisible(newVisible);

      // Default will filter when closed
      if (!newVisible && !props.column.filterDropdown) {
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

      if (typeof column.filterDropdown === 'function') {
        dropdownContent = column.filterDropdown({
          prefixCls: `${dropdownPrefixCls}-custom`,
          setSelectedKeys: (selectedKeys: Key[]) => onSelectKeys({ selectedKeys }),
          selectedKeys: mergedFilteredKeys.value,
          confirm: doFilter,
          clearFilters: onReset,
          filters: column.filters,
          visible: mergedVisible.value,
        });
      } else if (column.filterDropdown) {
        dropdownContent = column.filterDropdown;
      } else {
        const selectedKeys = mergedFilteredKeys.value as any;
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
                    filteredKeys: mergedFilteredKeys.value,
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
      if (typeof column.filterIcon === 'function') {
        filterIcon = column.filterIcon(filtered.value);
      } else if (column.filterIcon) {
        filterIcon = column.filterIcon;
      } else {
        filterIcon = <FilterFilled />;
      }

      return (
        <div class={`${prefixCls}-column`}>
          <span class={`${tablePrefixCls}-column-title`}>{slots.defalut?.()}</span>
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
