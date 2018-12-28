
interface Config {
  top?: string,
  duration?: number,
  maxCount?: number,
  getContainer?: () => HTMLElement
}

export interface AMessage {
  success (content: string, duration?: number, onClose?: () => void): void,

  error (content: string, duration?: number, onClose?: () => void): void,

  info (content: string, duration?: number, onClose?: () => void): void,

  warning (content: string, duration?: number, onClose?: () => void): void,

  warn (content: string, duration?: number, onClose?: () => void): void,

  loading (content: string, duration?: number, onClose?: () => void): void,
  
  config (options: Config): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $message: AMessage
  }
}
