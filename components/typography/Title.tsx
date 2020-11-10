import { FunctionalComponent } from 'vue';
import { tupleNum } from '../_util/type';
import warning from '../_util/warning';
import Base, { BlockProps } from './Base';

const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4, 5);

export type TitleProps = Omit<BlockProps & { level?: typeof TITLE_ELE_LIST[number] }, 'strong'>;

const Title: FunctionalComponent<TitleProps> = (props, { slots }) => {
  const { level = 1, ...restProps } = props;
  let component: string;
  if (TITLE_ELE_LIST.indexOf(level) !== -1) {
    component = `h${level}`;
  } else {
    warning(false, 'Typography', 'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.');
    component = 'h1';
  }

  const titleProps = {
    ...restProps,
    component,
  };

  return <Base {...titleProps}>{slots.default?.()}</Base>;
};

Title.displayName = 'ATypographyTitle';

export default Title;
