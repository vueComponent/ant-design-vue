import { inject, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import Line from './line';
import Circle from './circle';
import { validProgress } from './utils';

const ProgressStatuses = ['normal', 'exception', 'active', 'success'];

export interface ProgressProps {
  prefixCls?: string;
  type?: 'line' | 'circle' | 'dashboard';
  percent?: number;
  successPercent?: number;
  format?: Function;
  status?: 'normal' | 'exception' | 'active' | 'success';
  showInfo?: boolean;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeColor?: string | object;
  trailColor?: string;
  width?: number;
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'default' | 'small';
}

export default defineComponent({
  name: 'AProgress',
  setup(props: ProgressProps, { emit, attrs, slots }) {
    const { configProvider } = inject('configProvider', ConfigConsumerProps);

    const getPercentNumber = () => {
      const { successPercent, percent = 0 } = props;
      return parseInt(
        successPercent !== undefined ? successPercent.toString() : percent.toString(),
        10,
      );
    };

    const getProgressStatus = () => {
      const { status } = props;
      if (ProgressStatuses.indexOf(status) < 0 && getPercentNumber() >= 100) {
        return 'success';
      }
      return status || 'normal';
    };

    const renderProcessInfo = (prefixCls, progressStatus) => {
      const { showInfo, format, type, percent, successPercent } = props;
      if (!showInfo) return null;

      let text;
      const textFormatter = format || slots.format || (percentNumber => `${percentNumber}%`);
      const isLineType = type === 'line';
      if (
        format ||
        slots.format ||
        (progressStatus !== 'exception' && progressStatus !== 'success')
      ) {
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus === 'exception') {
        text = isLineType ? <CloseCircleFilled /> : <CloseOutlined />;
      } else if (progressStatus === 'success') {
        text = isLineType ? <CheckCircleFilled /> : <CheckOutlined />;
      }
      return (
        <span class={`${prefixCls}-text`} title={typeof text === 'string' ? text : undefined}>
          {text}
        </span>
      );
    };

    return () => {
      const { prefixCls: customizePrefixCls, size, type, showInfo } = props;
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('progress', customizePrefixCls);
      const progressStatus = getProgressStatus();
      const progressInfo = renderProcessInfo(prefixCls, progressStatus);

      let progress;

      // Render progress shape
      if (type === 'line') {
        const lineProps = {
          ...props,
          prefixCls,
        };
        progress = <Line {...lineProps}>{progressInfo}</Line>;
      } else if (type === 'circle' || type === 'dashboard') {
        const circleProps = {
          ...props,
          prefixCls,
          progressStatus,
        };
        progress = <Circle {...circleProps}>{progressInfo}</Circle>;
      }

      const classString = classNames(prefixCls, {
        [`${prefixCls}-${(type === 'dashboard' && 'circle') || type}`]: true,
        [`${prefixCls}-status-${progressStatus}`]: true,
        [`${prefixCls}-show-info`]: showInfo,
        [`${prefixCls}-${size}`]: size,
      });

      const progressProps = {
        class: classString,
      };
      return <div {...progressProps}>{progress}</div>;
    };
  },
});
