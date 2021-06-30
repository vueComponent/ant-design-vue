import type { InjectionKey, Ref } from 'vue';

export interface ListContext {
  grid?: Ref<any>;
  itemLayout?: Ref<string>;
}

export const ListContextKey: InjectionKey<ListContext> = Symbol('ListContextKey');
