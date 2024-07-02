import type { PropType } from 'vue';
import { defineComponent, toRefs, ref, onUnmounted } from 'vue';

import { clamp } from '../../utils/clamp';

export interface Interaction {
  left: number;
  top: number;
}

// Check if an event was triggered by touch
const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent => 'touches' in event;

// Finds a proper touch point by its identifier
const getTouchPoint = (touches: TouchList, touchId: null | number): Touch => {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === touchId) return touches[i];
  }
  return touches[0];
};

// Finds the proper window object to fix iframe embedding issues
const getParentWindow = (node?: HTMLDivElement | null): Window => {
  return (node && node.ownerDocument.defaultView) || self;
};

// Returns a relative position of the pointer inside the node's bounding box
const getRelativePosition = (
  node: HTMLDivElement,
  event: MouseEvent | TouchEvent,
  touchId: null | number,
): Interaction => {
  const rect = node.getBoundingClientRect();

  // Get user's pointer position from `touches` array if it's a `TouchEvent`
  const pointer = isTouch(event) ? getTouchPoint(event.touches, touchId) : (event as MouseEvent);

  return {
    left: clamp((pointer.pageX - (rect.left + getParentWindow(node).scrollX)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + getParentWindow(node).scrollY)) / rect.height),
  };
};

// Browsers introduced an intervention, making touch events passive by default.
// This workaround removes `preventDefault` call from the touch handlers.
// https://github.com/facebook/react/issues/19651
const preventDefaultMove = (event: MouseEvent | TouchEvent): void => {
  !isTouch(event) && event.preventDefault();
};

// Prevent mobile browsers from handling mouse events (conflicting with touch ones).
// If we detected a touch interaction before, we prefer reacting to touch events only.
const isInvalid = (event: MouseEvent | TouchEvent, hasTouch: boolean): boolean => {
  return hasTouch && !isTouch(event);
};

export interface InteractiveProps {
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
}

export const Interactive = defineComponent({
  name: 'Interactive',
  props: {
    onMove: { type: Function as PropType<(interaction: Interaction) => void> },
    onKey: { type: Function as PropType<(offset: Interaction) => void> },
  },
  setup(props, { attrs, slots }) {
    const { onMove, onKey } = toRefs(props);

    const container = ref<HTMLDivElement>(null);
    const touchId = ref<null | number>(null);
    const hasTouch = ref(false);

    const dragEventObj = () => {
      const handleMoveStart = (event: MouseEvent | TouchEvent) => {
        const el = container.value;
        if (!el) return;

        // Prevent text selection
        preventDefaultMove(event);

        if (isInvalid(event, hasTouch.value) || !el) return;

        if (isTouch(event)) {
          hasTouch.value = true;
          const changedTouches = event.changedTouches || [];
          if (changedTouches.length) touchId.value = changedTouches[0].identifier;
        }

        el.focus();
        onMove.value(getRelativePosition(el, event, touchId.value));
        toggleDocumentEvents(true);
      };

      const handleMove = (event: MouseEvent | TouchEvent) => {
        // Prevent text selection
        preventDefaultMove(event);

        // If user moves the pointer outside of the window or iframe bounds and release it there,
        // `mouseup`/`touchend` won't be fired. In order to stop the picker from following the cursor
        // after the user has moved the mouse/finger back to the document, we check `event.buttons`
        // and `event.touches`. It allows us to detect that the user is just moving his pointer
        // without pressing it down
        const isDown = isTouch(event) ? event.touches.length > 0 : event.buttons > 0;

        if (isDown && container.value) {
          onMove.value(getRelativePosition(container.value, event, touchId.value));
        } else {
          toggleDocumentEvents(false);
        }
      };

      const handleMoveEnd = () => toggleDocumentEvents(false);

      const handleKeyDown = (event: any) => {
        const keyCode = event.which || event.keyCode;

        // Ignore all keys except arrow ones
        if (keyCode < 37 || keyCode > 40) return;
        // Do not scroll page by arrow keys when document is focused on the element
        event.preventDefault();
        // Send relative offset to the parent component.
        // We use codes (37←, 38↑, 39→, 40↓) instead of keys ('ArrowRight', 'ArrowDown', etc)
        // to reduce the size of the library
        onKey.value({
          left: keyCode === 39 ? 0.05 : keyCode === 37 ? -0.05 : 0,
          top: keyCode === 40 ? 0.05 : keyCode === 38 ? -0.05 : 0,
        });
      };

      function toggleDocumentEvents(state?: boolean) {
        const touch = hasTouch.value;
        const el = container.value;
        const parentWindow = getParentWindow(el);

        // Add or remove additional pointer event listeners
        const toggleEvent = state
          ? parentWindow.addEventListener
          : parentWindow.removeEventListener;
        toggleEvent(touch ? 'touchmove' : 'mousemove', handleMove);
        toggleEvent(touch ? 'touchend' : 'mouseup', handleMoveEnd);
      }

      return { handleMoveStart, handleKeyDown, toggleDocumentEvents };
    };

    const { handleMoveStart, handleKeyDown, toggleDocumentEvents } = dragEventObj();

    // Remove window event listeners before unmounting
    onUnmounted(() => {
      toggleDocumentEvents(false);
    });

    return () => {
      return (
        <div
          {...attrs}
          onTouchstart={handleMoveStart}
          onMousedown={handleMoveStart}
          onKeydown={handleKeyDown}
          class="vue-colorful__interactive"
          ref={container}
          role="slider"
        >
          {slots.default && slots.default()}
        </div>
      );
    };
  },
});
