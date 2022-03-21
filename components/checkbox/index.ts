import Checkbox from './Checkbox';
import CheckboxGroup from './Group';
export type { CheckboxProps, CheckboxGroupProps, CheckboxOptionType } from './interface';
export { checkboxProps, checkboxGroupProps } from './interface';

/* istanbul ignore next */
export { CheckboxGroup };

export default Object.assign(Checkbox, {
  Group: CheckboxGroup,
});
