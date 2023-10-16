import { useInjectPanel } from '../PanelContext';
import type { GenerateConfig } from '../generate';
import { getLastDay } from '../utils/timeUtil';
import type { PanelMode } from '../interface';
import { getCellDateDisabled } from '../utils/dateUtil';
import type { VueNode } from '../../_util/type';
import classNames from '../../_util/classNames';
import useMergeProps from '../hooks/useMergeProps';

export type PanelBodyProps<DateType> = {
  prefixCls: string;
  disabledDate?: (date: DateType) => boolean;
  onSelect: (value: DateType) => void;
  picker?: PanelMode;

  // By panel
  headerCells?: VueNode[];
  rowNum: number;
  colNum: number;
  baseDate: DateType;
  getCellClassName: (date: DateType) => Record<string, boolean | undefined>;
  getCellDate: (date: DateType, offset: number) => DateType;
  getCellText: (date: DateType) => VueNode;
  getCellNode?: (date: DateType) => VueNode;
  titleCell?: (date: DateType) => string;
  generateConfig: GenerateConfig<DateType>;

  // Used for week panel
  prefixColumn?: (date: DateType) => VueNode;
  rowClassName?: (date: DateType) => string;
};

function PanelBody<DateType>(_props: PanelBodyProps<DateType>) {
  const {
    prefixCls,
    disabledDate,
    onSelect,
    picker,
    rowNum,
    colNum,
    prefixColumn,
    rowClassName,
    baseDate,
    getCellClassName,
    getCellText,
    getCellNode,
    getCellDate,
    generateConfig,
    titleCell,
    headerCells,
  } = useMergeProps(_props);
  const { onDateMouseenter, onDateMouseleave, mode } = useInjectPanel();

  const cellPrefixCls = `${prefixCls}-cell`;

  // =============================== Body ===============================
  const rows: VueNode[] = [];

  for (let i = 0; i < rowNum; i += 1) {
    const row: VueNode[] = [];
    let rowStartDate: DateType;

    for (let j = 0; j < colNum; j += 1) {
      const offset = i * colNum + j;
      const currentDate = getCellDate(baseDate, offset);
      const disabled = getCellDateDisabled({
        cellDate: currentDate,
        mode: mode.value,
        disabledDate,
        generateConfig,
      });

      if (j === 0) {
        rowStartDate = currentDate;

        if (prefixColumn) {
          row.push(prefixColumn(rowStartDate));
        }
      }

      const title = titleCell && titleCell(currentDate);

      row.push(
        <td
          key={j}
          title={title}
          class={classNames(cellPrefixCls, {
            [`${cellPrefixCls}-disabled`]: disabled,
            [`${cellPrefixCls}-start`]:
              getCellText(currentDate) === 1 || (picker === 'year' && Number(title) % 10 === 0),
            [`${cellPrefixCls}-end`]:
              title === getLastDay(generateConfig, currentDate) ||
              (picker === 'year' && Number(title) % 10 === 9),
            ...getCellClassName(currentDate),
          })}
          onClick={e => {
            e.stopPropagation();
            if (!disabled) {
              onSelect(currentDate);
            }
          }}
          onMouseenter={() => {
            if (!disabled && onDateMouseenter) {
              onDateMouseenter(currentDate);
            }
          }}
          onMouseleave={() => {
            if (!disabled && onDateMouseleave) {
              onDateMouseleave(currentDate);
            }
          }}
        >
          {getCellNode ? (
            getCellNode(currentDate)
          ) : (
            <div class={`${cellPrefixCls}-inner`}>{getCellText(currentDate)}</div>
          )}
        </td>,
      );
    }

    rows.push(
      <tr key={i} class={rowClassName && rowClassName(rowStartDate!)}>
        {row}
      </tr>,
    );
  }

  return (
    <div class={`${prefixCls}-body`}>
      <table class={`${prefixCls}-content`}>
        {headerCells && (
          <thead>
            <tr>{headerCells}</tr>
          </thead>
        )}
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

PanelBody.displayName = 'PanelBody';
PanelBody.inheritAttrs = false;

export default PanelBody;
