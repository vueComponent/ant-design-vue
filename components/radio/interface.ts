import type { RadioProps } from './Radio';
import type { Ref } from 'vue';
export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean;
}

export interface RadioChangeEvent {
  target: RadioChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface RadioGroupContext {
  stateValue: Ref;
  props: RadioProps;
  onRadioChange: (e: RadioChangeEvent) => void;
}
