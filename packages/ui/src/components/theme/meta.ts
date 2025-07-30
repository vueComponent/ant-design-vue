import { PropType, ExtractPublicPropTypes } from 'vue'

export const defaultColor = '#1677FF'
// Theme Props
export const themeProps = {
  /**
   * Specifies the theme of the component
   * @default 'light'
   */
  appearance: {
    type: String as PropType<'light' | 'dark'>,
    default: 'light',
  },
  /**
   * Specifies the primary color of the component
   * @default '#1677FF'
   */
  primaryColor: {
    type: String,
    default: defaultColor,
  },
  /**
   * Specifies the background color of the component, only used in dark mode
   * @default '#141414'
   */
  backgroundColor: {
    type: String,
    default: '#141414',
  },
} as const

export type ThemeProps = ExtractPublicPropTypes<typeof themeProps>
