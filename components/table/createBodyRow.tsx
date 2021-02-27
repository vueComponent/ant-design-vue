import PropTypes from '../_util/vue-types';
import { computed, defineComponent } from 'vue';
import { getSlot } from '../_util/props-util';
import omit from 'omit.js';

const BodyRowProps = {
  store: PropTypes.object,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string,
};

export default function createBodyRow(Component = 'tr') {
  const BodyRow = defineComponent({
    name: 'BodyRow',
    inheritAttrs: false,
    props: BodyRowProps,
    setup(props) {
      return {
        selected: computed(() => props.store?.selectedRowKeys.indexOf(props.rowKey) >= 0),
      };
    },
    render() {
      const rowProps = omit({ ...this.$props, ...this.$attrs }, [
        'prefixCls',
        'rowKey',
        'store',
        'class',
      ]);
      const className = {
        [`${this.prefixCls}-row-selected`]: this.selected,
        [this.$attrs.class as string]: !!this.$attrs.class,
      };

      return (
        <Component class={className} {...rowProps}>
          {getSlot(this)}
        </Component>
      );
    },
  });

  return BodyRow;
}
