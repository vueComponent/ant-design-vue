import type { ComputedRef, HTMLAttributes, Ref } from 'vue';
import { onBeforeUnmount, onMounted, watch, shallowRef, computed } from 'vue';
import type { FocusEventHandler } from '../../_util/EventInterface';
import KeyCode from '../../_util/KeyCode';
import { addGlobalMousedownEvent, getTargetFromEvent } from '../utils/uiUtil';
import raf from '../../_util/raf';

export default function usePickerInput({
  open,
  value,
  isClickOutside,
  triggerOpen,
  forwardKeydown,
  onKeydown,
  blurToCancel,
  onSubmit,
  onCancel,
  onFocus,
  onBlur,
}: {
  open: Ref<boolean>;
  value: Ref<string>;
  isClickOutside: (clickElement: EventTarget | null) => boolean;
  triggerOpen: (open: boolean) => void;
  forwardKeydown: (e: KeyboardEvent) => boolean;
  onKeydown: (e: KeyboardEvent, preventDefault: () => void) => void;
  blurToCancel?: ComputedRef<boolean>;
  onSubmit: () => void | boolean;
  onCancel: () => void;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
}): [ComputedRef<HTMLAttributes>, { focused: Ref<boolean>; typing: Ref<boolean> }] {
  const typing = shallowRef(false);
  const focused = shallowRef(false);

  /**
   * We will prevent blur to handle open event when user click outside,
   * since this will repeat trigger `onOpenChange` event.
   */
  const preventBlurRef = shallowRef<boolean>(false);

  const valueChangedRef = shallowRef<boolean>(false);

  const preventDefaultRef = shallowRef<boolean>(false);

  const inputProps = computed<HTMLAttributes>(() => ({
    onMousedown: () => {
      typing.value = true;
      triggerOpen(true);
    },
    onKeydown: e => {
      const preventDefault = (): void => {
        preventDefaultRef.value = true;
      };

      onKeydown(e, preventDefault);

      if (preventDefaultRef.value) return;

      switch (e.which) {
        case KeyCode.ENTER: {
          if (!open.value) {
            triggerOpen(true);
          } else if (onSubmit() !== false) {
            typing.value = true;
          }

          e.preventDefault();
          return;
        }

        case KeyCode.TAB: {
          if (typing.value && open.value && !e.shiftKey) {
            typing.value = false;
            e.preventDefault();
          } else if (!typing.value && open.value) {
            if (!forwardKeydown(e) && e.shiftKey) {
              typing.value = true;
              e.preventDefault();
            }
          }
          return;
        }

        case KeyCode.ESC: {
          typing.value = true;
          onCancel();
          return;
        }
      }

      if (!open.value && ![KeyCode.SHIFT].includes(e.which)) {
        triggerOpen(true);
      } else if (!typing.value) {
        // Let popup panel handle keyboard
        forwardKeydown(e);
      }
    },

    onFocus: e => {
      typing.value = true;
      focused.value = true;

      if (onFocus) {
        onFocus(e);
      }
    },

    onBlur: e => {
      if (preventBlurRef.value || !isClickOutside(document.activeElement)) {
        preventBlurRef.value = false;
        return;
      }

      if (blurToCancel.value) {
        setTimeout(() => {
          let { activeElement } = document;
          while (activeElement && activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }

          if (isClickOutside(activeElement)) {
            onCancel();
          }
        }, 0);
      } else if (open.value) {
        triggerOpen(false);

        if (valueChangedRef.value) {
          onSubmit();
        }
      }
      focused.value = false;

      if (onBlur) {
        onBlur(e);
      }
    },
  }));

  // check if value changed
  watch(open, () => {
    valueChangedRef.value = false;
  });

  watch(value, () => {
    valueChangedRef.value = true;
  });
  const globalMousedownEvent = shallowRef();
  // Global click handler
  onMounted(() => {
    globalMousedownEvent.value = addGlobalMousedownEvent((e: MouseEvent) => {
      const target = getTargetFromEvent(e);

      if (open.value) {
        const clickedOutside = isClickOutside(target);

        if (!clickedOutside) {
          preventBlurRef.value = true;

          // Always set back in case `onBlur` prevented by user
          raf(() => {
            preventBlurRef.value = false;
          });
        } else if (!focused.value || clickedOutside) {
          triggerOpen(false);
        }
      }
    });
  });
  onBeforeUnmount(() => {
    globalMousedownEvent.value && globalMousedownEvent.value();
  });

  return [inputProps, { focused, typing }];
}
