export type FocusEventHandler = (e: FocusEvent) => void;
export type MouseEventHandler = (e: MouseEvent) => void;
export type KeyboardEventHandler = (e: KeyboardEvent) => void;
export type CompositionEventHandler = (e: CompositionEvent) => void;
export type ClipboardEventHandler = (e: ClipboardEvent) => void;
export type ChangeEventHandler = (e: ChangeEvent) => void;
export type WheelEventHandler = (e: WheelEvent) => void;
export type ChangeEvent = Event & {
  target: {
    value?: string | undefined;
  };
};
export type CheckboxChangeEvent = Event & {
  target: {
    checked?: boolean;
  };
};

export type EventHandler = (...args: any[]) => void;
