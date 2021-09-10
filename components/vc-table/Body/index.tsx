import type { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import { getColumnsKey } from '../utils/valueUtil';
import MeasureCell from './MeasureCell';
import BodyRow from './BodyRow';
import useFlattenRecords from '../hooks/useFlattenRecords';
import { defineComponent, toRef } from 'vue';
import { useInjectResize } from '../context/ResizeContext';
import { useInjectTable } from '../context/TableContext';
import { useInjectBody } from '../context/BodyContext';

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
  name: 'Body',
  props: [
    'data',
    'getRowKey',
    'measureColumnWidth',
    'expandedKeys',
    'customRow',
    'rowExpandable',
    'childrenColumnName',
  ] as any,
  slots: ['emptyNode'],
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
      const { fixHeader, horizonScroll, flattenColumns, componentWidth } = bodyContext;
      const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
      const trComponent = getComponent(['body', 'row'], 'tr');
      const tdComponent = getComponent(['body', 'cell'], 'td');

      let rows;
      if (data.length) {
        rows = flattenData.value.map((item, index) => {
          const { record, indent } = item;

          const key = getRowKey(record, index);

          return (
            <BodyRow
              key={key}
              rowKey={key}
              record={record}
              recordKey={key}
              index={index}
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
            fixHeader={fixHeader}
            fixColumn={horizonScroll}
            horizonScroll={horizonScroll}
            component={trComponent}
            componentWidth={componentWidth}
            cellComponent={tdComponent}
            colSpan={flattenColumns.length}
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
