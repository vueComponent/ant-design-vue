import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { RadioGroupContext, RadioOptionTypeContextProps } from './interface';

const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('radioGroupContextKey');
export const useProvideRadioGroupContext = (props: RadioGroupContext) => {
  provide(radioGroupContextKey, props);
};

export const useInjectRadioGroupContext = () => {
  return inject(radioGroupContextKey, undefined);
};

const radioOptionTypeContextKey: InjectionKey<RadioOptionTypeContextProps> = Symbol(
  'radioOptionTypeContextKey',
);
export const useProvideRadioOptionTypeContext = (props: RadioOptionTypeContextProps) => {
  provide(radioOptionTypeContextKey, props);
};

export const useInjectRadioOptionTypeContext = () => {
  return inject(radioOptionTypeContextKey, undefined);
};
