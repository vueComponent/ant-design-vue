import type { HeaderProps } from '../Header/Header';
import ColGroup from '../ColGroup';
import type { ColumnsType, ColumnType, DefaultRecordType } from '../interface';
import type { Ref } from 'vue';
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef,
  watchEffect,
} from 'vue';
import { useInjectTable } from '../context/TableContext';
import classNames from '../../_util/classNames';
import addEventListenerWrap from '../../vc-util/Dom/addEventListener';

function useColumnWidth(colWidthsRef: Ref<readonly number[]>, columCountRef: Ref<number>) {
  return computed(() => {
    const cloneColumns: number[] = [];
    const colWidths = colWidthsRef.value;
    const columCount = columCountRef.value;
    for (let i = 0; i < columCount; i += 1) {
      const val = colWidths[i];
      if (val !== undefined) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  });
}

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  noData: boolean;
  maxContentScroll: boolean;
  colWidths: readonly number[];
  columCount: number;
  direction: 'ltr' | 'rtl';
  fixHeader: boolean;
  stickyTopOffset?: number;
  stickyBottomOffset?: number;
  stickyClassName?: string;
  onScroll: (info: { currentTarget: HTMLDivElement; scrollLeft?: number }) => void;
}

export default defineComponent<FixedHeaderProps<DefaultRecordType>>({
  name: 'FixedHolder',
  inheritAttrs: false,
  props: [
    'columns',
    'flattenColumns',
    'stickyOffsets',
    'customHeaderRow',
    'noData',
    'maxContentScroll',
    'colWidths',
    'columCount',
    'direction',
    'fixHeader',
    'stickyTopOffset',
    'stickyBottomOffset',
    'stickyClassName',
  ] as any,
  emits: ['scroll'],
  setup(props, { attrs, slots, emit }) {
    const tableContext = useInjectTable();
    const combinationScrollBarSize = computed(() =>
      tableContext.isSticky && !props.fixHeader ? 0 : tableContext.scrollbarSize,
    );
    const scrollRef = ref();
    const onWheel = (e: WheelEvent) => {
      const { currentTarget, deltaX } = e;
      if (deltaX) {
        emit('scroll', { currentTarget, scrollLeft: (currentTarget as any).scrollLeft + deltaX });
        e.preventDefault();
      }
    };
    const wheelEvent = ref();
    onMounted(() => {
      nextTick(() => {
        wheelEvent.value = addEventListenerWrap(scrollRef.value, 'wheel', onWheel);
      });
    });
    onBeforeUnmount(() => {
      wheelEvent.value?.remove();
    });

    // Check if all flattenColumns has width
    const allFlattenColumnsWithWidth = computed(() =>
      props.flattenColumns.every(
        column => column.width && column.width !== 0 && column.width !== '0px',
      ),
    );

    const columnsWithScrollbar = ref<ColumnsType<unknown>>([]);
    const flattenColumnsWithScrollbar = ref<ColumnsType<unknown>>([]);

    watchEffect(() => {
      // Add scrollbar column
      const lastColumn = props.flattenColumns[props.flattenColumns.length - 1];
      const ScrollBarColumn: ColumnType<unknown> & { scrollbar: true } = {
        fixed: lastColumn ? lastColumn.fixed : null,
        scrollbar: true,
        customHeaderCell: () => ({
          class: `${tableContext.prefixCls}-cell-scrollbar`,
        }),
      };

      columnsWithScrollbar.value = combinationScrollBarSize.value
        ? [...props.columns, ScrollBarColumn]
        : props.columns;

      flattenColumnsWithScrollbar.value = combinationScrollBarSize.value
        ? [...props.flattenColumns, ScrollBarColumn]
        : props.flattenColumns;
    });

    // Calculate the sticky offsets
    const headerStickyOffsets = computed(() => {
      const { stickyOffsets, direction } = props;
      const { right, left } = stickyOffsets;
      return {
        ...stickyOffsets,
        left:
          direction === 'rtl'
            ? [...left.map(width => width + combinationScrollBarSize.value), 0]
            : left,
        right:
          direction === 'rtl'
            ? right
            : [...right.map(width => width + combinationScrollBarSize.value), 0],
        isSticky: tableContext.isSticky,
      };
    });

    const mergedColumnWidth = useColumnWidth(toRef(props, 'colWidths'), toRef(props, 'columCount'));

    return () => {
      const {
        noData,
        columCount,
        stickyTopOffset,
        stickyBottomOffset,
        stickyClassName,
        maxContentScroll,
      } = props;
      const { isSticky } = tableContext;
      return (
        <div
          style={{
            overflow: 'hidden',
            ...(isSticky ? { top: `${stickyTopOffset}px`, bottom: `${stickyBottomOffset}px` } : {}),
          }}
          ref={scrollRef}
          class={classNames(attrs.class, {
            [stickyClassName]: !!stickyClassName,
          })}
        >
          <table
            style={{
              tableLayout: 'fixed',
              visibility: noData || mergedColumnWidth.value ? null : 'hidden',
            }}
          >
            {(!noData || !maxContentScroll || allFlattenColumnsWithWidth.value) && (
              <ColGroup
                colWidths={
                  mergedColumnWidth.value
                    ? [...mergedColumnWidth.value, combinationScrollBarSize.value]
                    : []
                }
                columCount={columCount + 1}
                columns={flattenColumnsWithScrollbar.value}
              />
            )}
            {slots.default?.({
              ...props,
              stickyOffsets: headerStickyOffsets.value,
              columns: columnsWithScrollbar.value,
              flattenColumns: flattenColumnsWithScrollbar.value,
            })}
          </table>
        </div>
      );
    };
  },
});
