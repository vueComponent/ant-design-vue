/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { BaseSelectProps } from '../BaseSelect';

export interface BaseSelectContextProps extends BaseSelectProps {
  triggerOpen: boolean;
  multiple: boolean;
  toggleOpen: (open?: boolean) => void;
}

const BaseSelectContextKey: InjectionKey<BaseSelectContextProps> = Symbol('BaseSelectContextKey');

export function useProvideBaseSelectProps(props: BaseSelectContextProps) {
  return provide(BaseSelectContextKey, props);
}

export default function useBaseProps() {
  return inject(BaseSelectContextKey, {} as BaseSelectContextProps);
}
