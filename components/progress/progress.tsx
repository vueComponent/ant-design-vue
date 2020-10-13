import { inject, HTMLAttributes, defineComponent, SetupContext } from 'vue';
import classNames from '../_util/classNames';
import { ConfigConsumerProps } from '../config-provider';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import Line from './line';
import Circle from './circle';
import { validProgress } from './utils';
import { PresetColorType, PresetStatusColorType } from '../_util/colors';
import { LiteralUnion } from '../_util/type';

const ProgressStatuses = ['normal', 'exception', 'active', 'success'];
type ProgressStatuses = string | 'normal' | 'exception' | 'active' | 'success';
type ProgressType = string | 'line' | 'circle' | 'dashboard';
type ProgressSize = string | 'default' | 'small';
const initDefaultProps = {
  type: 'line',
  percent: 0,
  showInfo: true,
  trailColor: '#f3f3f3',
  size: 'default',
  gapDegree: 0,
  strokeLinecap: 'round',
};

export interface ProgressProps extends HTMLAttributes {
  prefixCls?: string;
  type?: ProgressType;
  percent?: number;
  successPercent?: number;
  format?: Function;
  status?: ProgressStatuses;
  showInfo?: boolean;
  strokeWidth?: number;
  strokeLinecap?: string | 'butt' | 'round' | 'square';
  strokeColor?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  trailColor?: string;
  width?: number;
  gapDegree?: number;
  gapPosition?: string | 'top' | 'bottom' | 'left' | 'right';
  size?: ProgressSize;
}

export default defineComponent({
  name: 'AProgress',
  setup(_: ProgressProps, { slots, attrs }: SetupContext) {
    const progressProps = attrs as ProgressProps;
    const props = {
      ...initDefaultProps,
      ...progressProps,
    };
    const { getPrefixCls } = inject('configProvider', ConfigConsumerProps);
    const getPercentNumber = () => {
      const { successPercent, percent = 0 } = props;
      return parseInt(
        successPercent !== undefined ? successPercent.toString() : percent.toString(),
        10,
      );
    };

    const getProgressStatus = () => {
      const { status = '' } = props;
      if (ProgressStatuses.indexOf(status) < 0 && getPercentNumber() >= 100) {
        return 'success';
      }
      return status || 'normal';
    };

    const renderProcessInfo = (prefixCls: string, progressStatus: string) => {
      const { showInfo, format, type, percent, successPercent } = props;
      if (!showInfo) return null;

      let text;
      const textFormatter =
        format || slots.format || ((percentNumber: number) => `${percentNumber}%`);
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
