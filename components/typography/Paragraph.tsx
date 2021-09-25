import type { FunctionalComponent } from 'vue';
import omit from '../_util/omit';
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
Paragraph.props = omit(baseProps(), ['component']) as any;

export default Paragraph;
