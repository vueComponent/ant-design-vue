import { defineComponent, HTMLAttributes } from 'vue';
import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';
import { Breakpoint } from '../_util/responsiveObserve';
import useRow from './hooks/useRow';

const RowAligns = tuple('top', 'middle', 'bottom', 'stretch');
const RowJustify = tuple('start', 'end', 'center', 'space-around', 'space-between');

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export interface rowContextState {
  gutter?: [number, number];
}

export interface RowProps extends HTMLAttributes {
  type?: 'flex';
  gutter?: Gutter | [Gutter, Gutter];
  align?: typeof RowAligns[number];
  justify?: typeof RowJustify[number];
  prefixCls?: string;
}

const ARow = defineComponent<RowProps>({
  name: 'ARow',
  setup(props, { slots }) {
    const { class: className, style: rowStyle } = useRow(props);
    return () => (
      <div class={className.value} style={rowStyle.value}>
        {slots.default?.()}
      </div>
    );
  },
});

ARow.props = {
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(RowAligns),
  justify: PropTypes.oneOf(RowJustify),
  prefixCls: PropTypes.string,
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]).def(0),
};

export default ARow;
export { useRow };
