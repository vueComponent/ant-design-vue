import type { ExtractPropTypes } from 'vue';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  computed,
} from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import addEventListener from '../vc-util/Dom/addEventListener';
import Affix from '../affix';
import scrollTo from '../_util/scrollTo';
import getScroll from '../_util/getScroll';
import useConfigInject from '../_util/hooks/useConfigInject';
import useProvideAnchor from './context';

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument!.documentElement!;
      return rect.top - container.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const sharpMatcherRegx = /#(\S+)$/;

type Section = {
  link: string;
  top: number;
};

export type AnchorContainer = HTMLElement | Window;

const anchorProps = {
  prefixCls: PropTypes.string,
  offsetTop: PropTypes.number,
  bounds: PropTypes.number,
  affix: PropTypes.looseBool.def(true),
  showInkInFixed: PropTypes.looseBool.def(false),
  getContainer: PropTypes.func.def(getDefaultContainer),
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.style,
  getCurrentAnchor: PropTypes.func,
  targetOffset: PropTypes.number,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export type AnchorProps = Partial<ExtractPropTypes<typeof anchorProps>>;

export interface AnchorState {
  scrollContainer: HTMLElement | Window;
  links: string[];
  scrollEvent: any;
  animating: boolean;
}

export default defineComponent({
  name: 'AAnchor',
  inheritAttrs: false,
  props: anchorProps,
  emits: ['change', 'click'],
  setup(props, { emit, attrs, slots, expose }) {
    const { prefixCls, getTargetContainer, direction } = useConfigInject('anchor', props);
    const inkNodeRef = ref();
    const anchorRef = ref();
    const state = reactive<AnchorState>({
      links: [],
      scrollContainer: null,
      scrollEvent: null,
      animating: false,
    });
    const activeLink = ref(null);
    const getContainer = computed(() => {
      const { getContainer } = props;
      return getContainer || getTargetContainer.value || getDefaultContainer;
    });
    // func...
    const getCurrentAnchor = (offsetTop = 0, bounds = 5) => {
      const linkSections: Array<Section> = [];
      const container = getContainer.value();
      state.links.forEach(link => {
        const sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        const target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          const top = getOffsetTop(target, container);
          if (top < offsetTop + bounds) {
            linkSections.push({
              link,
              top,
            });
          }
        }
      });

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
        return maxSection.link;
      }
      return '';
    };
    const setCurrentActiveLink = (link: string) => {
      const { getCurrentAnchor } = props;
      if (activeLink.value === link) {
        return;
      }
      activeLink.value = typeof getCurrentAnchor === 'function' ? getCurrentAnchor() : link;
      emit('change', link);
    };
    const handleScrollTo = (link: string) => {
      const { offsetTop, getContainer, targetOffset } = props;

      setCurrentActiveLink(link);
      const container = getContainer();
      const scrollTop = getScroll(container, true);
      const sharpLinkMatch = sharpMatcherRegx.exec(link);
      if (!sharpLinkMatch) {
        return;
      }
      const targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) {
        return;
      }

      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      state.animating = true;

      scrollTo(y, {
        callback: () => {
          state.animating = false;
        },
        getContainer,
      });
    };
    expose({
      scrollTo: handleScrollTo,
    });
    const handleScroll = () => {
      if (state.animating) {
        return;
      }
      const { offsetTop, bounds, targetOffset } = props;
      const currentActiveLink = getCurrentAnchor(
        targetOffset !== undefined ? targetOffset : offsetTop || 0,
        bounds,
      );
      setCurrentActiveLink(currentActiveLink);
    };

    const updateInk = () => {
      const linkNode = anchorRef.value.getElementsByClassName(
        `${prefixCls.value}-link-title-active`,
      )[0];
      if (linkNode) {
        (inkNodeRef.value as HTMLElement).style.top = `${
          linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5
        }px`;
      }
    };

    useProvideAnchor({
      registerLink: (link: string) => {
        if (!state.links.includes(link)) {
          state.links.push(link);
        }
      },
      unregisterLink: (link: string) => {
        const index = state.links.indexOf(link);
        if (index !== -1) {
          state.links.splice(index, 1);
        }
      },
      activeLink,
      scrollTo: handleScrollTo,
      handleClick: (e, info) => {
        emit('click', e, info);
      },
    });

    onMounted(() => {
      nextTick(() => {
        const container = getContainer.value();
        state.scrollContainer = container;
        state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
        handleScroll();
      });
    });
    onBeforeUnmount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });
    onUpdated(() => {
      if (state.scrollEvent) {
        const currentContainer = getContainer.value();
        if (state.scrollContainer !== currentContainer) {
          state.scrollContainer = currentContainer;
          state.scrollEvent.remove();
          state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
          handleScroll();
        }
      }
      updateInk();
    });

    return () => {
      const { offsetTop, affix, showInkInFixed } = props;
      const pre = prefixCls.value;
      const inkClass = classNames(`${pre}-ink-ball`, {
        visible: activeLink.value,
      });

      const wrapperClass = classNames(props.wrapperClass, `${pre}-wrapper`, {
        [`${pre}-rtl`]: direction.value === 'rtl',
      });

      const anchorClass = classNames(pre, {
        fixed: !affix && !showInkInFixed,
      });

      const wrapperStyle = {
        maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
        ...props.wrapperStyle,
      };
      const anchorContent = (
        <div class={wrapperClass} style={wrapperStyle} ref={anchorRef}>
          <div class={anchorClass}>
            <div class={`${pre}-ink`}>
              <span class={inkClass} ref={inkNodeRef} />
            </div>
            {slots.default?.()}
          </div>
        </div>
      );

      return !affix ? (
        anchorContent
      ) : (
        <Affix {...attrs} offsetTop={offsetTop} target={getContainer.value}>
          {anchorContent}
        </Affix>
      );
    };
  },
});
