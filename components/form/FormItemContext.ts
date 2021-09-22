import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide } from 'vue';

export type FormItemContext = {
  id: ComputedRef<string>;
  onFieldBlur: () => void;
  onFieldChange: () => void;
  clearValidate: () => void;
};

type ContextProps = FormItemContext;

const ContextKey: InjectionKey<ContextProps> = Symbol('ContextProps');

export const useProvideFormItemContext = (props: ContextProps) => {
  provide(ContextKey, props);
};

export const useInjectFormItemContext = () => {
  const defaultContext: ContextProps = {
    id: computed(() => undefined),
    onFieldBlur: () => {},
    onFieldChange: () => {},
    clearValidate: () => {},
  };

  // We should prevent the passing of context for children

  provide(ContextKey, defaultContext);
  return inject(ContextKey, defaultContext);
};
