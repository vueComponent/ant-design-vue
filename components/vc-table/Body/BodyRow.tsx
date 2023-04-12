import Cell from '../Cell';
import { getColumnsKey } from '../utils/valueUtil';
import type { CustomizeComponent, GetComponentProps, Key, GetRowKey } from '../interface';
import ExpandedRow from './ExpandedRow';
import { computed, defineComponent, shallowRef, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
import { useInjectBody } from '../context/BodyContext';
import classNames from '../../_util/classNames';
import type { MouseEventHandler } from '../../_util/EventInterface';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  renderIndex: number;
  recordKey: Key;
  expandedKeys: Set<Key>;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  customRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
  rowKey: Key;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: string;
}

export default defineComponent<BodyRowProps<unknown>>({
  name: 'BodyRow',
  inheritAttrs: false,
  props: [
    'record',
    'index',
    'renderIndex',
    'recordKey',
    'expandedKeys',
    'rowComponent',
    'cellComponent',
    'customRow',
    'rowExpandable',
    'indent',
    'rowKey',
    'getRowKey',
    'childrenColumnName',
  ] as any,
  setup(props, { attrs }) {
    const tableContext = useInjectTable();
    const bodyContext = useInjectBody();
    const expandRended = shallowRef(false);

    const expanded = computed(() => props.expandedKeys && props.expandedKeys.has(props.recordKey));

    watchEffect(() => {
      if (expanded.value) {
        expandRended.value = true;
      }
    });

    const rowSupportExpand = computed(
      () =>
        bodyContext.expandableType === 'row' &&
        (!props.rowExpandable || props.rowExpandable(props.record)),
    );
    // Only when row is not expandable and `children` exist in record
    const nestExpandable = computed(() => bodyContext.expandableType === 'nest');
    const hasNestChildren = computed(
      () => props.childrenColumnName && props.record && props.record[props.childrenColumnName],
    );
    const mergedExpandable = computed(() => rowSupportExpand.value || nestExpandable.value);

    const onInternalTriggerExpand = (record, event) => {
      bodyContext.onTriggerExpand(record, event);
    };

    // =========================== onRow ===========================
    const additionalProps = computed<Record<string, any>>(
      () => props.customRow?.(props.record, props.index) || {},
    );

    const onClick: MouseEventHandler = (event, ...args) => {
      if (bodyContext.expandRowByClick && mergedExpandable.value) {
        onInternalTriggerExpand(props.record, event);
      }

      additionalProps.value?.onClick?.(event, ...args);
    };

    const computeRowClassName = computed(() => {
      const { record, index, indent } = props;
      const { rowClassName } = bodyContext;
      if (typeof rowClassName === 'string') {
        return rowClassName;
      } else if (typeof rowClassName === 'function') {
        return rowClassName(record, index, indent);
      }
      return '';
    });

    const columnsKey = computed(() => getColumnsKey(bodyContext.flattenColumns));

    return () => {
      const { class: className, style } = attrs as any;
      const {
        record,
        index,
        rowKey,
        indent = 0,
        rowComponent: RowComponent,
        cellComponent,
      } = props;
      const { prefixCls, fixedInfoList, transformCellText } = tableContext;
      const {
        flattenColumns,
        expandedRowClassName,
        indentSize,
        expandIcon,
        expandedRowRender,
        expandIconColumnIndex,
      } = bodyContext;
      const baseRowNode = (
        <RowComponent
          {...additionalProps.value}
          data-row-key={rowKey}
          class={classNames(
            className,
            `${prefixCls}-row`,
            `${prefixCls}-row-level-${indent}`,
            computeRowClassName.value,
            additionalProps.value.class,
          )}
          style={[style, additionalProps.value.style]}
          onClick={onClick}
        >
          {flattenColumns.map((column, colIndex) => {
            const { customRender, dataIndex, className: columnClassName } = column;

            const key = columnsKey[colIndex];
            const fixedInfo = fixedInfoList[colIndex];

            let additionalCellProps;
            if (column.customCell) {
              additionalCellProps = column.customCell(record, index, column);
            }
            // not use slot to fix https://github.com/vueComponent/ant-design-vue/issues/5295
            const appendNode =
              colIndex === (expandIconColumnIndex || 0) && nestExpandable.value ? (
                <>
                  <span
                    style={{ paddingLeft: `${indentSize * indent}px` }}
                    class={`${prefixCls}-row-indent indent-level-${indent}`}
                  />
                  {expandIcon({
                    prefixCls,
                    expanded: expanded.value,
                    expandable: hasNestChildren.value,
                    record,
                    onExpand: onInternalTriggerExpand,
                  })}
                </>
              ) : null;
            return (
              <Cell
                cellType="body"
                class={columnClassName}
                ellipsis={column.ellipsis}
                align={column.align}
                component={cellComponent}
                prefixCls={prefixCls}
                key={key}
                record={record}
                index={index}
                renderIndex={props.renderIndex}
                dataIndex={dataIndex}
                customRender={customRender}
                {...fixedInfo}
                additionalProps={additionalCellProps}
                column={column}
                transformCellText={transformCellText}
                appendNode={appendNode}
              />
            );
          })}
        </RowComponent>
      );

      // ======================== Expand Row =========================
      let expandRowNode;
      if (rowSupportExpand.value && (expandRended.value || expanded.value)) {
        const expandContent = expandedRowRender({
          record,
          index,
          indent: indent + 1,
          expanded: expanded.value,
        });
        const computedExpandedRowClassName =
          expandedRowClassName && expandedRowClassName(record, index, indent);
        expandRowNode = (
          <ExpandedRow
            expanded={expanded.value}
            class={classNames(
              `${prefixCls}-expanded-row`,
              `${prefixCls}-expanded-row-level-${indent + 1}`,
              computedExpandedRowClassName,
            )}
            prefixCls={prefixCls}
            component={RowComponent}
            cellComponent={cellComponent}
            colSpan={flattenColumns.length}
            isEmpty={false}
          >
            {expandContent}
          </ExpandedRow>
        );
      }

      return (
        <>
          {baseRowNode}
          {expandRowNode}
        </>
      );
    };
  },
});
