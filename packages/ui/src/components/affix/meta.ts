import { CSSProperties } from 'vue'

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null
}
export const AFFIX_STATUS_NONE = 0
export const AFFIX_STATUS_PREPARE = 1

type AffixStatus = typeof AFFIX_STATUS_NONE | typeof AFFIX_STATUS_PREPARE

export interface AffixState {
  affixStyle?: CSSProperties
  placeholderStyle?: CSSProperties
  status: AffixStatus
  lastAffix: boolean
}

export type AffixProps = {
  /**
   * Specifies the offset top of the affix
   */
  offsetTop?: number
  /**
   * Specifies the offset bottom of the affix
   */
  offsetBottom?: number
  /**
   * Specifies the target of the affix
   */
  target?: () => Window | HTMLElement | null
  /**
   * Specifies the z-index of the affix
   */
  zIndex?: number
}

export const affixDefaultProps = {
  target: getDefaultTarget,
  zIndex: 10,
} as const

export type AffixEmits = {
  /**
   * Triggered when the affix status changes
   * @param lastAffix - The last affix status
   */
  (e: 'change', lastAffix: boolean): void
}
