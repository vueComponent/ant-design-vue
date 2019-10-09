// based on vc-select 8.9.0
import ProxySelect, { Select } from './Select';
import Option from './Option';
import { SelectPropTypes } from './PropTypes';
import OptGroup from './OptGroup';
Select.Option = Option;
Select.OptGroup = OptGroup;
ProxySelect.Option = Option;
ProxySelect.OptGroup = OptGroup;
export { Select, Option, OptGroup, SelectPropTypes };
export default ProxySelect;
