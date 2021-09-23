import type { FunctionalComponent } from 'vue';
import omit from '../_util/omit';
import { tupleNum } from '../_util/type';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import type { BlockProps } from './Base';
import Base, { baseProps } from './Base';

const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4, 5);

export type TitleProps = Omit<BlockProps & { level?: typeof TITLE_ELE_LIST[number] }, 'strong'>;

const Title: FunctionalComponent<TitleProps> = (props, { slots, attrs }) => {
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
    ...attrs,
  };

  return <Base {...titleProps} v-slots={slots}></Base>;
};

Title.displayName = 'ATypographyTitle';
Title.inheritAttrs = false;
Title.props = omit({ ...baseProps(), level: PropTypes.number }, ['component', 'strong']) as any;

export default Title;
