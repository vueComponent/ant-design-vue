import type { CSSProperties } from 'vue';
import getScrollBarSize from '../../_util/getScrollBarSize';
import setStyle from '../../_util/setStyle';

export interface scrollLockOptions {
  container: HTMLElement;
}

interface Ilocks {
  target: typeof uuid;
  options: scrollLockOptions;
}

let locks: Ilocks[] = [];
const scrollingEffectClassName = 'ant-scrolling-effect';
const scrollingEffectClassNameReg = new RegExp(`${scrollingEffectClassName}`, 'g');

let uuid = 0;

// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
const cacheStyle = new Map<Element, CSSProperties>();

export default class ScrollLocker {
  private lockTarget: typeof uuid;

  private options: scrollLockOptions;

  constructor(options?: scrollLockOptions) {
    // eslint-disable-next-line no-plusplus
    this.lockTarget = uuid++;
    this.options = options;
  }

  getContainer = (): HTMLElement | undefined => {
    return this.options?.container;
  };

  // if options change...
  reLock = (options?: scrollLockOptions) => {
    const findLock = locks.find(({ target }) => target === this.lockTarget);

    if (findLock) {
      this.unLock();
    }

    this.options = options;

    if (findLock) {
      findLock.options = options;
      this.lock();
    }
  };

  lock = () => {
    // If lockTarget exist return
    if (locks.some(({ target }) => target === this.lockTarget)) {
      return;
    }

    // If same container effect, return
    if (locks.some(({ options }) => options?.container === this.options?.container)) {
      locks = [...locks, { target: this.lockTarget, options: this.options }];
      return;
    }

    let scrollBarSize = 0;
    const container = this.options?.container || document.body;

    if (
      (container === document.body &&
        window.innerWidth - document.documentElement.clientWidth > 0) ||
      container.scrollHeight > container.clientHeight
    ) {
      scrollBarSize = getScrollBarSize();
    }

    const containerClassName = container.className;

    if (
      locks.filter(({ options }) => options?.container === this.options?.container).length === 0
    ) {
      cacheStyle.set(
        container,
        setStyle(
          {
            width: scrollBarSize !== 0 ? `calc(100% - ${scrollBarSize}px)` : undefined,
            overflow: 'hidden',
            overflowX: 'hidden',
            overflowY: 'hidden',
          },
          {
            element: container,
          },
        ),
      );
    }

    // https://github.com/ant-design/ant-design/issues/19729
    if (!scrollingEffectClassNameReg.test(containerClassName)) {
      const addClassName = `${containerClassName} ${scrollingEffectClassName}`;
      container.className = addClassName.trim();
    }

    locks = [...locks, { target: this.lockTarget, options: this.options }];
  };

  unLock = () => {
    const findLock = locks.find(({ target }) => target === this.lockTarget);

    locks = locks.filter(({ target }) => target !== this.lockTarget);

    if (
      !findLock ||
      locks.some(({ options }) => options?.container === findLock.options?.container)
    ) {
      return;
    }

    // Remove Effect
    const container = this.options?.container || document.body;
    const containerClassName = container.className;

    if (!scrollingEffectClassNameReg.test(containerClassName)) return;

    setStyle(cacheStyle.get(container), { element: container });
    cacheStyle.delete(container);
    container.className = container.className.replace(scrollingEffectClassNameReg, '').trim();
  };
}
