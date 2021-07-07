import type { InjectionKey, Ref } from 'vue';
import type { OptionProps } from './Option';

export interface MentionsContext {
  activeIndex: Ref<number>;
  setActiveIndex?: (index: number) => void;
  selectOption?: (option: OptionProps) => void;
  onFocus?: EventListener;
  onBlur?: EventListener;
  loading?: Ref<boolean>;
}

const MentionsContextKey: InjectionKey<MentionsContext> = Symbol('MentionsContextKey');

export default MentionsContextKey;
