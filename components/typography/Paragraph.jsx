import Base, { BlockProps } from './Base';

const Paragraph = {
  functional: true,
  name: 'AParagraph',
  props: BlockProps,
  render(h, ctx) {
    const { props, children, data } = ctx;
    const paragraphProps = {
      ...data,
      props: {
        ...props,
        component: 'div',
      },
    };
    return <Base {...paragraphProps}>{children}</Base>;
  },
};

export default Paragraph;
