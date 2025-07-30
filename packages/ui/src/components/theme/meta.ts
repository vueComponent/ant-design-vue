import { PropType, ExtractPublicPropTypes } from 'vue'

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
    default: '#1677FF',
  },
  /**
   * Specifies the danger color of the component
   * @default '#ff4d4f'
   */
  dangerColor: {
    type: String,
    default: '#ff4d4f',
  },
} as const

export type ThemeProps = ExtractPublicPropTypes<typeof themeProps>
