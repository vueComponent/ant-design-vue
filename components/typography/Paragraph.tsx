import type { ExtractPropTypes, FunctionalComponent } from 'vue';
import omit from '../_util/omit';
import Base, { baseProps } from './Base';

export const paragraphProps = () => omit(baseProps(), ['component']);

export type ParagraphProps = Partial<ExtractPropTypes<ReturnType<typeof paragraphProps>>>;

const Paragraph: FunctionalComponent<ParagraphProps> = (props, { slots, attrs }) => {
  const paragraphProps = {
    ...props,
    component: 'div',
    ...attrs,
  };

  return <Base {...paragraphProps} v-slots={slots}></Base>;
};

Paragraph.displayName = 'ATypographyParagraph';
Paragraph.inheritAttrs = false;
Paragraph.props = paragraphProps();

export default Paragraph;
