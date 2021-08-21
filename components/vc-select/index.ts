import type { ExportedSelectProps } from './Select';
import Select from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import { selectBaseProps } from './generate';

export type SelectProps<T = any> = ExportedSelectProps<T>;
export { Option, OptGroup, selectBaseProps };

export default Select;
