// based on vc-select 9.2.2
import Select from './Select';
import Option from './Option';
import { SelectPropTypes } from './PropTypes';
import OptGroup from './OptGroup';
Select.Option = Option;
Select.OptGroup = OptGroup;
export { Select, Option, OptGroup, SelectPropTypes };
export default Select;
