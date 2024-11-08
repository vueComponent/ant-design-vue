import classNames from '../../_util/classNames';
import { filterEmpty, findDOMNode, flattenChildren, isValidElement } from '../../_util/props-util';
import type { CSSProperties, VNodeArrayChildren } from 'vue';
import { watch, shallowRef, Text, computed, defineComponent, isVNode } from 'vue';

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
  AdditionalProps,
} from '../interface';
import { getPathValue, validateValue } from '../utils/valueUtil';
import { useInjectSlots } from '../../table/context';
import { INTERNAL_COL_DEFINE } from '../utils/legacyUtil';
import { useInjectHover } from '../context/HoverContext';
import { useInjectSticky } from '../context/StickyContext';
import { warning } from '../../vc-util/warning';
import type { MouseEventHandler } from '../../_util/EventInterface';
import eagerComputed from '../../_util/eagerComputed';
import { customRenderSlot } from '../../_util/vnode';
import { addClass, removeClass } from '../../vc-util/Dom/class';

/** Check if cell is in hover range */
function inHoverRange(cellStartRow: number, cellRowSpan: number, startRow: number, endRow: number) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}

function isRenderCell<RecordType = DefaultRecordType>(
  data: RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !Array.isArray(data) && !isVNode(data);
}

export interface CellProps<RecordType = DefaultRecordType> {
  prefixCls?: string;
  record?: RecordType;
  /** `column` index is the real show rowIndex */
  index?: number;
  /** the index of the record. For the render(value, record, renderIndex) */
  renderIndex?: number;
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

  additionalProps?: AdditionalProps;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;

  column?: ColumnType<RecordType>;

  cellType?: 'header' | 'body';

  transformCellText?: TransformCellText<RecordType>;
}
export default defineComponent({
  name: 'Cell',
  props: [
    'prefixCls',
    'record',
    'index',
    'renderIndex',
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
  ],
  setup(props, { slots }) {
    const contextSlots = useInjectSlots();
    const { onHover, startRow, endRow } = useInjectHover();
    const colSpan = computed(() => {
      return (
        props.colSpan ??
        props.additionalProps?.colSpan ??
        (props.additionalProps?.colspan as number)
      );
    });
    const rowSpan = computed(() => {
      return (
        props.rowSpan ??
        props.additionalProps?.rowSpan ??
        (props.additionalProps?.rowspan as number)
      );
    });
    const hovering = eagerComputed(() => {
      const { index } = props;
      return inHoverRange(index, rowSpan.value || 1, startRow.value, endRow.value);
    });
    const supportSticky = useInjectSticky();

    // ====================== Hover =======================
    const onMouseenter = (event: MouseEvent, mergedRowSpan: number) => {
      const { record, index, additionalProps } = props;
      if (record) {
        onHover(index, index + mergedRowSpan - 1);
      }

      additionalProps?.onMouseenter?.(event);
    };

    const onMouseleave: MouseEventHandler = event => {
      const { record, additionalProps } = props;
      if (record) {
        onHover(-1, -1);
      }

      additionalProps?.onMouseleave?.(event);
    };
    const getTitle = (vnodes: VNodeArrayChildren) => {
      const vnode = filterEmpty(vnodes)[0];
      if (isVNode(vnode)) {
        if (vnode.type === Text) {
          return vnode.children;
        } else {
          return Array.isArray(vnode.children) ? getTitle(vnode.children) : undefined;
        }
      } else {
        return vnode;
      }
    };

    const hoverRef = shallowRef(null);
    watch([hovering, () => props.prefixCls, hoverRef], () => {
      const cellDom = findDOMNode(hoverRef.value);
      if (!cellDom) return;
      if (hovering.value) {
        addClass(cellDom, `${props.prefixCls}-cell-row-hover`);
      } else {
        removeClass(cellDom, `${props.prefixCls}-cell-row-hover`);
      }
    });
    return () => {
      const {
        prefixCls,
        record,
        index,
        renderIndex,
        dataIndex,
        customRender,
        component: Component = 'td',
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
            renderIndex,
            column: column.__originColumn__,
          });

          if (isRenderCell(renderData)) {
            if (process.env.NODE_ENV !== 'production') {
              warning(
                false,
                '`columns.customRender` return cell props is deprecated with perf issue, please use `customCell` instead.',
              );
            }
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
          const child = customRenderSlot(
            contextSlots.value,
            'bodyCell',
            {
              text: value,
              value,
              record,
              index,
              column: column.__originColumn__,
            },
            () => {
              const fallback = childNode === undefined ? value : childNode;
              return [
                (typeof fallback === 'object' && isValidElement(fallback)) ||
                typeof fallback !== 'object'
                  ? fallback
                  : null,
              ];
            },
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

      // Not crash if final `childNode` is not validate VueNode
      if (typeof childNode === 'object' && !Array.isArray(childNode) && !isVNode(childNode)) {
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
      const mergedColSpan = (cellColSpan !== undefined ? cellColSpan : colSpan.value) ?? 1;
      const mergedRowSpan = (cellRowSpan !== undefined ? cellRowSpan : rowSpan.value) ?? 1;

      if (mergedColSpan === 0 || mergedRowSpan === 0) {
        return null;
      }

      // ====================== Fixed =======================
      const fixedStyle: CSSProperties = {};
      const isFixLeft = typeof fixLeft === 'number' && supportSticky.value;
      const isFixRight = typeof fixRight === 'number' && supportSticky.value;

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
      const ellipsisConfig = ellipsis === true ? { showTitle: true } : ellipsis;
      if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
        if (typeof childNode === 'string' || typeof childNode === 'number') {
          title = childNode.toString();
        } else if (isVNode(childNode)) {
          title = getTitle([childNode]);
        }
      }

      const componentProps = {
        title,
        ...restCellProps,
        ...additionalProps,
        colSpan: mergedColSpan !== 1 ? mergedColSpan : null,
        rowSpan: mergedRowSpan !== 1 ? mergedRowSpan : null,
        class: classNames(
          cellPrefixCls,
          {
            [`${cellPrefixCls}-fix-left`]: isFixLeft && supportSticky.value,
            [`${cellPrefixCls}-fix-left-first`]: firstFixLeft && supportSticky.value,
            [`${cellPrefixCls}-fix-left-last`]: lastFixLeft && supportSticky.value,
            [`${cellPrefixCls}-fix-right`]: isFixRight && supportSticky.value,
            [`${cellPrefixCls}-fix-right-first`]: firstFixRight && supportSticky.value,
            [`${cellPrefixCls}-fix-right-last`]: lastFixRight && supportSticky.value,
            [`${cellPrefixCls}-ellipsis`]: ellipsis,
            [`${cellPrefixCls}-with-append`]: appendNode,
            [`${cellPrefixCls}-fix-sticky`]:
              (isFixLeft || isFixRight) && isSticky && supportSticky.value,
          },
          additionalProps.class,
          cellClassName,
        ),
        onMouseenter: (e: MouseEvent) => {
          onMouseenter(e, mergedRowSpan);
        },
        onMouseleave,
        style: [additionalProps.style, alignStyle, fixedStyle, cellStyle],
      };

      return (
        <Component {...componentProps} ref={hoverRef}>
          {appendNode}
          {childNode}
          {slots.dragHandle?.()}
        </Component>
      );
    };
  },
});
