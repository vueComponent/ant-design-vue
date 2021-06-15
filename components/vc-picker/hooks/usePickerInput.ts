import type * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { addGlobalMouseDownEvent, getTargetFromEvent } from '../utils/uiUtil';

export default function usePickerInput({
  open,
  value,
  isClickOutside,
  triggerOpen,
  forwardKeyDown,
  onKeyDown,
  blurToCancel,
  onSubmit,
  onCancel,
  onFocus,
  onBlur,
}: {
  open: boolean;
  value: string;
  isClickOutside: (clickElement: EventTarget | null) => boolean;
  triggerOpen: (open: boolean) => void;
  forwardKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, preventDefault: () => void) => void;
  blurToCancel?: boolean;
  onSubmit: () => void | boolean;
  onCancel: () => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}): [React.DOMAttributes<HTMLInputElement>, { focused: boolean; typing: boolean }] {
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);

  /**
   * We will prevent blur to handle open event when user click outside,
   * since this will repeat trigger `onOpenChange` event.
   */
  const preventBlurRef = useRef<boolean>(false);

  const valueChangedRef = useRef<boolean>(false);

  const preventDefaultRef = useRef<boolean>(false);

  const inputProps: React.DOMAttributes<HTMLInputElement> = {
    onMouseDown: () => {
      setTyping(true);
      triggerOpen(true);
    },
    onKeyDown: (e) => {
      const preventDefault = (): void => {
        preventDefaultRef.current = true;
      };

      onKeyDown(e, preventDefault);

      if (preventDefaultRef.current) return;

      switch (e.which) {
        case KeyCode.ENTER: {
          if (!open) {
            triggerOpen(true);
          } else if (onSubmit() !== false) {
            setTyping(true);
          }

          e.preventDefault();
          return;
        }

        case KeyCode.TAB: {
          if (typing && open && !e.shiftKey) {
            setTyping(false);
            e.preventDefault();
          } else if (!typing && open) {
            if (!forwardKeyDown(e) && e.shiftKey) {
              setTyping(true);
              e.preventDefault();
            }
          }
          return;
        }

        case KeyCode.ESC: {
          setTyping(true);
          onCancel();
          return;
        }
      }

      if (!open && ![KeyCode.SHIFT].includes(e.which)) {
        triggerOpen(true);
      } else if (!typing) {
        // Let popup panel handle keyboard
        forwardKeyDown(e);
      }
    },

    onFocus: (e) => {
      setTyping(true);
      setFocused(true);

      if (onFocus) {
        onFocus(e);
      }
    },

    onBlur: (e) => {
      if (preventBlurRef.current || !isClickOutside(document.activeElement)) {
        preventBlurRef.current = false;
        return;
      }

      if (blurToCancel) {
        setTimeout(() => {
          let { activeElement } = document;
          while (activeElement && activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }

          if (isClickOutside(activeElement)) {
            onCancel();
          }
        }, 0);
      } else if (open) {
        triggerOpen(false);

        if (valueChangedRef.current) {
          onSubmit();
        }
      }
      setFocused(false);

      if (onBlur) {
        onBlur(e);
      }
    },
  };

  // check if value changed
  useEffect(() => {
    valueChangedRef.current = false;
  }, [open]);

  useEffect(() => {
    valueChangedRef.current = true;
  }, [value]);

  // Global click handler
  useEffect(() =>
    addGlobalMouseDownEvent((e: MouseEvent) => {
      const target = getTargetFromEvent(e);

      if (open) {
        const clickedOutside = isClickOutside(target);

        if (!clickedOutside) {
          preventBlurRef.current = true;

          // Always set back in case `onBlur` prevented by user
          requestAnimationFrame(() => {
            preventBlurRef.current = false;
          });
        } else if (!focused || clickedOutside) {
          triggerOpen(false);
        }
      }
    }),
  );

  return [inputProps, { focused, typing }];
}
