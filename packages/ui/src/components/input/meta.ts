import { PropType, ExtractPublicPropTypes } from 'vue'

// Input Props
export const inputProps = {
  /**
   * The input value
   */
  modelValue: {
    type: String,
    default: '',
  },
  /**
   * The status of the input
   */
  status: {
    type: String as PropType<'error' | 'warning'>,
    default: undefined,
  },
  /**
   * The placeholder text
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * Whether the input is disabled
   */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const

export type InputProps = ExtractPublicPropTypes<typeof inputProps>

// Input Emits
export const inputEmits = {
  /**
   * Triggered when the input value changes
   */
  'update:modelValue': (value: string) => typeof value === 'string',
  /**
   * Triggered when the input receives focus
   */
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  /**
   * Triggered when the input loses focus
   */
  blur: (e: FocusEvent) => e instanceof FocusEvent,
} as const

export type InputEmits = typeof inputEmits

// Input Slots
export const inputSlots = {} as const

export type InputSlots = typeof inputSlots
