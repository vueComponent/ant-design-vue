import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';

const tooltipContentProps = {
  prefixCls: PropTypes.string,
  overlay: PropTypes.any,
  id: PropTypes.string,
  overlayInnerStyle: PropTypes.any,
};

export type TooltipContentProps = Partial<ExtractPropTypes<typeof tooltipContentProps>>;

export default defineComponent({
  name: 'Content',
  props: tooltipContentProps,
  setup(props: TooltipContentProps) {
    return () => (
      <div
        class={`${props.prefixCls}-inner`}
        id={props.id}
        role="tooltip"
        style={props.overlayInnerStyle}
      >
        {typeof props.overlay === 'function' ? props.overlay() : props.overlay}
      </div>
    );
  },
});
