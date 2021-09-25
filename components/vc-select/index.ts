import type { ExportedSelectProps } from './Select';
import Select, { selectProps } from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import { selectBaseProps } from './generate';
import type { ExtractPropTypes } from 'vue';

export type SelectProps<T = any> = Partial<ExtractPropTypes<ExportedSelectProps<T>>>;
export { Option, OptGroup, selectBaseProps, selectProps };

export default Select;
