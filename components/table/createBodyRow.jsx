import PropTypes from '../_util/vue-types';

import { Store } from './createStore';
import { getSlot } from '../_util/props-util';
import Omit from 'omit.js';

const BodyRowProps = {
  store: Store,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string,
};

export default function createBodyRow(Component = 'tr') {
  const BodyRow = {
    name: 'BodyRow',
    inheritAttrs: false,
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

    beforeUnmount() {
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
      const rowProps = Omit({ ...this.$props, ...this.$attrs }, [
        'prefixCls',
        'rowKey',
        'store',
        'class',
      ]);
      const className = {
        [`${this.prefixCls}-row-selected`]: this.selected,
        [this.$attrs.class]: !!this.$attrs.class,
      };

      return (
        <Component class={className} {...rowProps}>
          {getSlot(this)}
        </Component>
      );
    },
  };

  return BodyRow;
}
