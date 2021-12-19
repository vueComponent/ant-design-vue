import isVisible from '../../vc-util/Dom/isVisible';
import KeyCode from '../../_util/KeyCode';
import raf from '../../_util/raf';
import type { GenerateConfig } from '../generate';
import type { CustomFormat, PanelMode, PickerMode } from '../interface';

const scrollIds = new Map<HTMLElement, number>();

/** Trigger when element is visible in view */
export function waitElementReady(element: HTMLElement, callback: () => void): () => void {
  let id: number;

  function tryOrNextFrame() {
    if (isVisible(element)) {
      callback();
    } else {
      id = raf(() => {
        tryOrNextFrame();
      });
    }
  }

  tryOrNextFrame();

  return () => {
    raf.cancel(id);
  };
}

/* eslint-disable no-param-reassign */
export function scrollTo(element: HTMLElement, to: number, duration: number) {
  if (scrollIds.get(element)) {
    raf.cancel(scrollIds.get(element)!);
  }

  // jump to target if duration zero
  if (duration <= 0) {
    scrollIds.set(
      element,
      raf(() => {
        element.scrollTop = to;
      }),
    );

    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  scrollIds.set(
    element,
    raf(() => {
      element.scrollTop += perTick;
      if (element.scrollTop !== to) {
        scrollTo(element, to, duration - 10);
      }
    }),
  );
}
/* eslint-enable */

export type KeyboardConfig = {
  onLeftRight?: ((diff: number) => void) | null;
  onCtrlLeftRight?: ((diff: number) => void) | null;
  onUpDown?: ((diff: number) => void) | null;
  onPageUpDown?: ((diff: number) => void) | null;
  onEnter?: (() => void) | null;
};
export function createKeydownHandler(
  event: KeyboardEvent,
  { onLeftRight, onCtrlLeftRight, onUpDown, onPageUpDown, onEnter }: KeyboardConfig,
): boolean {
  const { which, ctrlKey, metaKey } = event;

  switch (which) {
    case KeyCode.LEFT:
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(-1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.RIGHT:
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.UP:
      if (onUpDown) {
        onUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.DOWN:
      if (onUpDown) {
        onUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.PAGE_UP:
      if (onPageUpDown) {
        onPageUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.PAGE_DOWN:
      if (onPageUpDown) {
        onPageUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case KeyCode.ENTER:
      if (onEnter) {
        onEnter();
        return true;
      }
      /* istanbul ignore next */
      break;
  }

  return false;
}

// ===================== Format =====================
export function getDefaultFormat<DateType>(
  format: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[] | undefined,
  picker: PickerMode | undefined,
  showTime: boolean | object | undefined,
  use12Hours: boolean | undefined,
) {
  let mergedFormat = format;
  if (!mergedFormat) {
    switch (picker) {
      case 'time':
        mergedFormat = use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        break;

      case 'week':
        mergedFormat = 'gggg-wo';
        break;

      case 'month':
        mergedFormat = 'YYYY-MM';
        break;

      case 'quarter':
        mergedFormat = 'YYYY-[Q]Q';
        break;

      case 'year':
        mergedFormat = 'YYYY';
        break;

      default:
        mergedFormat = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    }
  }

  return mergedFormat;
}

export function getInputSize<DateType>(
  picker: PickerMode | undefined,
  format: string | CustomFormat<DateType>,
  generateConfig: GenerateConfig<DateType>,
) {
  const defaultSize = picker === 'time' ? 8 : 10;
  const length =
    typeof format === 'function' ? format(generateConfig.getNow()).length : format.length;
  return Math.max(defaultSize, length) + 2;
}

// ===================== Window =====================
type ClickEventHandler = (event: MouseEvent) => void;
let globalClickFunc: ClickEventHandler | null = null;
const clickCallbacks = new Set<ClickEventHandler>();

export function addGlobalMousedownEvent(callback: ClickEventHandler) {
  if (!globalClickFunc && typeof window !== 'undefined' && window.addEventListener) {
    globalClickFunc = (e: MouseEvent) => {
      // Clone a new list to avoid repeat trigger events
      [...clickCallbacks].forEach(queueFunc => {
        queueFunc(e);
      });
    };
    window.addEventListener('mousedown', globalClickFunc);
  }

  clickCallbacks.add(callback);

  return () => {
    clickCallbacks.delete(callback);
    if (clickCallbacks.size === 0) {
      window.removeEventListener('mousedown', globalClickFunc!);
      globalClickFunc = null;
    }
  };
}

export function getTargetFromEvent(e: Event) {
  const target = e.target as HTMLElement;

  // get target if in shadow dom
  if (e.composed && target.shadowRoot) {
    return (e.composedPath?.()[0] || target) as HTMLElement;
  }

  return target;
}

// ====================== Mode ======================
const getYearNextMode = (next: PanelMode): PanelMode => {
  if (next === 'month' || next === 'date') {
    return 'year';
  }
  return next;
};

const getMonthNextMode = (next: PanelMode): PanelMode => {
  if (next === 'date') {
    return 'month';
  }
  return next;
};

const getQuarterNextMode = (next: PanelMode): PanelMode => {
  if (next === 'month' || next === 'date') {
    return 'quarter';
  }
  return next;
};

const getWeekNextMode = (next: PanelMode): PanelMode => {
  if (next === 'date') {
    return 'week';
  }
  return next;
};

export const PickerModeMap: Record<PickerMode, ((next: PanelMode) => PanelMode) | null> = {
  year: getYearNextMode,
  month: getMonthNextMode,
  quarter: getQuarterNextMode,
  week: getWeekNextMode,
  time: null,
  date: null,
};

export function elementsContains(
  elements: (HTMLElement | undefined | null)[],
  target: HTMLElement,
) {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return elements.some(ele => ele && ele.contains(target));
}
