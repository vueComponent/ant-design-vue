import type { ExportedSelectProps } from './Select';
import Select from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import { BaseProps } from './generate';

export type SelectProps<T = any> = ExportedSelectProps<T>;
export { Option, OptGroup, BaseProps };

export default Select;
