import type { App, Plugin } from 'vue';
import { defineComponent } from 'vue';
import T, { defaultTableProps } from './Table';
import type Column from './Column';
import type ColumnGroup from './ColumnGroup';
import {
  getOptionProps,
  getKey,
  getPropsData,
  getSlot,
  flattenChildren,
} from '../_util/props-util';

const Table = defineComponent({
  name: 'ATable',
  Column: T.Column,
  ColumnGroup: T.ColumnGroup,
  inheritAttrs: false,
  props: defaultTableProps,
  methods: {
    normalize(elements = []) {
      const flattenElements = flattenChildren(elements);
      const columns = [];
      flattenElements.forEach(element => {
        if (!element) {
          return;
        }
        const key = getKey(element);
        const style = element.props?.style || {};
        const cls = element.props?.class || '';
        const props = getPropsData(element);
        const { default: children, ...restSlots } = element.children || {};
        const column = { ...restSlots, ...props, style, class: cls };
        if (key) {
          column.key = key;
        }
        if (element.type?.__ANT_TABLE_COLUMN_GROUP) {
          column.children = this.normalize(typeof children === 'function' ? children() : children);
        } else {
          const customRender = element.children?.default;
          column.customRender = column.customRender || customRender;
        }
        columns.push(column);
      });
      return columns;
    },
    updateColumns(cols = []) {
      const columns = [];
      const { $slots } = this;
      cols.forEach(col => {
        const { slots = {}, ...restProps } = col;
        const column = {
          ...restProps,
        };
        Object.keys(slots).forEach(key => {
          const name = slots[key];
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name];
          }
        });
        // if (slotScopeName && $scopedSlots[slotScopeName]) {
        //   column.customRender = column.customRender || $scopedSlots[slotScopeName]
        // }
        if (col.children) {
          column.children = this.updateColumns(column.children);
        }
        columns.push(column);
      });
      return columns;
    },
  },
  render() {
    const { normalize, $slots } = this;
    const props: any = { ...getOptionProps(this), ...this.$attrs };
    const columns = props.columns ? this.updateColumns(props.columns) : normalize(getSlot(this));
    let { title, footer } = props;
    const {
      title: slotTitle,
      footer: slotFooter,
      expandedRowRender = props.expandedRowRender,
      expandIcon,
    } = $slots;
    title = title || slotTitle;
    footer = footer || slotFooter;
    const tProps = {
      ...props,
      columns,
      title,
      footer,
      expandedRowRender,
      expandIcon: this.$props.expandIcon || expandIcon,
    };
    return <T {...tProps} ref="table" />;
  },
});
/* istanbul ignore next */
Table.install = function (app: App) {
  app.component(Table.name, Table);
  app.component(Table.Column.name, Table.Column);
  app.component(Table.ColumnGroup.name, Table.ColumnGroup);
  return app;
};

export const TableColumn = Table.Column;
export const TableColumnGroup = Table.ColumnGroup;

export default Table as typeof Table &
  Plugin & {
    readonly Column: typeof Column;
    readonly ColumnGroup: typeof ColumnGroup;
  };
