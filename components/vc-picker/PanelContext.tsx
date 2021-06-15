import { inject, InjectionKey, provide, Ref } from 'vue';
import type { OnSelect, PanelMode } from './interface';

export type ContextOperationRefProps = {
  onKeyDown?: (e: KeyboardEvent) => boolean;
  onClose?: () => void;
};

export type PanelContextProps = {
  operationRef?: Ref<ContextOperationRefProps | null>;
  /** Only work with time panel */
  hideHeader?: boolean;
  panelRef?: Ref<HTMLDivElement>;
  hidePrevBtn?: boolean;
  hideNextBtn?: boolean;
  onDateMouseEnter?: (date: any) => void;
  onDateMouseLeave?: (date: any) => void;
  onSelect?: OnSelect<any>;
  hideRanges?: boolean;
  open?: boolean;
  mode?: PanelMode;

  /** Only used for TimePicker and this is a deprecated prop */
  defaultOpenValue?: any;
};


const PanelContextKey: InjectionKey<PanelContextProps> = Symbol('PanelContextProps');

export const useProvidePanel = (props: PanelContextProps) => {
  provide(PanelContextKey, props);
};

export const useInjectPanel = () => {
  return inject(PanelContextKey);
};

export default PanelContextKey;
