import type { ExtractPropTypes, PropType } from 'vue';
import omit from '../_util/omit';
import type { VueNode } from '../_util/type';
import { eventType } from '../_util/type';
import type { CompositionEventHandler } from '../_util/EventInterface';
import { inputProps as vcInputProps } from '../vc-input/inputProps';

export const inputDefaultValue = Symbol() as unknown as string;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}
const inputProps = () => {
  return omit(vcInputProps(), [
    'wrapperClassName',
    'groupClassName',
    'inputClassName',
    'affixWrapperClassName',
  ]);
};
export default inputProps;
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;
export interface ShowCountProps {
  formatter: (args: { count: number; maxlength?: number }) => VueNode;
}
const textAreaProps = () => ({
  ...omit(inputProps(), ['prefix', 'addonBefore', 'addonAfter', 'suffix']),
  rows: Number,
  autosize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  autoSize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  onResize: { type: Function as PropType<(size: { width: number; height: number }) => void> },
  onCompositionstart: eventType<CompositionEventHandler>(),
  onCompositionend: eventType<CompositionEventHandler>(),
  valueModifiers: Object,
});

export { textAreaProps };

export type TextAreaProps = Partial<ExtractPropTypes<ReturnType<typeof textAreaProps>>>;
