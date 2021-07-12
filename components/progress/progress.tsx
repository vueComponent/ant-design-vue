import type { VNodeChild } from 'vue';
import { computed, defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import Line from './Line';
import Circle from './Circle';
import Steps from './Steps';
import { getSuccessPercent, validProgress } from './utils';
import useConfigInject from '../_util/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import { progressProps, progressStatuses } from './props';

export default defineComponent({
  name: 'AProgress',
  props: initDefaultProps(progressProps(), {
    type: 'line',
    percent: 0,
    showInfo: true,
    // null for different theme definition
    trailColor: null,
    size: 'default',
    gapDegree: 0,
    strokeLinecap: 'round',
  }),
  slots: ['format'],
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('progress', props);
    devWarning(
      props.successPercent == undefined,
      'Progress',
      '`successPercent` is deprecated. Please use `success.percent` instead.',
    );
    const classString = computed(() => {
      const { type, showInfo, size } = props;
      const pre = prefixCls.value;
      return {
        [pre]: true,
        [`${pre}-${(type === 'dashboard' && 'circle') || type}`]: true,
        [`${pre}-show-info`]: showInfo,
        [`${pre}-${size}`]: size,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
    });

    const percentNumber = computed(() => {
      const { percent = 0 } = props;
      const successPercent = getSuccessPercent(props);
      return parseInt(
        successPercent !== undefined ? successPercent.toString() : percent.toString(),
        10,
      );
    });

    const progressStatus = computed(() => {
      const { status } = props;
      if (progressStatuses.indexOf(status) < 0 && percentNumber.value >= 100) {
        return 'success';
      }
      return status || 'normal';
    });

    const renderProcessInfo = () => {
      const { showInfo, format, type, percent } = props;
      const successPercent = getSuccessPercent(props);
      if (!showInfo) return null;

      let text: VNodeChild;
      const textFormatter = format || slots?.format || ((val: number) => `${val}%`);
      const isLineType = type === 'line';
      if (
        format ||
        slots?.format ||
        (progressStatus.value !== 'exception' && progressStatus.value !== 'success')
      ) {
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus.value === 'exception') {
        text = isLineType ? <CloseCircleFilled /> : <CloseOutlined />;
      } else if (progressStatus.value === 'success') {
        text = isLineType ? <CheckCircleFilled /> : <CheckOutlined />;
      }
      return (
        <span class={`${prefixCls.value}-text`} title={typeof text === 'string' ? text : undefined}>
          {text}
        </span>
      );
    };

    return () => {
      const { type, steps, strokeColor } = props;
      const progressInfo = renderProcessInfo();

      let progress: VNodeChild;
      // Render progress shape
      if (type === 'line') {
        progress = steps ? (
          <Steps
            {...props}
            strokeColor={typeof strokeColor === 'string' ? strokeColor : undefined}
            prefixCls={prefixCls.value}
            steps={steps}
          >
            {progressInfo}
          </Steps>
        ) : (
          <Line {...props} prefixCls={prefixCls.value}>
            {progressInfo}
          </Line>
        );
      } else if (type === 'circle' || type === 'dashboard') {
        progress = (
          <Circle {...props} prefixCls={prefixCls.value}>
            {progressInfo}
          </Circle>
        );
      }

      const classNames = {
        ...classString.value,
        [`${prefixCls.value}-status-${progressStatus.value}`]: true,
      };

      return <div class={classNames}>{progress}</div>;
    };
  },
});
