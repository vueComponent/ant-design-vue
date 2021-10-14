import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import { withInstall } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import omit from '../_util/omit';
import { getTransitionName } from '../_util/transition';
import { tooltipDefaultProps } from '../tooltip/Tooltip';

export const popoverProps = () => ({
  ...abstractTooltipProps(),
  content: PropTypes.any,
  title: PropTypes.any,
});

export type PopoverProps = Partial<ExtractPropTypes<ReturnType<typeof popoverProps>>>;

const Popover = defineComponent({
  name: 'APopover',
  props: initDefaultProps(popoverProps(), {
    ...tooltipDefaultProps,
    trigger: 'hover',
    transitionName: 'zoom-big',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
  }),
  setup(props, { expose, slots }) {
    const tooltipRef = ref();

    expose({
      getPopupDomNode: () => {
        return tooltipRef.value?.getPopupDomNode?.();
      },
    });
    const { prefixCls, configProvider } = useConfigInject('popover', props);
    const rootPrefixCls = computed(() => configProvider.getPrefixCls());
    const getOverlay = () => {
      const { title = slots.title?.(), content = slots.content?.() } = props;
      return (
        <>
          {title && <div class={`${prefixCls.value}-title`}>{title}</div>}
          <div class={`${prefixCls.value}-inner-content`}>{content}</div>
        </>
      );
    };
    return () => {
      return (
        <Tooltip
          {...omit(props, ['title', 'content'])}
          prefixCls={prefixCls.value}
          ref={tooltipRef}
          v-slots={{ title: getOverlay, default: slots.default }}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
        />
      );
    };
  },
});

export default withInstall(Popover);
