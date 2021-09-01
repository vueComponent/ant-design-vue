import type { AnimationType, TransitionNameType } from '../interface';

interface GetMotionProps {
  animation: AnimationType;
  transitionName: TransitionNameType;
  prefixCls: string;
}

export function getMotion({ prefixCls, animation, transitionName }: GetMotionProps) {
  if (animation) {
    return {
      name: `${prefixCls}-${animation}`,
    };
  }

  if (transitionName) {
    return {
      name: transitionName,
    };
  }
  return {};
}
