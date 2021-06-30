import type { Ref, InjectionKey } from 'vue';

export type SiderCollapsed = Ref<boolean>;

export const SiderCollapsedKey: InjectionKey<SiderCollapsed> = Symbol('siderCollapsed');

export interface SiderHookProvider {
  addSider?: (id: string) => void;
  removeSider?: (id: string) => void;
}

export const SiderHookProviderKey: InjectionKey<SiderHookProvider> = Symbol('siderHookProvider');
