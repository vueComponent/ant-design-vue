import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { ScreenSizeMap } from '../_util/responsiveObserve';
export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;
export interface AvatarContextType {
  size?: AvatarSize;
  shape?: 'circle' | 'square';
}
const AvatarContextKey: InjectionKey<AvatarContextType> = Symbol('AvatarContextKey');

export const useAvatarInjectContext = () => {
  return inject(AvatarContextKey, {});
};
export const useAvatarProviderContext = (context: AvatarContextType) => {
  return provide(AvatarContextKey, context);
};
