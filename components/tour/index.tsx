import { defineComponent } from 'vue';
import VCTour from '../vc-tour';
import classNames from '../_util/classNames';
import PanelRender from './panelRender';
import type { TourProps, TourStepProps } from './interface';
import { tourProps } from './interface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { withInstall } from '../_util/type';

// CSSINJS
import useStyle from './style';

export { TourProps, TourStepProps };

const Tour = defineComponent({
  name: 'ATour',
  props: tourProps(),
  setup(props, { attrs }) {
    const { prefixCls, direction } = useConfigInject('tour', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const { steps, current, type, rootClassName, ...restProps } = props;
      const customClassName = classNames(
        {
          [`${prefixCls}-rtl`]: direction.value === 'rtl',
        },
        hashId.value,
        rootClassName,
      );

      const mergedRenderPanel = (stepProps: TourStepProps, stepCurrent: number) => {
        return <PanelRender {...stepProps} current={stepCurrent} type={type} />;
      };

      return wrapSSR(
        <VCTour
          {...attrs}
          {...restProps}
          rootClassName={customClassName}
          prefixCls={prefixCls.value}
          steps={steps}
          current={current}
          animated
          renderPanel={mergedRenderPanel}
        />,
      );
    };
  },
});

export default withInstall(Tour);
