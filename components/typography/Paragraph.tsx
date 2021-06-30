import Omit from 'omit.js';
import type { FunctionalComponent } from 'vue';
import type { BlockProps } from './Base';
import Base, { baseProps } from './Base';

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
