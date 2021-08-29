import type { RefObject } from '../../_util/createRef';
import type { VNodeChild } from 'vue';
import type { Mode } from '../interface';
import type { LabelValueType } from '../interface/generator';
import type { EventHandler } from '../../_util/EventInterface';

export interface InnerSelectorProps {
  prefixCls: string;
  id: string;
  mode: Mode;
  inputRef: RefObject;
  placeholder?: VNodeChild;
  disabled?: boolean;
  autofocus?: boolean;
  autocomplete?: string;
  values: LabelValueType[];
  showSearch?: boolean;
  searchValue: string;
  accessibilityIndex: number;
  open: boolean;
  tabindex?: number | string;
  onInputKeyDown: EventHandler;
  onInputMouseDown: EventHandler;
  onInputChange: EventHandler;
  onInputPaste: EventHandler;
  onInputCompositionStart: EventHandler;
  onInputCompositionEnd: EventHandler;
}
