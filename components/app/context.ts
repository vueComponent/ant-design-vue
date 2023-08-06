import { provide, inject, reactive } from 'vue';
import type { InjectionKey } from 'vue';
import type { MessageInstance, ConfigOptions as MessageConfig } from '../message/interface';
import type { NotificationInstance, NotificationConfig } from '../notification/interface';
import type { ModalStaticFunctions } from '../modal/confirm';

export type AppConfig = {
  message?: MessageConfig;
  notification?: NotificationConfig;
};

export const AppConfigContextKey: InjectionKey<AppConfig> = Symbol('appConfigContext');

export const useProvideAppConfigContext = (appConfigContext: AppConfig) => {
  return provide(AppConfigContextKey, appConfigContext);
};

export const useInjectAppConfigContext = () => {
  return inject(AppConfigContextKey, {});
};

type ModalType = Omit<ModalStaticFunctions, 'warn'>;

export interface useAppProps {
  message: MessageInstance;
  notification: NotificationInstance;
  modal: ModalType;
}

export const AppContextKey: InjectionKey<useAppProps> = Symbol('appContext');

export const useProvideAppContext = (appContext: useAppProps) => {
  return provide(AppContextKey, appContext);
};

const defaultAppContext: useAppProps = reactive({
  message: {},
  notification: {},
  modal: {},
} as useAppProps);

export const useInjectAppContext = () => {
  return inject(AppContextKey, defaultAppContext);
};
