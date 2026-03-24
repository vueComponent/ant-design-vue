import { createApp, reactive } from 'vue'
import MessageContainer from './MessageContainer.vue'
import type {
  MessageArgsProps,
  MessageContent,
  MessageConfigOptions,
  MessageInstance,
  MessageReturn,
  MessageType,
  InternalMessageItem,
} from './types'

let seed = 0
function genId() {
  return `ant-message-${++seed}`
}

// Global state
const messages = reactive<InternalMessageItem[]>([])
const globalConfig: MessageConfigOptions = {
  top: 8,
  duration: 3,
  maxCount: undefined,
}

let mounted = false
let containerApp: ReturnType<typeof createApp> | null = null
let containerEl: HTMLElement | null = null
let messageRootEl: HTMLElement | null = null

const closeResolvers = new Map<string, Array<() => void>>()

function addCloseResolver(id: string, resolve: () => void) {
  const list = closeResolvers.get(id) ?? []
  list.push(resolve)
  closeResolvers.set(id, list)
}

function flushCloseResolvers(id: string) {
  const list = closeResolvers.get(id)
  if (!list?.length) return
  closeResolvers.delete(id)
  list.forEach((resolve) => resolve())
}

function syncContainerStyles() {
  if (!messageRootEl) return

  if (globalConfig.top != null) {
    messageRootEl.style.top =
      typeof globalConfig.top === 'number' ? `${globalConfig.top}px` : globalConfig.top
  }

  messageRootEl.classList.toggle('ant-message-rtl', globalConfig.rtl === true)
}

function ensureMounted() {
  if (mounted || typeof document === 'undefined') return

  const container = document.createElement('div')
  const host = globalConfig.getContainer?.() ?? document.body
  host.appendChild(container)
  containerEl = container

  containerApp = createApp(MessageContainer, {
    messages,
    top: globalConfig.top,
    rtl: globalConfig.rtl,
    onClose: (id: string) => {
      removeMessage(id)
    },
  })

  containerApp.mount(container)
  messageRootEl = container.querySelector('.ant-message') as HTMLElement | null
  syncContainerStyles()
  mounted = true
}

function removeMessage(id: string) {
  const idx = messages.findIndex((m) => m.id === id)
  if (idx > -1) {
    const [item] = messages.splice(idx, 1)
    item.args.onClose?.()
    flushCloseResolvers(id)
  }
}

function buildMessageReturn(id: string): MessageReturn {
  const destroy = () => removeMessage(id)
  destroy.then = (onfulfilled, onrejected) => {
    const closePromise = new Promise<void>((resolve) => {
      const exists = messages.some((m) => m.id === id)
      if (!exists) {
        resolve()
        return
      }
      addCloseResolver(id, resolve)
    })

    return closePromise.then(onfulfilled, onrejected)
  }
  return destroy as MessageReturn
}

function addMessage(args: MessageArgsProps): MessageReturn {
  ensureMounted()

  // If key exists, update the existing message
  if (args.key != null) {
    const existing = messages.find((m) => m.args.key === args.key)
    if (existing) {
      existing.args = {
        ...args,
        duration: args.duration ?? globalConfig.duration ?? 3,
      }
      return buildMessageReturn(existing.id)
    }
  }

  // Enforce maxCount
  if (globalConfig.maxCount && messages.length >= globalConfig.maxCount) {
    while (messages.length >= globalConfig.maxCount) {
      removeMessage(messages[0].id)
    }
  }

  const id = genId()
  const item: InternalMessageItem = {
    id,
    args: {
      ...args,
      duration: args.duration ?? globalConfig.duration ?? 3,
    },
  }

  messages.push(item)

  return buildMessageReturn(id)
}

function isArgsProps(content: unknown): content is MessageArgsProps {
  return !!content && typeof content === 'object' && 'content' in (content as MessageArgsProps)
}

function createTypeFn(type: MessageType) {
  return (
    content: MessageContent | MessageArgsProps,
    duration?: number,
    onClose?: () => void,
  ): MessageReturn => {
    if (isArgsProps(content)) {
      return addMessage({
        ...content,
        type,
      })
    }

    return addMessage({ content, type, duration, onClose })
  }
}

export const message: MessageInstance = {
  info: createTypeFn('info'),
  success: createTypeFn('success'),
  error: createTypeFn('error'),
  warning: createTypeFn('warning'),
  warn: createTypeFn('warning'),
  loading: createTypeFn('loading'),
  open: (args: MessageArgsProps) => addMessage(args),
  destroy: (key?: string | number) => {
    if (key != null) {
      const item = messages.find((m) => m.args.key === key)
      if (item) removeMessage(item.id)
    } else {
      while (messages.length) {
        removeMessage(messages[0].id)
      }
    }
  },
  config: (options: MessageConfigOptions) => {
    const moveContainer =
      mounted && !!options.getContainer && containerEl && options.getContainer() !== containerEl.parentElement

    Object.assign(globalConfig, options)

    if (moveContainer && containerEl) {
      options.getContainer?.().appendChild(containerEl)
    }

    syncContainerStyles()
  },
  useMessage: () => [message, () => null],
}
