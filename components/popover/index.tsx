import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { anyType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import { getTransitionName } from '../_util/transition';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import useStyle from './style';
import classNames from '../_util/classNames';
import warning from '../_util/warning';

export const popoverProps = () => ({
  ...abstractTooltipProps(),
  content: anyType(),
  title: anyType(),
});

export type PopoverProps = Partial<ExtractPropTypes<ReturnType<typeof popoverProps>>>;

const Popover = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APopover',
  inheritAttrs: false,
  props: initDefaultProps(popoverProps(), {
    ...tooltipDefaultProps(),
    trigger: 'hover',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
  }),
  setup(props, { expose, slots, attrs }) {
    const tooltipRef = ref();
    warning(
      props.visible === undefined,
      'popover',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );
    expose({
      getPopupDomNode: () => {
        return tooltipRef.value?.getPopupDomNode?.();
      },
    });
    const { prefixCls, configProvider } = useConfigInject('popover', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootPrefixCls = computed(() => configProvider.getPrefixCls());
    const getOverlay = () => {
      const { title = filterEmpty(slots.title?.()), content = filterEmpty(slots.content?.()) } =
        props;
      const hasTitle = !!(Array.isArray(title) ? title.length : title);
      const hasContent = !!(Array.isArray(content) ? content.length : title);
      if (!hasTitle && !hasContent) return null;
      return (
        <>
          {hasTitle && <div class={`${prefixCls.value}-title`}>{title}</div>}
          <div class={`${prefixCls.value}-inner-content`}>{content}</div>
        </>
      );
    };
    return () => {
      const overlayCls = classNames(props.overlayClassName, hashId.value);
      return wrapSSR(
        <Tooltip
          {...omit(props, ['title', 'content'])}
          {...attrs}
          prefixCls={prefixCls.value}
          ref={tooltipRef}
          overlayClassName={overlayCls}
          v-slots={{ title: getOverlay, default: slots.default }}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName)}
          data-popover-inject
        />,
      );
    };
  },
});

export default withInstall(Popover);
