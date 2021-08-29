export type FocusEventHandler = (e: FocusEvent) => void;
export type MouseEventHandler = (e: MouseEvent) => void;
export type KeyboardEventHandler = (e: KeyboardEvent) => void;
export type ChangeEvent = Event & {
  target: {
    value?: string | undefined;
  };
};

export type EventHandler = (...args: any[]) => void;
