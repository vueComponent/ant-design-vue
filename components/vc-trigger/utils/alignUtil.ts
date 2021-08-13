import type { AlignType, BuildInPlacements, AlignPoint } from '../interface';

function isPointsEq(a1: AlignPoint[], a2: AlignPoint[], isAlignPoint: boolean): boolean {
  if (isAlignPoint) {
    return a1[0] === a2[0];
  }
  return a1[0] === a2[0] && a1[1] === a2[1];
}

export function getAlignFromPlacement(
  builtinPlacements: BuildInPlacements,
  placementStr: string,
  align: AlignType,
): AlignType {
  const baseAlign = builtinPlacements[placementStr] || {};
  return {
    ...baseAlign,
    ...align,
  };
}

export function getAlignPopupClassName(
  builtinPlacements: BuildInPlacements,
  prefixCls: string,
  align: AlignType,
  isAlignPoint: boolean,
): string {
  const { points } = align;

  const placements = Object.keys(builtinPlacements);

  for (let i = 0; i < placements.length; i += 1) {
    const placement = placements[i];
    if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
      return `${prefixCls}-placement-${placement}`;
    }
  }

  return '';
}
