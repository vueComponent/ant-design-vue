import Select, { ExportedSelectProps } from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import { BaseProps } from './generate';

export type SelectProps<T> = ExportedSelectProps<T>;
export { Option, OptGroup, BaseProps };

export default Select;
