import T from './Table';
import { getOptionProps, getKey, getPropsData, getSlot } from '../_util/props-util';

const Table = {
  name: 'ATable',
  Column: T.Column,
  ColumnGroup: T.ColumnGroup,
  props: T.props,
  inheritAttrs: false,
  methods: {
    normalize(elements = []) {
      const columns = [];
      elements.forEach(element => {
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
    const props = { ...getOptionProps(this), ...this.$attrs };
    const columns = props.columns ? this.updateColumns(props.columns) : normalize(getSlot(this));
    let { title, footer } = props;
    const {
      title: slotTitle,
      footer: slotFooter,
      expandedRowRender = props.expandedRowRender,
    } = $slots;
    title = title || slotTitle;
    footer = footer || slotFooter;
    const tProps = {
      ...props,
      columns,
      title,
      footer,
      expandedRowRender,
    };
    return <T {...tProps} ref="table" />;
  },
};
/* istanbul ignore next */
Table.install = function(app) {
  app.component(Table.name, Table);
  app.component(Table.Column.name, Table.Column);
  app.component(Table.ColumnGroup.name, Table.ColumnGroup);
};

export default Table;
