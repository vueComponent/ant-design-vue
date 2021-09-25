import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';

const tooltipContentProps = {
  prefixCls: PropTypes.string,
  id: PropTypes.string,
  overlayInnerStyle: PropTypes.any,
};

export type TooltipContentProps = Partial<ExtractPropTypes<typeof tooltipContentProps>>;

export default defineComponent({
  name: 'Content',
  props: tooltipContentProps,
  slots: ['overlay'],
  setup(props: TooltipContentProps, { slots }) {
    return () => (
      <div
        class={`${props.prefixCls}-inner`}
        id={props.id}
        role="tooltip"
        style={props.overlayInnerStyle}
      >
        {slots.overlay?.()}
      </div>
    );
  },
});
