import type { ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import omit from '../_util/omit';
import { tupleNum } from '../_util/type';
import warning from '../_util/warning';
import Base, { baseProps } from './Base';

const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4, 5);

export const titleProps = () => ({
  ...omit(baseProps(), ['component', 'strong']),
  level: Number as PropType<(typeof TITLE_ELE_LIST)[number]>,
});

export type TitleProps = Partial<ExtractPropTypes<ReturnType<typeof titleProps>>>;

const Title: FunctionalComponent<TitleProps> = (props, { slots, attrs }) => {
  const { level = 1, ...restProps } = props;
  let component: string;
  if (TITLE_ELE_LIST.includes(level)) {
    component = `h${level}`;
  } else {
    warning(false, 'Typography', 'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.');
    component = 'h1';
  }

  const titleProps = {
    ...restProps,
    component,
    ...attrs,
  };

  return <Base {...titleProps} v-slots={slots}></Base>;
};

Title.displayName = 'ATypographyTitle';
Title.inheritAttrs = false;
Title.props = titleProps();

export default Title;
