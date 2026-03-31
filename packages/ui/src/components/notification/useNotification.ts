import { createApp, reactive, type App } from 'vue'
import NotificationContainer from './NotificationContainer.vue'
import type {
  NotificationArgsProps,
  NotificationConfigProps,
  NotificationInstance,
  NotificationType,
  NotificationPlacement,
  InternalNotificationItem,
} from './types'

type MountedPlacement = {
  app: App
  container: HTMLElement
}

type PlacementState = {
  placement: NotificationPlacement
  items: InternalNotificationItem[]
  top?: number | string
  bottom?: number | string
  getContainer?: () => HTMLElement
  rtl?: boolean
}

let seed = 0
function genId() {
  return `ant-notification-${++seed}`
}

// Group notifications by placement
const placementMap = reactive<Record<string, InternalNotificationItem[]>>({})
const placementStateMap = reactive<Record<string, PlacementState>>({})
const mountedPlacements = new Map<string, MountedPlacement>()

const globalConfig: NotificationConfigProps = {
  top: 24,
  bottom: 24,
  duration: 4.5,
  placement: 'topRight',
}

function getPlacementKey(placement: NotificationPlacement) {
  return placement
}

function getPlacementItems(placementKey: string): InternalNotificationItem[] {
  if (!placementMap[placementKey]) {
    placementMap[placementKey] = reactive<InternalNotificationItem[]>([])
  }
  return placementMap[placementKey]
}

function getPlacementState(
  placement: NotificationPlacement,
  args: Pick<NotificationArgsProps, 'top' | 'bottom' | 'getContainer'>,
) {
  const placementKey = getPlacementKey(placement)

  if (!placementStateMap[placementKey]) {
    placementStateMap[placementKey] = reactive({
      placement,
      items: getPlacementItems(placementKey),
      top: args.top ?? globalConfig.top,
      bottom: args.bottom ?? globalConfig.bottom,
      getContainer: args.getContainer ?? globalConfig.getContainer,
      rtl: globalConfig.rtl,
    }) as PlacementState
  }

  return placementStateMap[placementKey]
}

function destroyPlacement(placementKey: string) {
  const mountedPlacement = mountedPlacements.get(placementKey)
  if (mountedPlacement) {
    mountedPlacement.app.unmount()
    mountedPlacement.container.parentNode?.removeChild(mountedPlacement.container)
    mountedPlacements.delete(placementKey)
  }

  delete placementMap[placementKey]
  delete placementStateMap[placementKey]
}

function ensurePlacementMounted(
  placement: NotificationPlacement,
  args: Pick<NotificationArgsProps, 'top' | 'bottom' | 'getContainer'>,
) {
  const placementKey = getPlacementKey(placement)
  const placementState = getPlacementState(placement, args)
  placementState.rtl = globalConfig.rtl

  if (mountedPlacements.has(placementKey) || typeof document === 'undefined') return placementKey

  const container = document.createElement('div')
  const mountTarget = placementState.getContainer?.() || document.body
  mountTarget.appendChild(container)

  const app = createApp(NotificationContainer, {
    state: placementState,
    onClose: (id: string) => {
      removeNotification(placementKey, id)
    },
  })

  app.mount(container)
  mountedPlacements.set(placementKey, {
    app,
    container,
  })

  return placementKey
}

function removeNotification(placementKey: string, id: string) {
  const items = getPlacementItems(placementKey)
  const idx = items.findIndex((n) => n.id === id)
  if (idx > -1) {
    const [item] = items.splice(idx, 1)
    item.args.onClose?.()
  }
}

function normalizeArgs(args: NotificationArgsProps): NotificationArgsProps {
  return {
    ...args,
    closeIcon: args.closeIcon !== undefined ? args.closeIcon : globalConfig.closeIcon,
    duration: args.duration !== undefined ? args.duration : (globalConfig.duration ?? 4.5),
  }
}

function addNotification(args: NotificationArgsProps): void {
  const placement = args.placement || globalConfig.placement || 'topRight'
  const placementKey = ensurePlacementMounted(placement, args)
  const normalizedArgs = normalizeArgs({
    ...args,
    placement,
  })

  const items = getPlacementItems(placementKey)

  // If key exists, update existing
  if (args.key !== undefined) {
    const existing = items.find((n) => n.args.key === args.key)
    if (existing) {
      existing.args = normalizedArgs
      existing.updateMark += 1
      return
    }
  }

  // Enforce maxCount
  if (globalConfig.maxCount && items.length >= globalConfig.maxCount) {
    items.splice(0, items.length - globalConfig.maxCount + 1)
  }

  const id = genId()
  items.push({
    id,
    args: normalizedArgs,
    updateMark: 0,
  })
}

function createTypeFn(type: NotificationType) {
  return (args: NotificationArgsProps): void => {
    addNotification({ ...args, type })
  }
}

export const notification: NotificationInstance = {
  success: createTypeFn('success'),
  info: createTypeFn('info'),
  warning: createTypeFn('warning'),
  warn: createTypeFn('warning'),
  error: createTypeFn('error'),
  open: (args: NotificationArgsProps) => addNotification(args),
  close: (key: string) => {
    for (const placementKey of Object.keys(placementMap)) {
      const items = placementMap[placementKey]
      const item = items.find((n) => n.args.key === key)
      if (item) {
        removeNotification(placementKey, item.id)
        return
      }
    }
  },
  destroy: () => {
    const allPlacementKeys = new Set<string>([
      ...Object.keys(placementMap),
      ...mountedPlacements.keys(),
    ])

    for (const placementKey of allPlacementKeys) {
      destroyPlacement(placementKey)
    }
  },
  config: (options: NotificationConfigProps) => {
    Object.assign(globalConfig, options)

    if (options.rtl !== undefined) {
      for (const placementKey of Object.keys(placementStateMap)) {
        placementStateMap[placementKey].rtl = globalConfig.rtl
      }
    }
  },
}
