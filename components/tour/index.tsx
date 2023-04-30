import { defineComponent, toRefs } from 'vue';
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

export { TourProps, TourStepProps };

const Tour = defineComponent({
  name: 'ATour',
  props: tourProps(),
  setup(props, { attrs, emit, slots }) {
    const { current } = toRefs(props);
    const { prefixCls, direction } = useConfigInject('tour', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const { currentMergedType, updateInnerCurrent } = useMergedType({
      defaultType: props.type,
      steps: props.steps,
      current,
      defaultCurrent: props.defaultCurrent,
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
        emit('change', stepCurrent);
      };

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
        />,
      );
    };
  },
});

export default withInstall(Tour);
