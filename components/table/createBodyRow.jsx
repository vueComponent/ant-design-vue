import PropTypes from '../_util/vue-types';

import { Store } from './createStore';
import { getListeners } from '../_util/props-util';

const BodyRowProps = {
  store: Store,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string,
};

export default function createTableRow(Component = 'tr') {
  const BodyRow = {
    name: 'BodyRow',
    props: BodyRowProps,
    data() {
      const { selectedRowKeys } = this.store.getState();

      return {
        selected: selectedRowKeys.indexOf(this.rowKey) >= 0,
      };
    },

    mounted() {
      this.subscribe();
    },

    beforeDestroy() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    },
    methods: {
      subscribe() {
        const { store, rowKey } = this;
        this.unsubscribe = store.subscribe(() => {
          const { selectedRowKeys } = this.store.getState();
          const selected = selectedRowKeys.indexOf(rowKey) >= 0;
          if (selected !== this.selected) {
            this.selected = selected;
          }
        });
      },
    },

    render() {
      const className = {
        [`${this.prefixCls}-row-selected`]: this.selected,
      };

      return (
        <Component class={className} {...{ on: getListeners(this) }}>
          {this.$slots.default}
        </Component>
      );
    },
  };

  return BodyRow;
}
