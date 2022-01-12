import type { RefObject } from '../../_util/createRef';

import type { EventHandler } from '../../_util/EventInterface';
import type { VueNode } from '../../_util/type';
import type { Mode, DisplayValueType } from '../BaseSelect';

export interface InnerSelectorProps {
  prefixCls: string;
  id: string;
  mode: Mode;
  inputRef: RefObject;
  placeholder?: VueNode;
  disabled?: boolean;
  autofocus?: boolean;
  autocomplete?: string;
  values: DisplayValueType[];
  showSearch?: boolean;
  searchValue: string;
  activeDescendantId: string;
  open: boolean;
  tabindex?: number | string;
  onInputKeyDown: EventHandler;
  onInputMouseDown: EventHandler;
  onInputChange: EventHandler;
  onInputPaste: EventHandler;
  onInputCompositionStart: EventHandler;
  onInputCompositionEnd: EventHandler;
}
