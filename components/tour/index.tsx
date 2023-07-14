import { computed, defineComponent, toRefs } from 'vue';
import VCTour from '../vc-tour';
import classNames from '../_util/classNames';
import TourPanel from './panelRender';
import type { TourProps, TourStepProps } from './interface';
import { tourProps } from './interface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import useMergedType from './useMergedType';

// CSSINJS
import useStyle from './style';
import getPlacements from '../_util/placements';

export { TourProps, TourStepProps };

const Tour = defineComponent({
  name: 'ATour',
  inheritAttrs: false,
  props: tourProps(),
  setup(props, { attrs, emit, slots }) {
    const { current, type, steps, defaultCurrent } = toRefs(props);
    const { prefixCls, direction } = useConfigInject('tour', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const { currentMergedType, updateInnerCurrent } = useMergedType({
      defaultType: type,
      steps,
      current,
      defaultCurrent,
    });
    return () => {
      const { steps, current, type, rootClassName, ...restProps } = props;

      const customClassName = classNames(
        {
          [`${prefixCls.value}-primary`]: currentMergedType.value === 'primary',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
        rootClassName,
      );

      const mergedRenderPanel = (stepProps: TourStepProps, stepCurrent: number): VueNode => {
        return (
          <TourPanel
            {...stepProps}
            type={type}
            current={stepCurrent}
            v-slots={{
              indicatorsRender: slots.indicatorsRender,
            }}
          ></TourPanel>
        );
      };

      const onStepChange = (stepCurrent: number) => {
        updateInnerCurrent(stepCurrent);
        emit('update:current', stepCurrent);
        emit('change', stepCurrent);
      };

      const builtinPlacements = computed(() =>
        getPlacements({
          arrowPointAtCenter: true,
          autoAdjustOverflow: true,
        }),
      );

      return wrapSSR(
        <VCTour
          {...attrs}
          {...restProps}
          rootClassName={customClassName}
          prefixCls={prefixCls.value}
          current={current}
          defaultCurrent={props.defaultCurrent}
          animated
          renderPanel={mergedRenderPanel}
          onChange={onStepChange}
          steps={steps}
          builtinPlacements={builtinPlacements.value as any}
        />,
      );
    };
  },
});

export default withInstall(Tour);
