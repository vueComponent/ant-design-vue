import { useRafState } from '../hooks/useRaf';
import TabNode from './TabNode';
import type {
  TabSizeMap,
  TabPosition,
  RenderTabBar,
  TabsLocale,
  EditableConfig,
  AnimatedConfig,
  OnTabScroll,
  TabBarExtraPosition,
  TabBarExtraContent,
} from '../interface';
import useOffsets from '../hooks/useOffsets';
import OperationNode from './OperationNode';
import { useInjectTabs } from '../TabContext';
import useTouchMove from '../hooks/useTouchMove';
import AddButton from './AddButton';
import type { Key } from '../../../_util/type';
import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';
import { onBeforeUnmount, defineComponent, ref, watch, watchEffect, computed } from 'vue';
import PropTypes from '../../../_util/vue-types';
import useSyncState from '../hooks/useSyncState';
import useState from '../../../_util/hooks/useState';
import wrapperRaf from '../../../_util/raf';
import classNames from '../../../_util/classNames';
import ResizeObserver from '../../../vc-resize-observer';
import { toPx } from '../../../_util/util';
import useRefs from '../../../_util/hooks/useRefs';
const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0, right: 0 };
const tabNavListProps = () => {
  return {
    id: { type: String },
    tabPosition: { type: String as PropType<TabPosition> },
    activeKey: { type: [String, Number] },
    rtl: { type: Boolean },
    animated: { type: Object as PropType<AnimatedConfig>, default: undefined as AnimatedConfig },
    editable: { type: Object as PropType<EditableConfig> },
    moreIcon: PropTypes.any,
    moreTransitionName: { type: String },
    mobile: { type: Boolean },
    tabBarGutter: { type: Number },
    renderTabBar: { type: Function as PropType<RenderTabBar> },
    locale: { type: Object as PropType<TabsLocale>, default: undefined as TabsLocale },
    onTabClick: {
      type: Function as PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>,
    },
    onTabScroll: { type: Function as PropType<OnTabScroll> },
  };
};

export type TabNavListProps = Partial<ExtractPropTypes<ReturnType<typeof tabNavListProps>>>;

interface ExtraContentProps {
  position: TabBarExtraPosition;
  prefixCls: string;
  extra?: (info?: { position: 'left' | 'right' }) => TabBarExtraContent;
}

export default defineComponent({
  name: 'TabNavList',
  inheritAttrs: false,
  props: tabNavListProps(),
  slots: ['moreIcon', 'leftExtra', 'rightExtra', 'tabBarExtraContent'],
  emits: ['tabClick', 'tabScroll'],
  setup(props, { attrs, slots }) {
    const { tabs, prefixCls } = useInjectTabs();
    const tabsWrapperRef = ref<HTMLDivElement>();
    const tabListRef = ref<HTMLDivElement>();
    const operationsRef = ref<{ $el: HTMLDivElement }>();
    const innerAddButtonRef = ref<HTMLButtonElement>();
    const [setRef, btnRefs] = useRefs();
    const tabPositionTopOrBottom = computed(
      () => props.tabPosition === 'top' || props.tabPosition === 'bottom',
    );

    const [transformLeft, setTransformLeft] = useSyncState(0, (next, prev) => {
      if (tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({ direction: next > prev ? 'left' : 'right' });
      }
    });
    const [transformTop, setTransformTop] = useSyncState(0, (next, prev) => {
      if (!tabPositionTopOrBottom.value && props.onTabScroll) {
        props.onTabScroll({ direction: next > prev ? 'top' : 'bottom' });
      }
    });

    const [wrapperScrollWidth, setWrapperScrollWidth] = useState<number>(0);
    const [wrapperScrollHeight, setWrapperScrollHeight] = useState<number>(0);
    const [wrapperContentWidth, setWrapperContentWidth] = useState<number>(0);
    const [wrapperContentHeight, setWrapperContentHeight] = useState<number>(0);
    const [wrapperWidth, setWrapperWidth] = useState<number>(null);
    const [wrapperHeight, setWrapperHeight] = useState<number>(null);
    const [addWidth, setAddWidth] = useState<number>(0);
    const [addHeight, setAddHeight] = useState<number>(0);

    const [tabSizes, setTabSizes] = useRafState<TabSizeMap>(new Map());
    const tabOffsets = useOffsets(tabs, tabSizes);
    // ========================== Util =========================
    const operationsHiddenClassName = computed(() => `${prefixCls.value}-nav-operations-hidden`);

    const transformMin = ref(0);
    const transformMax = ref(0);

    watchEffect(() => {
      if (!tabPositionTopOrBottom.value) {
        transformMin.value = Math.min(0, wrapperHeight.value - wrapperScrollHeight.value);
        transformMax.value = 0;
      } else if (props.rtl) {
        transformMin.value = 0;
        transformMax.value = Math.max(0, wrapperScrollWidth.value - wrapperWidth.value);
      } else {
        transformMin.value = Math.min(0, wrapperWidth.value - wrapperScrollWidth.value);
        transformMax.value = 0;
      }
    });

    const alignInRange = (value: number): number => {
      if (value < transformMin.value) {
        return transformMin.value;
      }
      if (value > transformMax.value) {
        return transformMax.value;
      }
      return value;
    };

    // ========================= Mobile ========================
    const touchMovingRef = ref<number>();
    const [lockAnimation, setLockAnimation] = useState<number>();

    const doLockAnimation = () => {
      setLockAnimation(Date.now());
    };

    const clearTouchMoving = () => {
      window.clearTimeout(touchMovingRef.value);
    };
    const doMove = (setState: (fn: (val: number) => number) => void, offset: number) => {
      setState((value: number) => {
        const newValue = alignInRange(value + offset);

        return newValue;
      });
    };
    useTouchMove(tabsWrapperRef, (offsetX, offsetY) => {
      if (tabPositionTopOrBottom.value) {
        // Skip scroll if place is enough
        if (wrapperWidth.value >= wrapperScrollWidth.value) {
          return false;
        }

        doMove(setTransformLeft, offsetX);
      } else {
        if (wrapperHeight.value >= wrapperScrollHeight.value) {
          return false;
        }

        doMove(setTransformTop, offsetY);
      }

      clearTouchMoving();
      doLockAnimation();

      return true;
    });

    watch(lockAnimation, () => {
      clearTouchMoving();
      if (lockAnimation.value) {
        touchMovingRef.value = window.setTimeout(() => {
          setLockAnimation(0);
        }, 100);
      }
    });

    // ========================= Scroll ========================
    const scrollToTab = (key = props.activeKey) => {
      const tabOffset = tabOffsets.value.get(key) || {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
      };

      if (tabPositionTopOrBottom.value) {
        // ============ Align with top & bottom ============
        let newTransform = transformLeft.value;

        // RTL
        if (props.rtl) {
          if (tabOffset.right < transformLeft.value) {
            newTransform = tabOffset.right;
          } else if (tabOffset.right + tabOffset.width > transformLeft.value + wrapperWidth.value) {
            newTransform = tabOffset.right + tabOffset.width - wrapperWidth.value;
          }
        }
        // LTR
        else if (tabOffset.left < -transformLeft.value) {
          newTransform = -tabOffset.left;
        } else if (tabOffset.left + tabOffset.width > -transformLeft.value + wrapperWidth.value) {
          newTransform = -(tabOffset.left + tabOffset.width - wrapperWidth.value);
        }

        setTransformTop(0);
        setTransformLeft(alignInRange(newTransform));
      } else {
        // ============ Align with left & right ============
        let newTransform = transformTop.value;

        if (tabOffset.top < -transformTop.value) {
          newTransform = -tabOffset.top;
        } else if (tabOffset.top + tabOffset.height > -transformTop.value + wrapperHeight.value) {
          newTransform = -(tabOffset.top + tabOffset.height - wrapperHeight.value);
        }

        setTransformLeft(0);
        setTransformTop(alignInRange(newTransform));
      }
    };

    const visibleStart = ref(0);
    const visibleEnd = ref(0);

    watchEffect(() => {
      let unit: 'width' | 'height';
      let position: 'left' | 'top' | 'right';
      let transformSize: number;
      let basicSize: number;
      let tabContentSize: number;
      let addSize: number;

      if (['top', 'bottom'].includes(props.tabPosition)) {
        unit = 'width';
        basicSize = wrapperWidth.value;
        tabContentSize = wrapperContentWidth.value;
        addSize = addWidth.value;
        position = props.rtl ? 'right' : 'left';
        transformSize = Math.abs(transformLeft.value);
      } else {
        unit = 'height';
        basicSize = wrapperHeight.value;
        tabContentSize = wrapperContentHeight.value;
        addSize = addHeight.value;
        position = 'top';
        transformSize = -transformTop.value;
      }

      let mergedBasicSize = basicSize;
      if (tabContentSize + addSize > basicSize) {
        mergedBasicSize = basicSize - addSize;
      }

      const tabsVal = tabs.value;
      if (!tabsVal.length) {
        return ([visibleStart.value, visibleEnd.value] = [0, 0]);
      }

      const len = tabsVal.length;
      let endIndex = len;
      for (let i = 0; i < len; i += 1) {
        const offset = tabOffsets.value.get(tabsVal[i].key) || DEFAULT_SIZE;
        if (offset[position] + offset[unit] > transformSize + mergedBasicSize) {
          endIndex = i - 1;
          break;
        }
      }
      let startIndex = 0;
      for (let i = len - 1; i >= 0; i -= 1) {
        const offset = tabOffsets.value.get(tabsVal[i].key) || DEFAULT_SIZE;
        if (offset[position] < transformSize) {
          startIndex = i + 1;
          break;
        }
      }

      return ([visibleStart.value, visibleEnd.value] = [startIndex, endIndex]);
    });

    const onListHolderResize = () => {
      // Update wrapper records
      const offsetWidth = tabsWrapperRef.value?.offsetWidth || 0;
      const offsetHeight = tabsWrapperRef.value?.offsetHeight || 0;
      const newAddWidth = innerAddButtonRef.value?.offsetWidth || 0;
      const newAddHeight = innerAddButtonRef.value?.offsetHeight || 0;
      const newOperationWidth = operationsRef.value?.$el.offsetWidth || 0;
      const newOperationHeight = operationsRef.value?.$el.offsetHeight || 0;

      setWrapperWidth(offsetWidth);
      setWrapperHeight(offsetHeight);
      setAddWidth(newAddWidth);
      setAddHeight(newAddHeight);

      const newWrapperScrollWidth = (tabListRef.value?.offsetWidth || 0) - newAddWidth;
      const newWrapperScrollHeight = (tabListRef.value?.offsetHeight || 0) - newAddHeight;

      setWrapperScrollWidth(newWrapperScrollWidth);
      setWrapperScrollHeight(newWrapperScrollHeight);

      const isOperationHidden = operationsRef.value?.$el.className.includes(
        operationsHiddenClassName.value,
      );
      setWrapperContentWidth(newWrapperScrollWidth - (isOperationHidden ? 0 : newOperationWidth));
      setWrapperContentHeight(
        newWrapperScrollHeight - (isOperationHidden ? 0 : newOperationHeight),
      );

      // Update buttons records
      setTabSizes(() => {
        const newSizes: TabSizeMap = new Map();
        tabs.value.forEach(({ key }) => {
          const btnRef = btnRefs.value.get(key);
          const btnNode = (btnRef as any)?.$el || btnRef;
          if (btnNode) {
            newSizes.set(key, {
              width: btnNode.offsetWidth,
              height: btnNode.offsetHeight,
              left: btnNode.offsetLeft,
              top: btnNode.offsetTop,
            });
          }
        });
        return newSizes;
      });
    };

    // ======================== Dropdown =======================
    const hiddenTabs = computed(() => [
      ...tabs.value.slice(0, visibleStart.value),
      ...tabs.value.slice(visibleEnd.value + 1),
    ]);

    // =================== Link & Operations ===================
    const [inkStyle, setInkStyle] = useState<CSSProperties>();

    const activeTabOffset = computed(() => tabOffsets.value.get(props.activeKey));

    // Delay set ink style to avoid remove tab blink
    const inkBarRafRef = ref<number>();
    const cleanInkBarRaf = () => {
      wrapperRaf.cancel(inkBarRafRef.value);
    };

    watch([activeTabOffset, tabPositionTopOrBottom, () => props.rtl], () => {
      const newInkStyle: CSSProperties = {};

      if (activeTabOffset.value) {
        if (tabPositionTopOrBottom.value) {
          if (props.rtl) {
            newInkStyle.right = toPx(activeTabOffset.value.right);
          } else {
            newInkStyle.left = toPx(activeTabOffset.value.left);
          }

          newInkStyle.width = toPx(activeTabOffset.value.width);
        } else {
          newInkStyle.top = toPx(activeTabOffset.value.top);
          newInkStyle.height = toPx(activeTabOffset.value.height);
        }
      }

      cleanInkBarRaf();
      inkBarRafRef.value = wrapperRaf(() => {
        setInkStyle(newInkStyle);
      });
    });

    watch(
      [() => props.activeKey, activeTabOffset, tabOffsets, tabPositionTopOrBottom],
      () => {
        scrollToTab();
      },
      { flush: 'post' },
    );

    watch(
      [() => props.rtl, () => props.tabBarGutter, () => props.activeKey, () => tabs.value],
      () => {
        onListHolderResize();
      },
      { flush: 'post' },
    );

    const ExtraContent = ({ position, prefixCls, extra }: ExtraContentProps) => {
      if (!extra) return null;
      const content = extra?.({ position });
      return content ? <div class={`${prefixCls}-extra-content`}>{content}</div> : null;
    };

    onBeforeUnmount(() => {
      clearTouchMoving();
      cleanInkBarRaf();
    });

    return () => {
      const {
        id,
        animated,
        activeKey,
        rtl,
        editable,
        locale,
        tabPosition,
        tabBarGutter,
        onTabClick,
      } = props;
      const { class: className, style } = attrs;
      const pre = prefixCls.value;
      // ========================= Render ========================
      const hasDropdown = !!hiddenTabs.value.length;
      const wrapPrefix = `${pre}-nav-wrap`;
      let pingLeft: boolean;
      let pingRight: boolean;
      let pingTop: boolean;
      let pingBottom: boolean;

      if (tabPositionTopOrBottom.value) {
        if (rtl) {
          pingRight = transformLeft.value > 0;
          pingLeft = transformLeft.value + wrapperWidth.value < wrapperScrollWidth.value;
        } else {
          pingLeft = transformLeft.value < 0;
          pingRight = -transformLeft.value + wrapperWidth.value < wrapperScrollWidth.value;
        }
      } else {
        pingTop = transformTop.value < 0;
        pingBottom = -transformTop.value + wrapperHeight.value < wrapperScrollHeight.value;
      }

      const tabNodeStyle: CSSProperties = {};
      if (tabPosition === 'top' || tabPosition === 'bottom') {
        tabNodeStyle[rtl ? 'marginRight' : 'marginLeft'] =
          typeof tabBarGutter === 'number' ? `${tabBarGutter}px` : tabBarGutter;
      } else {
        tabNodeStyle.marginTop =
          typeof tabBarGutter === 'number' ? `${tabBarGutter}px` : tabBarGutter;
      }

      const tabNodes = tabs.value.map((tab, i) => {
        const { key } = tab;
        return (
          <TabNode
            id={id}
            prefixCls={pre}
            key={key}
            tab={tab}
            /* first node should not have margin left */
            style={i === 0 ? undefined : tabNodeStyle}
            closable={tab.closable}
            editable={editable}
            active={key === activeKey}
            removeAriaLabel={locale?.removeAriaLabel}
            ref={setRef(key)}
            onClick={e => {
              onTabClick(key, e);
            }}
            onFocus={() => {
              scrollToTab(key);
              doLockAnimation();
              if (!tabsWrapperRef.value) {
                return;
              }
              // Focus element will make scrollLeft change which we should reset back
              if (!rtl) {
                tabsWrapperRef.value.scrollLeft = 0;
              }
              tabsWrapperRef.value.scrollTop = 0;
            }}
            v-slots={slots}
          ></TabNode>
        );
      });
      return (
        <div
          ref={ref}
          role="tablist"
          class={classNames(`${pre}-nav`, className)}
          style={style}
          onKeydown={() => {
            // No need animation when use keyboard
            doLockAnimation();
          }}
        >
          <ExtraContent position="left" prefixCls={pre} extra={slots.leftExtra} />

          <ResizeObserver onResize={onListHolderResize}>
            <div
              class={classNames(wrapPrefix, {
                [`${wrapPrefix}-ping-left`]: pingLeft,
                [`${wrapPrefix}-ping-right`]: pingRight,
                [`${wrapPrefix}-ping-top`]: pingTop,
                [`${wrapPrefix}-ping-bottom`]: pingBottom,
              })}
              ref={tabsWrapperRef}
            >
              <ResizeObserver onResize={onListHolderResize}>
                <div
                  ref={tabListRef}
                  class={`${pre}-nav-list`}
                  style={{
                    transform: `translate(${transformLeft.value}px, ${transformTop.value}px)`,
                    transition: lockAnimation.value ? 'none' : undefined,
                  }}
                >
                  {tabNodes}
                  <AddButton
                    ref={innerAddButtonRef}
                    prefixCls={pre}
                    locale={locale}
                    editable={editable}
                    style={{
                      ...(tabNodes.length === 0 ? undefined : tabNodeStyle),
                      visibility: hasDropdown ? 'hidden' : null,
                    }}
                  />

                  <div
                    class={classNames(`${pre}-ink-bar`, {
                      [`${pre}-ink-bar-animated`]: animated.inkBar,
                    })}
                    style={inkStyle.value}
                  />
                </div>
              </ResizeObserver>
            </div>
          </ResizeObserver>
          <OperationNode
            {...props}
            ref={operationsRef}
            prefixCls={pre}
            tabs={hiddenTabs.value}
            class={!hasDropdown && operationsHiddenClassName.value}
          />

          <ExtraContent position="right" prefixCls={pre} extra={slots.rightExtra} />
          <ExtraContent position="right" prefixCls={pre} extra={slots.tabBarExtraContent} />
        </div>
      );
    };
  },
});
