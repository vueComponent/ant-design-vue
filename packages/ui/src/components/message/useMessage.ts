import { createApp, reactive, h, type VNode } from 'vue'
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

// ─── Global config ──────────────────────────────────────────────

const globalConfig: MessageConfigOptions = {
  top: 8,
  duration: 3,
  maxCount: undefined,
}

const containerConfig = reactive<Pick<MessageConfigOptions, 'top' | 'rtl'>>({
  top: globalConfig.top,
  rtl: globalConfig.rtl,
})

// ─── Helpers ────────────────────────────────────────────────────

// VNodes don't have a `content` property, so this safely distinguishes MessageArgsProps from VNode
function isArgsProps(content: unknown): content is MessageArgsProps {
  return !!content && typeof content === 'object' && 'content' in (content as MessageArgsProps)
}

// ─── Message controller factory ─────────────────────────────────

function createMessageController(idPrefix: string, beforeAdd?: () => void) {
  const messages = reactive<InternalMessageItem[]>([])
  const resolvers = new Map<string, Array<() => void>>()
  let seed = 0

  function genId() {
    return `${idPrefix}-${++seed}`
  }

  function addResolver(id: string, resolve: () => void) {
    const list = resolvers.get(id) ?? []
    list.push(resolve)
    resolvers.set(id, list)
  }

  function flushResolvers(id: string) {
    const list = resolvers.get(id)
    if (!list?.length) return
    resolvers.delete(id)
    list.forEach((r) => r())
  }

  function remove(id: string) {
    const idx = messages.findIndex((m) => m.id === id)
    if (idx > -1) {
      const [item] = messages.splice(idx, 1)
      item.args.onClose?.()
      flushResolvers(id)
    }
  }

  function buildReturn(id: string): MessageReturn {
    const destroy = (() => remove(id)) as MessageReturn
    destroy.then = (onfulfilled, onrejected) => {
      const p = new Promise<void>((resolve) => {
        if (!messages.some((m) => m.id === id)) {
          resolve()
          return
        }
        addResolver(id, resolve)
      })
      return p.then(onfulfilled, onrejected)
    }
    return destroy
  }

  function add(args: MessageArgsProps): MessageReturn {
    beforeAdd?.()

    if (args.key != null) {
      const existing = messages.find((m) => m.args.key === args.key)
      if (existing) {
        existing.args = {
          ...args,
          duration: args.duration ?? globalConfig.duration ?? 3,
        }
        return buildReturn(existing.id)
      }
    }

    // Enforce maxCount with a fixed snapshot to avoid re-entrant infinite loops.
    if (globalConfig.maxCount && messages.length >= globalConfig.maxCount) {
      const removeCount = messages.length - globalConfig.maxCount + 1
      const idsToRemove = messages.slice(0, removeCount).map((m) => m.id)
      idsToRemove.forEach((id) => remove(id))
    }

    const id = genId()
    messages.push({
      id,
      args: {
        ...args,
        duration: args.duration ?? globalConfig.duration ?? 3,
      },
    })
    return buildReturn(id)
  }

  function destroy(key?: string | number) {
    if (key != null) {
      const item = messages.find((m) => m.args.key === key)
      if (item) remove(item.id)
    } else {
      while (messages.length) {
        remove(messages[0].id)
      }
    }
  }

  function typeFn(type: MessageType) {
    return (
      content: MessageContent | MessageArgsProps,
      duration?: number,
      onClose?: () => void,
    ): MessageReturn => {
      if (isArgsProps(content)) {
        return add({ ...content, type })
      }
      return add({ content, type, duration, onClose })
    }
  }

  return { messages, add, remove, destroy, typeFn }
}

// ─── Instance builder ───────────────────────────────────────────

function buildInstance(
  ctrl: ReturnType<typeof createMessageController>,
  configFn: (options: MessageConfigOptions) => void,
): MessageInstance {
  return {
    info: ctrl.typeFn('info'),
    success: ctrl.typeFn('success'),
    error: ctrl.typeFn('error'),
    warning: ctrl.typeFn('warning'),
    warn: ctrl.typeFn('warning'),
    loading: ctrl.typeFn('loading'),
    open: (args: MessageArgsProps) => ctrl.add(args),
    destroy: ctrl.destroy,
    config: configFn,
    useMessage: useMessageHook,
  }
}

// ─── Global singleton (createApp-based) ─────────────────────────

let mounted = false
let containerApp: ReturnType<typeof createApp> | null = null
let containerEl: HTMLElement | null = null

function ensureMounted() {
  if (mounted || typeof document === 'undefined') return

  const container = document.createElement('div')
  const host = globalConfig.getContainer?.() ?? document.body
  host.appendChild(container)
  containerEl = container

  containerApp = createApp(MessageContainer, {
    messages: globalCtrl.messages,
    config: containerConfig,
    onClose: (id: string) => {
      globalCtrl.remove(id)
    },
  })

  containerApp.mount(container)
  mounted = true
}

const globalCtrl = createMessageController('ant-message', ensureMounted)

export const message: MessageInstance = buildInstance(globalCtrl, (options) => {
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
})

// ─── Hook-based useMessage ──────────────────────────────────────

function useMessageHook(): readonly [MessageInstance, () => VNode | null] {
  const ctrl = createMessageController('ant-message-hook')

  const instance = buildInstance(ctrl, (options) => {
    Object.assign(globalConfig, options)
    containerConfig.top = globalConfig.top
    containerConfig.rtl = globalConfig.rtl
  })

  const contextHolder = () =>
    h(MessageContainer, {
      messages: ctrl.messages,
      config: containerConfig,
      onClose: ctrl.remove,
    })

  return [instance, contextHolder] as const
}
