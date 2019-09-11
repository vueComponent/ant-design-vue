import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';
import Line from './line';
import Circle from './circle';
import { validProgress } from './utils';

function addUnit(num, unit) {
  const unitType = unit || 'px';
  return num ? num + unitType : null;
}

export const ProgressType = PropTypes.oneOf(['line', 'circle', 'dashboard']);
export const ProgressSize = PropTypes.oneOf(['default', 'small']);

export const ProgressProps = {
  prefixCls: PropTypes.string,
  type: ProgressType,
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(['normal', 'success', 'active', 'exception']),
  showInfo: PropTypes.bool,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['round', 'square']),
  strokeColor: PropTypes.string,
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: ProgressSize,
};

export default {
  name: 'AProgress',
  props: initDefaultProps(ProgressProps, {
    type: 'line',
    percent: 0,
    showInfo: true,
    trailColor: '#f3f3f3',
    size: 'default',
    gapDegree: 0,
    strokeLinecap: 'round',
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    renderProcessInfo(prefixCls, progressStatus) {
      const { showInfo, format, type, percent, successPercent } = this.$props;
      if (!showInfo) return null;

      let text;
      const textFormatter = format || (percentNumber => `${percentNumber}%`);
      const iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';
      if (format || (progressStatus !== 'exception' && progressStatus !== 'success')) {
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus === 'exception') {
        text = <Icon type={`close${iconType}`} theme={type === 'line' ? 'filled' : 'outlined'} />;
      } else if (progressStatus === 'success') {
        text = <Icon type={`check${iconType}`} theme={type === 'line' ? 'filled' : 'outlined'} />;
      }
      return (
        <span class={`${prefixCls}-text`} title={typeof text === 'string' ? text : undefined}>
          {text}
        </span>
      );
    },
  },
  render() {
    const props = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      percent = 0,
      status,
      format,
      trailColor,
      size,
      successPercent,
      type,
      strokeWidth,
      width,
      showInfo,
      gapDegree = 0,
      gapPosition,
      strokeColor,
      strokeLinecap = 'round',
      ...restProps
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('progress', customizePrefixCls);

    const progressStatus =
      parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10) >=
        100 && !('status' in props)
        ? 'success'
        : status || 'normal';
    let progress;
    const progressInfo = this.renderProcessInfo(prefixCls, progressStatus);

    // Render progress shape
    if (type === 'line') {
      const lineProps = {
        props: {
          ...props,
          prefixCls,
        },
      };
      progress = <Line {...lineProps}>{progressInfo}</Line>;
    } else if (type === 'circle' || type === 'dashboard') {
      const circleProps = {
        props: {
          ...props,
          prefixCls,
          progressStatus,
        },
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
      props: {
        ...restProps,
      },
      on: this.$listeners,
      class: classString,
    };
    return <div {...progressProps}>{progress}</div>;
  },
};
