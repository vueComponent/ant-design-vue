import type { App, Plugin } from 'vue';
import Base from './Base';
import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';
import Typography from './Typography';

export type { TypographyProps } from './Typography';

Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;
Typography.Link = Link;
Typography.Base = Base;

Typography.install = function (app: App) {
  app.component(Typography.name, Typography);
  app.component(Typography.Text.displayName, Text);
  app.component(Typography.Title.displayName, Title);
  app.component(Typography.Paragraph.displayName, Paragraph);
  app.component(Typography.Link.displayName, Link);
  return app;
};

export {
  Text as TypographyText,
  Title as TypographyTitle,
  Paragraph as TypographyParagraph,
  Link as TypographyLink,
};

export default Typography as typeof Typography &
  Plugin & {
    readonly Text: typeof Text;
    readonly Title: typeof Title;
    readonly Paragraph: typeof Paragraph;
    readonly Link: typeof Link;
    readonly Base: typeof Base;
  };
