// base rc-table@7.17.2
import type { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import { getColumnsKey } from '../utils/valueUtil';
import MeasureCell from './MeasureCell';
import BodyRow from './BodyRow';
import useFlattenRecords from '../hooks/useFlattenRecords';
import { defineComponent, shallowRef, toRef } from 'vue';
import { useInjectResize } from '../context/ResizeContext';
import { useInjectTable } from '../context/TableContext';
import { useInjectBody } from '../context/BodyContext';
import { useProvideHover } from '../context/HoverContext';

export interface BodyProps<RecordType> {
  data: RecordType[];
  getRowKey: GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  expandedKeys: Set<Key>;
  customRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  childrenColumnName: string;
}

export default defineComponent<BodyProps<any>>({
  name: 'TableBody',
  props: [
    'data',
    'getRowKey',
    'measureColumnWidth',
    'expandedKeys',
    'customRow',
    'rowExpandable',
    'childrenColumnName',
  ] as any,
  setup(props, { slots }) {
    const resizeContext = useInjectResize();
    const tableContext = useInjectTable();
    const bodyContext = useInjectBody();

    const flattenData = useFlattenRecords(
      toRef(props, 'data'),
      toRef(props, 'childrenColumnName'),
      toRef(props, 'expandedKeys'),
      toRef(props, 'getRowKey'),
    );
    const startRow = shallowRef(-1);
    const endRow = shallowRef(-1);
    let timeoutId: any;
    useProvideHover({
      startRow,
      endRow,
      onHover: (start, end) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          startRow.value = start;
          endRow.value = end;
        }, 100);
      },
    });
    return () => {
      const {
        data,
        getRowKey,
        measureColumnWidth,
        expandedKeys,
        customRow,
        rowExpandable,
        childrenColumnName,
      } = props;
      const { onColumnResize } = resizeContext;
      const { prefixCls, getComponent } = tableContext;
      const { flattenColumns } = bodyContext;
      const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
      const trComponent = getComponent(['body', 'row'], 'tr');
      const tdComponent = getComponent(['body', 'cell'], 'td');

      let rows;
      if (data.length) {
        rows = flattenData.value.map((item, idx) => {
          const { record, indent, index: renderIndex } = item;

          const key = getRowKey(record, idx);

          return (
            <BodyRow
              key={key}
              rowKey={key}
              record={record}
              recordKey={key}
              index={idx}
              renderIndex={renderIndex}
              rowComponent={trComponent}
              cellComponent={tdComponent}
              expandedKeys={expandedKeys}
              customRow={customRow}
              getRowKey={getRowKey}
              rowExpandable={rowExpandable}
              childrenColumnName={childrenColumnName}
              indent={indent}
            />
          );
        });
      } else {
        rows = (
          <ExpandedRow
            expanded
            class={`${prefixCls}-placeholder`}
            prefixCls={prefixCls}
            component={trComponent}
            cellComponent={tdComponent}
            colSpan={flattenColumns.length}
            isEmpty
          >
            {slots.emptyNode?.()}
          </ExpandedRow>
        );
      }

      const columnsKey = getColumnsKey(flattenColumns);

      return (
        <WrapperComponent class={`${prefixCls}-tbody`}>
          {/* Measure body column width with additional hidden col */}
          {measureColumnWidth && (
            <tr
              aria-hidden="true"
              class={`${prefixCls}-measure-row`}
              style={{ height: 0, fontSize: 0 }}
            >
              {columnsKey.map(columnKey => (
                <MeasureCell
                  key={columnKey}
                  columnKey={columnKey}
                  onColumnResize={onColumnResize}
                />
              ))}
            </tr>
          )}

          {rows}
        </WrapperComponent>
      );
    };
  },
});
