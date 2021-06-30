import {
  defineComponent,
  ExtractPropTypes,
  nextTick,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeMount,
} from 'vue';
import classNames from '../_util/classNames';
import raf from '../_util/raf';
import ListItem from './ListItem';
import Pagination from '../pagination';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { DataSourceItem } from './list';

export const transferListBodyProps = {
  prefixCls: PropTypes.string,
  filteredRenderItems: PropTypes.array.def([]),
  lazy: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  selectedKeys: PropTypes.array,
  disabled: PropTypes.looseBool,
  showRemove: PropTypes.looseBool,
  pagination: PropTypes.any,
  onItemSelect: PropTypes.func,
  onItemSelectAll: PropTypes.func,
  onScroll: PropTypes.func,
  onItemRemove: PropTypes.func,
};

export type TransferListBodyProps = Partial<ExtractPropTypes<typeof transferListBodyProps>>;

function parsePagination(pagination) {
  if (!pagination) {
    return null;
  }

  const defaultPagination = {
    pageSize: 10,
  };

  if (typeof pagination === 'object') {
    return {
      ...defaultPagination,
      ...pagination,
    };
  }

  return defaultPagination;
}

const ListBody = defineComponent({
  name: 'ListBody',
  inheritAttrs: false,
  props: transferListBodyProps,
  emits: ['itemSelect', 'itemRemove', 'scroll'],
  setup(props, { emit, expose }) {
    const mounted = ref<boolean>(false);
    const mountId = ref(null);
    const lazyId = ref(null);
    const container = ref(null);
    const current = ref(1);
    const itemsLength = computed(() => {
      return props.filteredRenderItems ? props.filteredRenderItems.length : 0;
    });

    const handleItemSelect = (item: DataSourceItem) => {
      const { selectedKeys } = props;
      const checked = selectedKeys.indexOf(item.key) >= 0;
      emit('itemSelect', item.key, !checked);
    };

    const handleItemRemove = (item: DataSourceItem) => {
      emit('itemRemove', item.key);
    };

    const handleScroll = (e: Event) => {
      emit('scroll', e);
    };

    const getItems = () => {
      const { pagination, filteredRenderItems } = props;

      const mergedPagination = parsePagination(pagination);

      let displayItems = filteredRenderItems;

      if (mergedPagination) {
        displayItems = filteredRenderItems.slice(
          (current.value - 1) * mergedPagination.pageSize,
          current.value * mergedPagination.pageSize,
        );
      }

      return displayItems;
    };

    const onPageChange = (cur: number) => {
      current.value = cur;
    };

    expose({ getItems });

    onMounted(() => {
      mountId.value = raf(() => {
        mounted.value = true;
      });
    });

    onBeforeMount(() => {
      raf.cancel(mountId.value);
      raf.cancel(lazyId.value);
    });

    watch(
      () => itemsLength.value,
      () => {
        nextTick(() => {
          const { lazy } = props;
          if (lazy !== false) {
            raf.cancel(lazyId);
            lazyId.value = raf(() => {
              if (container) {
                const scrollEvent = new Event('scroll', { bubbles: true });
                container.value.dispatchEvent(scrollEvent);
              }
            });
          }
        });
      },
    );

    return () => {
      const {
        prefixCls,
        filteredRenderItems,
        lazy,
        selectedKeys,
        disabled: globalDisabled,
        showRemove,
        pagination,
      } = props;

      const mergedPagination = parsePagination(pagination);
      let paginationNode = null;

      if (mergedPagination) {
        paginationNode = (
          <Pagination
            simple
            size="small"
            disabled={globalDisabled}
            class={`${prefixCls}-pagination`}
            total={filteredRenderItems.length}
            pageSize={mergedPagination.pageSize}
            current={current.value}
            onChange={onPageChange}
          />
        );
      }

      const items = getItems().map(({ renderedEl, renderedText, item }: any) => {
        const { disabled } = item;
        const checked = selectedKeys.indexOf(item.key) >= 0;

        return (
          <ListItem
            disabled={globalDisabled || disabled}
            key={item.key}
            item={item}
            lazy={lazy}
            renderedText={renderedText}
            renderedEl={renderedEl}
            checked={checked}
            prefixCls={prefixCls}
            onClick={handleItemSelect}
            onRemove={handleItemRemove}
            showRemove={showRemove}
          />
        );
      });
      return (
        <>
          <ul
            class={classNames(`${prefixCls}-content`, {
              [`${prefixCls}-content-show-remove`]: showRemove,
            })}
            onScroll={handleScroll}
          >
            {items}
          </ul>
          {paginationNode}
        </>
      );
    };
  },
});

export default (props: TransferListBodyProps, ref) => <ListBody {...props} ref={ref} />;
