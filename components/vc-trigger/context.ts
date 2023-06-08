import type { InjectionKey, Ref } from 'vue';
import { computed, inject, provide } from 'vue';
export interface TriggerContextProps {
  setPortal: (val?: any) => void;
  popPortal: boolean; // 将 portal 上传至父级元素渲染，不用考虑响应式
}
const TriggerContextKey: InjectionKey<TriggerContextProps> = Symbol('TriggerContextKey');
export const useProviderTrigger = () => {
  let portal = null;
  provide(TriggerContextKey, {
    setPortal(val) {
      portal = val;
    },
    popPortal: true,
  });
  return () => {
    return portal;
  };
};

export const useInjectTrigger = (tryPopPortal?: boolean) => {
  return tryPopPortal
    ? inject(TriggerContextKey, { setPortal: () => {}, popPortal: false })
    : { setPortal: () => {}, popPortal: false };
};

export interface PortalContextProps {
  shouldRender: Ref<boolean>;
  inTriggerContext: boolean; // 仅处理 trigger 上下文的 portal
}
const PortalContextKey: InjectionKey<PortalContextProps> = Symbol('PortalContextKey');
export const useProvidePortal = (instance: any, config = { inTriggerContext: true }) => {
  provide(PortalContextKey, {
    inTriggerContext: config.inTriggerContext,
    shouldRender: computed(() => {
      const { sPopupVisible, popupRef, forceRender, autoDestroy } = instance || {};
      // if (popPortal) return true;
      let shouldRender = false;
      if (sPopupVisible || popupRef || forceRender) {
        shouldRender = true;
      }
      if (!sPopupVisible && autoDestroy) {
        shouldRender = false;
      }
      return shouldRender;
    }),
  });
};

export const useInjectPortal = () => {
  useProvidePortal({}, { inTriggerContext: false });
  const portalContext = inject(PortalContextKey, {
    shouldRender: computed(() => false),
    inTriggerContext: false,
  });
  return {
    shouldRender: computed(
      () => portalContext.shouldRender.value || portalContext.inTriggerContext === false,
    ),
  };
};
