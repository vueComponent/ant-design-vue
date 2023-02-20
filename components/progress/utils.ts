import { presetPrimaryColors } from '@ant-design/colors';
import devWarning from '../vc-util/devWarning';
import type { CircleProps } from './Circle';
import type { ProgressProps } from './props';

export function validProgress(progress: number | undefined) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}

export function getSuccessPercent({ success, successPercent }: ProgressProps) {
  let percent = successPercent;
  /** @deprecated Use `percent` instead */
  if (success && 'progress' in success) {
    devWarning(
      false,
      'Progress',
      '`success.progress` is deprecated. Please use `success.percent` instead.',
    );
    percent = success.progress;
  }
  if (success && 'percent' in success) {
    percent = success.percent;
  }
  return percent;
}

export function getPercentage({ percent, success, successPercent }: ProgressProps) {
  const realSuccessPercent = validProgress(getSuccessPercent({ success, successPercent }));
  return [realSuccessPercent, validProgress(validProgress(percent) - realSuccessPercent)];
}

export function getStrokeColor({
  success = {},
  strokeColor,
}: Partial<CircleProps>): (string | Record<string, string>)[] {
  const { strokeColor: successColor } = success;
  return [successColor || presetPrimaryColors.green, strokeColor || null!];
}
