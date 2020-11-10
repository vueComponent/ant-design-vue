import { FunctionalComponent } from 'vue';
import Base, { BlockProps } from './Base';

const Paragraph: FunctionalComponent<BlockProps> = (props, { slots }) => {
  const paragraphProps = {
    ...props,
    component: 'div',
  };

  return <Base {...paragraphProps}>{slots.default?.()}</Base>;
};

Paragraph.displayName = 'ATypographyParagraph';

export default Paragraph;
