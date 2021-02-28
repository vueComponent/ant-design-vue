import PropTypes from '../_util/vue-types';
import { getListeners } from '../_util/props-util';

const BodyRowProps = {
  store: PropTypes.any,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string,
};

export default function createBodyRow(Component = 'tr') {
  const BodyRow = {
    name: 'BodyRow',
    props: BodyRowProps,
    computed: {
      selected() {
        return this.$props.store.selectedRowKeys.indexOf(this.$props.rowKey) >= 0;
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
