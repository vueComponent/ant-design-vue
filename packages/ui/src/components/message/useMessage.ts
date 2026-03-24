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
const containerConfig = reactive<Pick<MessageConfigOptions, 'top' | 'rtl'>>({
  top: globalConfig.top,
  rtl: globalConfig.rtl,
})

let mounted = false
let containerApp: ReturnType<typeof createApp> | null = null
let containerEl: HTMLElement | null = null

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

function ensureMounted() {
  if (mounted || typeof document === 'undefined') return

  const container = document.createElement('div')
  const host = globalConfig.getContainer?.() ?? document.body
  host.appendChild(container)
  containerEl = container

  containerApp = createApp(MessageContainer, {
    messages,
    config: containerConfig,
    onClose: (id: string) => {
      removeMessage(id)
    },
  })

  containerApp.mount(container)
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
  const destroy = (() => removeMessage(id)) as MessageReturn
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
  return destroy
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

  // Enforce maxCount with a fixed snapshot to avoid re-entrant infinite loops.
  if (globalConfig.maxCount && messages.length >= globalConfig.maxCount) {
    const removeCount = messages.length - globalConfig.maxCount + 1
    const idsToRemove = messages.slice(0, removeCount).map((m) => m.id)
    idsToRemove.forEach((id) => {
      removeMessage(id)
    })
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
    let nextContainer: HTMLElement | null | undefined
    let moveContainer = false

    if (mounted && containerEl && options.getContainer) {
      nextContainer = options.getContainer()
      moveContainer = !!nextContainer && nextContainer !== containerEl.parentElement
    }

    Object.assign(globalConfig, options)
    containerConfig.top = globalConfig.top
    containerConfig.rtl = globalConfig.rtl

    if (moveContainer && containerEl && nextContainer) {
      nextContainer.appendChild(containerEl)
    }
  },
  useMessage: () => [message, () => null],
}
