import addEventListener from '../vc-util/Dom/addEventListener';
import type { ComponentPublicInstance } from 'vue';
import supportsPassive from '../_util/supportsPassive';

export type BindElement = HTMLElement | Window | null | undefined;
export type Rect = ClientRect | DOMRect;

export function getTargetRect(target: BindElement): ClientRect {
  return target !== window
    ? (target as HTMLElement).getBoundingClientRect()
    : ({ top: 0, bottom: window.innerHeight } as ClientRect);
}

export function getFixedTop(
  placeholderReact: Rect,
  targetRect: Rect,
  offsetTop: number | undefined,
) {
  if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
    return `${offsetTop + targetRect.top}px`;
  }
  return undefined;
}

export function getFixedBottom(
  placeholderReact: Rect,
  targetRect: Rect,
  offsetBottom: number | undefined,
) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return `${offsetBottom + targetBottomOffset}px`;
  }
  return undefined;
}

// ======================== Observer ========================
const TRIGGER_EVENTS = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
];

interface ObserverEntity {
  target: HTMLElement | Window;
  affixList: ComponentPublicInstance<any>[];
  eventHandlers: { [eventName: string]: any };
}

let observerEntities: ObserverEntity[] = [];

export function getObserverEntities() {
  // Only used in test env. Can be removed if refactor.
  return observerEntities;
}

export function addObserveTarget(
  target: HTMLElement | Window | null,
  affix: ComponentPublicInstance<any>,
): void {
  if (!target) return;

  let entity: ObserverEntity | undefined = observerEntities.find(item => item.target === target);

  if (entity) {
    entity.affixList.push(affix);
  } else {
    entity = {
      target,
      affixList: [affix],
      eventHandlers: {},
    };
    observerEntities.push(entity);

    // Add listener
    TRIGGER_EVENTS.forEach(eventName => {
      entity!.eventHandlers[eventName] = addEventListener(target, eventName, () => {
        entity!.affixList.forEach(
          targetAffix => {
            const { lazyUpdatePosition } = (targetAffix as any).exposed;
            lazyUpdatePosition();
          },
          (eventName === 'touchstart' || eventName === 'touchmove') && supportsPassive
            ? ({ passive: true } as EventListenerOptions)
            : false,
        );
      });
    });
  }
}

export function removeObserveTarget(affix: ComponentPublicInstance<any>): void {
  const observerEntity = observerEntities.find(oriObserverEntity => {
    const hasAffix = oriObserverEntity.affixList.some(item => item === affix);
    if (hasAffix) {
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(item => item !== affix);
    }
    return hasAffix;
  });

  if (observerEntity && observerEntity.affixList.length === 0) {
    observerEntities = observerEntities.filter(item => item !== observerEntity);

    // Remove listener
    TRIGGER_EVENTS.forEach(eventName => {
      const handler = observerEntity.eventHandlers[eventName];
      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
}
