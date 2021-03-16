import Omit from 'omit.js';
import { FunctionalComponent } from 'vue';
import Base, { BlockProps, baseProps } from './Base';

const Paragraph: FunctionalComponent<BlockProps> = (props, { slots, attrs }) => {
  const paragraphProps = {
    ...props,
    component: 'div',
    ...attrs,
  };

  return <Base {...paragraphProps} v-slots={slots}></Base>;
};

Paragraph.displayName = 'ATypographyParagraph';
Paragraph.inheritAttrs = false;
Paragraph.props = Omit(baseProps(), ['component']);

export default Paragraph;
