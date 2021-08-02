import T from './Table';
import ref from 'vue-ref';
import Vue from 'vue';
import {
  getOptionProps,
  getKey,
  getClass,
  getStyle,
  getEvents,
  getSlotOptions,
  camelize,
  getSlots,
  getListeners,
} from '../_util/props-util';
import Base from '../base';

Vue.use(ref, { name: 'ant-ref' });

const Table = {
  name: 'ATable',
  Column: T.Column,
  ColumnGroup: T.ColumnGroup,
  props: T.props,
  methods: {
    normalize(elements = []) {
      const columns = [];
      elements.forEach(element => {
        if (!element.tag) {
          return;
        }
        const key = getKey(element);
        const style = getStyle(element);
        const cls = getClass(element);
        const props = getOptionProps(element);
        const events = getEvents(element);
        const listeners = {};
        Object.keys(events).forEach(e => {
          /*
          Convert events on template Column to function props onPropAbcChange in Table.columns prop.
          If you write template code like below:
          <Column @prop-abc-change="f1" @update:prop-abc="f2" :prop-abc.sync="dataAbc" />
          You will get these events:
          {
            'prop-abc-change': this.f1,
            'update:prop-abc': [this.f2, e => this.dataAbc = e],
            'update:propAbc': e => this.dataAbc = e,
          }
          All of these events would be treat as column.onPropAbcChange,
          but only one of them will be valid, which can not be determined.
          */
          let k;
          if (e.startsWith('update:')) {
            k = `on-${e.substr('update:'.length)}-change`;
          } else {
            k = `on-${e}`;
          }
          listeners[camelize(k)] = events[e];
        });
        const { default: children, ...restSlots } = getSlots(element);
        const column = { ...restSlots, ...props, style, class: cls, ...listeners };
        if (key) {
          column.key = key;
        }
        if (getSlotOptions(element).__ANT_TABLE_COLUMN_GROUP) {
          column.children = this.normalize(typeof children === 'function' ? children() : children);
        } else {
          const customRender =
            element.data && element.data.scopedSlots && element.data.scopedSlots.default;
          column.customRender = column.customRender || customRender;
        }
        columns.push(column);
      });
      return columns;
    },
    updateColumns(cols = []) {
      const columns = [];
      const { $slots, $scopedSlots } = this;
      cols.forEach(col => {
        const { slots = {}, scopedSlots = {}, ...restProps } = col;
        const column = {
          ...restProps,
        };
        Object.keys(slots).forEach(key => {
          const name = slots[key];
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name].length === 1 ? $slots[name][0] : $slots[name];
          }
        });
        Object.keys(scopedSlots).forEach(key => {
          const name = scopedSlots[key];
          if (column[key] === undefined && $scopedSlots[name]) {
            column[key] = $scopedSlots[name];
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
    const { $slots, normalize, $scopedSlots } = this;
    const props = getOptionProps(this);
    const columns = props.columns ? this.updateColumns(props.columns) : normalize($slots.default);
    let { title, footer } = props;
    const {
      title: slotTitle,
      footer: slotFooter,
      expandedRowRender = props.expandedRowRender,
      expandIcon,
    } = $scopedSlots;
    title = title || slotTitle;
    footer = footer || slotFooter;
    const tProps = {
      props: {
        ...props,
        columns,
        title,
        footer,
        expandedRowRender,
        expandIcon: this.$props.expandIcon || expandIcon,
      },
      on: getListeners(this),
    };
    return <T {...tProps} />;
  },
};
/* istanbul ignore next */
Table.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Table.name, Table);
  Vue.component(Table.Column.name, Table.Column);
  Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
};

export default Table;
