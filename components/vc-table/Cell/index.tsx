import classNames from '../../_util/classNames';
import { flattenChildren, isValidElement, parseStyleText } from '../../_util/props-util';
import type { CSSProperties, HTMLAttributes } from 'vue';
import { defineComponent, isVNode, renderSlot } from 'vue';

import type {
  DataIndex,
  ColumnType,
  RenderedCell,
  CustomizeComponent,
  CellType,
  DefaultRecordType,
  AlignType,
  CellEllipsisType,
  TransformCellText,
} from '../interface';
import { getPathValue, validateValue } from '../utils/valueUtil';
import { useInjectSlots } from '../../table/context';
import { INTERNAL_COL_DEFINE } from '../utils/legacyUtil';

function isRenderCell<RecordType = DefaultRecordType>(
  data: RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !Array.isArray(data) && !isValidElement(data);
}

export interface CellProps<RecordType = DefaultRecordType> {
  prefixCls?: string;
  record?: RecordType;
  /** `record` index. Not `column` index. */
  index?: number;
  dataIndex?: DataIndex;
  customRender?: ColumnType<RecordType>['customRender'];
  component?: CustomizeComponent;
  colSpan?: number;
  rowSpan?: number;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  firstFixLeft?: boolean;
  lastFixLeft?: boolean;
  firstFixRight?: boolean;
  lastFixRight?: boolean;

  // Additional
  /** @private Used for `expandable` with nest tree */
  appendNode?: any;

  additionalProps?: HTMLAttributes;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;

  column?: ColumnType<RecordType>;

  cellType?: 'header' | 'body';

  transformCellText?: TransformCellText<RecordType>;
}
export default defineComponent<CellProps>({
  name: 'Cell',
  props: [
    'prefixCls',
    'record',
    'index',
    'dataIndex',
    'customRender',
    'component',
    'colSpan',
    'rowSpan',
    'fixLeft',
    'fixRight',
    'firstFixLeft',
    'lastFixLeft',
    'firstFixRight',
    'lastFixRight',
    'appendNode',
    'additionalProps',
    'ellipsis',
    'align',
    'rowType',
    'isSticky',
    'column',
    'cellType',
    'transformCellText',
  ] as any,
  slots: ['appendNode'],
  setup(props, { slots }) {
    const contextSlots = useInjectSlots();
    return () => {
      const {
        prefixCls,
        record,
        index,
        dataIndex,
        customRender,
        component: Component = 'td',
        colSpan,
        rowSpan,
        fixLeft,
        fixRight,
        firstFixLeft,
        lastFixLeft,
        firstFixRight,
        lastFixRight,
        appendNode = slots.appendNode?.(),
        additionalProps = {},
        ellipsis,
        align,
        rowType,
        isSticky,
        column = {},
        cellType,
      } = props;
      const cellPrefixCls = `${prefixCls}-cell`;

      // ==================== Child Node ====================
      let cellProps: CellType;
      let childNode;
      const children = slots.default?.();
      if (validateValue(children) || cellType === 'header') {
        childNode = children;
      } else {
        const value = getPathValue(record, dataIndex);

        // Customize render node
        childNode = value;
        if (customRender) {
          const renderData = customRender({
            text: value,
            value,
            record,
            index,
            column: column.__originColumn__,
          });

          if (isRenderCell(renderData)) {
            childNode = renderData.children;
            cellProps = renderData.props;
          } else {
            childNode = renderData;
          }
        }

        if (
          !(INTERNAL_COL_DEFINE in column) &&
          cellType === 'body' &&
          contextSlots.value.bodyCell &&
          !column.slots?.customRender
        ) {
          const child = renderSlot(
            contextSlots.value,
            'bodyCell',
            {
              text: value,
              value,
              record,
              index,
              column: column.__originColumn__,
            },
            () => [childNode === undefined ? value : childNode],
          );
          childNode = flattenChildren(child as any);
        }
        /** maybe we should @deprecated */
        if (props.transformCellText) {
          childNode = props.transformCellText({
            text: childNode,
            record,
            index,
            column: column.__originColumn__,
          });
        }
      }

      // Not crash if final `childNode` is not validate ReactNode
      if (
        typeof childNode === 'object' &&
        !Array.isArray(childNode) &&
        !isValidElement(childNode)
      ) {
        childNode = null;
      }

      if (ellipsis && (lastFixLeft || firstFixRight)) {
        childNode = <span class={`${cellPrefixCls}-content`}>{childNode}</span>;
      }

      if (Array.isArray(childNode) && childNode.length === 1) {
        childNode = childNode[0];
      }
      const {
        colSpan: cellColSpan,
        rowSpan: cellRowSpan,
        style: cellStyle,
        class: cellClassName,
        ...restCellProps
      } = cellProps || {};
      const mergedColSpan = cellColSpan !== undefined ? cellColSpan : colSpan;
      const mergedRowSpan = cellRowSpan !== undefined ? cellRowSpan : rowSpan;

      if (mergedColSpan === 0 || mergedRowSpan === 0) {
        return null;
      }

      // ====================== Fixed =======================
      const fixedStyle: CSSProperties = {};
      const isFixLeft = typeof fixLeft === 'number';
      const isFixRight = typeof fixRight === 'number';

      if (isFixLeft) {
        fixedStyle.position = 'sticky';
        fixedStyle.left = `${fixLeft}px`;
      }
      if (isFixRight) {
        fixedStyle.position = 'sticky';

        fixedStyle.right = `${fixRight}px`;
      }

      // ====================== Align =======================
      const alignStyle: CSSProperties = {};
      if (align) {
        alignStyle.textAlign = align;
      }

      // ====================== Render ======================
      let title: string;
      const ellipsisConfig: CellEllipsisType = ellipsis === true ? { showTitle: true } : ellipsis;
      if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
        if (typeof childNode === 'string' || typeof childNode === 'number') {
          title = childNode.toString();
        } else if (isVNode(childNode) && typeof childNode.children === 'string') {
          title = childNode.children;
        }
      }

      const componentProps = {
        title,
        ...restCellProps,
        ...additionalProps,
        colSpan: mergedColSpan && mergedColSpan !== 1 ? mergedColSpan : null,
        rowSpan: mergedRowSpan && mergedRowSpan !== 1 ? mergedRowSpan : null,
        class: classNames(
          cellPrefixCls,
          {
            [`${cellPrefixCls}-fix-left`]: isFixLeft,
            [`${cellPrefixCls}-fix-left-first`]: firstFixLeft,
            [`${cellPrefixCls}-fix-left-last`]: lastFixLeft,
            [`${cellPrefixCls}-fix-right`]: isFixRight,
            [`${cellPrefixCls}-fix-right-first`]: firstFixRight,
            [`${cellPrefixCls}-fix-right-last`]: lastFixRight,
            [`${cellPrefixCls}-ellipsis`]: ellipsis,
            [`${cellPrefixCls}-with-append`]: appendNode,
            [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky,
          },
          additionalProps.class,
          cellClassName,
        ),
        style: {
          ...parseStyleText(additionalProps.style as any),
          ...alignStyle,
          ...fixedStyle,
          ...cellStyle,
        },
      };

      return (
        <Component {...componentProps}>
          {appendNode}
          {childNode}
        </Component>
      );
    };
  },
});
