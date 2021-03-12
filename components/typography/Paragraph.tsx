import { FunctionalComponent } from 'vue';
import Base, { BlockProps } from './Base';

const Paragraph: FunctionalComponent<BlockProps> = (props, { slots, attrs }) => {
  const paragraphProps = {
    ...props,
    component: 'div',
    ...attrs,
  };

  return <Base {...paragraphProps}>{slots.default?.()}</Base>;
};

Paragraph.displayName = 'ATypographyParagraph';
Paragraph.inheritAttrs = false;

export default Paragraph;
