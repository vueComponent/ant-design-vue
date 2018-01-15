function isPointsEq (a1, a2) {
  return a1[0] === a2[0] && a1[1] === a2[1]
}

export function getAlignFromPlacement (builtinPlacements, placementStr, align) {
  const baseAlign = builtinPlacements[placementStr] || {}
  return {
    ...baseAlign,
    ...align,
  }
}

export function getPopupClassNameFromAlign (builtinPlacements, prefixCls, align) {
  const points = align.points
  for (const placement in builtinPlacements) {
    if (builtinPlacements.hasOwnProperty(placement)) {
      if (isPointsEq(builtinPlacements[placement].points, points)) {
        return `${prefixCls}-placement-${placement}`
      }
    }
  }
  return ''
}
export function noop () {
}
